const {BigQuery} = require('@google-cloud/bigquery');
const Queue = require('promise-queue');
const CSV = require('csv-string');
const fs = require('fs');
const runs = require('./runs');
const services = require('./services');

var client = new BigQuery({
  projectId: 'stateofwebfontservices'
});

function query(sql) {
  return client.query({
    query: sql,
  }).then(function (result) {
    return result[0][0];
  });
}

function getData(run) {
  const someServices = Object.keys(services).map(service => service.toLowerCase()).join(' OR ');
  const servicesCount = Object.keys(services).map(service => {
    return `COUNTIF(${service.toLowerCase()}) AS ${service.toLowerCase()}`;
  }).join(', ');

  return query(`
    SELECT
      '${run.split("_").slice(0,-1).join('-')}' AS date,
      COUNT(DISTINCT pageid) AS pages,
      COUNTIF(${someServices} OR self_hosted) AS pages_using_webfonts,
      COUNTIF(${someServices}) AS pages_using_webfont_services,
      COUNTIF((${someServices}) AND NOT self_hosted) AS pages_using_webfont_services_exclusive,
      COUNTIF(self_hosted) AS self_hosted,
      COUNTIF(NOT (${someServices}) AND self_hosted) AS self_hosted_exclusive,
      ${servicesCount}
    FROM \`stateofwebfontservices.pages.${run}\`
  `);
}

var queue = new Queue(1, Infinity);

Promise.all(runs.map(function (run) {
  return queue.add(function () {
    return getData(run);
  });
})).then(function (results) {
  let values = results.map(result => Object.values(result));
	fs.writeFileSync('results.csv',
    CSV.stringify(Object.keys(results[0])) + CSV.stringify(values)
  );
});
