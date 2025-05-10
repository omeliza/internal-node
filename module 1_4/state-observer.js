const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');
const user = require('./user');

class StateObserver {
  sizeLimit = null;
  rowLimit = null;

  constructor() {
    return new Proxy(this, {
      set: (object, property, value) => {
        if (property === 'sizeLimit') this._onSizeLimitChange(value);
        else if (property === 'rowLimit') this._onRowLimitChange(value);

        return Reflect.set(object, property, value);
      },
    });
  }

  _onSizeLimitChange(value) {
    const FILE_SIZE_LIMIT_BYTES = value * 1024 * 1024;

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
      writeStream.end();

      console.log(`CSV file generated with ${index - 1} records, approx. ${currentSize / (1024 * 1024)} MB`);
    }

    generateData();
  }

  async _onRowLimitChange(value) {
    const writeStream = fs.createWriteStream('row-output.csv');

    writeStream.on('error', (err) => {
      console.error('Stream error:', err);
    });

    for (let i = 0; i < value; i++) {
      const row = Papa.unparse([user(i + 1)]);
      writeStream.write(row);
    } 

    writeStream.end();
  }
}

module.exports = new StateObserver();
