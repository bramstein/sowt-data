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
    return result[0];
  });
}

function getData(run) {
  const allServices = Object.keys(services).map(service => service.toLowerCase()).join(', ');

  // This returns the counts of all combinations for a given run. To save
  // some space, it stores the combinations as bit arrays.
  return query(`
    CREATE TEMP FUNCTION toBitArray(values ARRAY<BOOL>) RETURNS INT64
      LANGUAGE js AS """
      let byte = 0;
      for (let i = 0; i < values.length; i++) {
        if (values[i]) {
          byte |= 1 << i;
        } else {
          byte &= ~(1 << i);
        }
      }
      return byte;
    """;

    SELECT
      '${run.split("_").slice(0,-1).join('-')}' AS date,
      COUNT(*) AS total,
      toBitArray(ARRAY[${allServices}, self_hosted]) as services
    FROM
      \`stateofwebfontservices.pages.${run}\`
    GROUP BY
      ${allServices}, self_hosted
    ORDER BY
      total DESC;
  `);
}

var queue = new Queue(1, Infinity);

Promise.all(runs.map(function (run) {
  return queue.add(function () {
    return getData(run);
  });
})).then(function (results) {
  let values = results[0].map(result => Object.values(result));
	fs.writeFileSync('services-combination-counts.csv',
    CSV.stringify(Object.keys(results[0][0])) + CSV.stringify(values)
  );
});
