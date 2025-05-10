const { memoryUsage } = require('node:process');
const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');
const user = require('./user');

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error(
    'Invalid number of arguments. You must provide 2 arguments: file-size or row-limit with number'
  );
  process.exit(1);
}

const limitType = args[0];
const limitValue = +args[1];

const VALID_LIMITS = ['file-size', 'rows-limit'];

if (!VALID_LIMITS.includes(limitType)) {
  console.error(
    'Invalid limit type. Valid types are: ',
    VALID_LIMITS.join(', ')
  );
  process.exit(1);
}

if (limitType === 'file-size') {
  if (!isNaN(limitValue) && limitValue > 0) {
    console.log('Got %s as size limit', limitValue);
    generateCSVWithSizeLimit(limitValue);
  } else {
    console.error('Invalid size limit');
    process.exit(1);
  }
} else if (limitType === 'rows-limit') {
  if (!isNaN(limitValue) && limitValue > 0) {
    console.log('Got %s as row count limit', limitValue);
    generateCSVWithRowLimit(limitValue);
  } else {
    console.log(`${red}Invalid answer${reset}`);
    process.exit(1);
  }
}
// memory usage
function formatMemoryUsage(data) {
  return `${Math.round((data / 1024 / 1024) * 100) / 100}MB`;
}

setInterval(() => {
  const rssInMb = +formatMemoryUsage(memoryUsage().rss);
  if (rssInMb > 80) {
    console.error('Memory limit exceeded!');
    process.exit(74);
  }
  console.log(`Memory used: ${formatMemoryUsage(memoryUsage().rss)}`);
}, 5000);

// generate csv with size limit
function generateCSVWithSizeLimit(size) {
  const FILE_SIZE_LIMIT_BYTES = size * 1024 * 1024;

  const filePath = path.join(__dirname, 'size-output.csv');

  const writeStream = fs.createWriteStream(filePath);

  let index = 1;
  let currentSize = 0;

  const writeRow = () => {
    const row = Papa.unparse([user(index)]);
    const rowSize = Buffer.byteLength(row, 'utf-8');

    if (currentSize + rowSize > FILE_SIZE_LIMIT_BYTES) {
      writeStream.end(() => {
        console.log(
          `CSV file generated with ${index - 1} records, approx. ${
            currentSize / (1024 * 1024)
          } MB`
        );

        process.exit(1);
      });
      return;
    }

    if (!writeStream.write(row)) {
      writeStream.once('drain', writeRow);
      return;
    }

    currentSize += rowSize;
    index++;
    writeRow();
  }

  writeRow();
}

function generateCSVWithRowLimit(rows) {
  const writeStream = fs.createWriteStream('row-output.csv');

  writeStream.on('error', (err) => {
    console.error('Stream error:', err);
  });

  let index = 1;
  const writeRow = () => {
    const row = Papa.unparse([user(index)]);

    if (index > rows) {
      writeStream.end(() => {
        console.log(`CSV file generated with ${rows} records.`);
        process.exit(1);
      });
      return;
    }

    if (!writeStream.write(row)) {
      writeStream.once('drain', writeRow);
      return;
    }

    index++;
    writeRow();
  }

  writeRow();
}
