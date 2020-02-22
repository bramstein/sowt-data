const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();
const services = require('./services');
const runs = require('./runs');

// This method copies all relevant data to a new dataset, so
// it is easier to query and cheaper to analyse.
async function copyToDestinationTable(run) {
  const datasetId = 'pages';

  const dataset = bigquery.dataset(datasetId);
  const destinationTable = dataset.table(run);
  const servicesSql = Object.keys(services).map(service => {
    return `LOGICAL_OR(REGEXP_CONTAINS(url, r'${services[service]}')) AS ${service.toLowerCase()}`;
  }).join(', ');

  const notServicesSql = Object.keys(services).map(service => {
    return `REGEXP_CONTAINS(url, r'${services[service]}') IS FALSE`;
  }).join(' AND ');

  // This check seems reasonably consistent with the HTTPArchive's
  // type = 'font' column. We use this instead of the type column
  // because the column doesn't exist in older tables. It returns
  // slightly higher results, but upon comparing the results, this
  // check actually seems more accurate than the check the
  // HTTPArchive uses.
  const isFont = `(
    REGEXP_CONTAINS(mimeType, r'font|woff|eot') OR
    REGEXP_CONTAINS(
      REGEXP_EXTRACT(
        REPLACE(REPLACE(url, '%3F', '?'), '%3f', '?'),
         r'[^?@]+'),
      r'\\.(woff|woff2|eot|ttf|otf)$'
    )
  )`;

  const query = `
  SELECT
    pageid,
    ${servicesSql},
    LOGICAL_OR(${isFont} AND (${notServicesSql})) AS self_hosted
  FROM
    \`httparchive.summary_requests.${run}\`
  GROUP BY pageid`

  const [job] = await bigquery.createQueryJob({
    query: query,
    location: 'US',
    destination: destinationTable
  });

  console.log(`Job ${job.id} started.`);
  console.log(`Query results loaded to table ${destinationTable.id}`);
}

runs.forEach(run => copyToDestinationTable(run));
