const { fork } = require("node:child_process");

const array = require('./array');
const memoryManagement = require('./memoryManagement');

if (!Array.isArray(array)) return;

const hashProcess = fork('./generateHash.js');

const processBatch = async (arr) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      arr.forEach((el) => hashProcess.send(el))
      resolve();
    }, 0);
  })
}

async function processArray (batchSize = 1e3) {
  for (let i = 0; i < array.length; i+=batchSize) {
    const batch = array.slice(i, i + batchSize);
    await processBatch(batch);
  }
} 

processArray();

memoryManagement();