const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const user = require('./user');

const size = process.argv[2];

// generate csv with size limit
function generateCSVWithSizeLimit() {
  const FILE_SIZE_LIMIT_BYTES = size * 1024 * 1024;

  const filePath = path.join(__dirname, 'size-output.csv');

  const writeStream = fs.createWriteStream(filePath);

  let index = 1;

  const generateData = () => {
    let currentSize = 0;
    while (currentSize < FILE_SIZE_LIMIT_BYTES) {
      const row = Papa.unparse([user(index)]);

      const rowSize = Buffer.byteLength(row, 'utf-8');

      if (currentSize + rowSize > FILE_SIZE_LIMIT_BYTES) break;

      writeStream.write(row);
      currentSize += rowSize;
      index++;
    }
    writeStream.end(() => {
      console.log(
        `CSV file generated with ${index - 1} records, approx. ${
          currentSize / (1024 * 1024)
        } MB`
      );
    });
    process.send('CSV generated');
    process.exit(1);
  };

  generateData();
}

generateCSVWithSizeLimit();