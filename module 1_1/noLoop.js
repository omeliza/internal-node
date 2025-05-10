const { fork } = require("node:child_process");

const array = require('./array');
const memoryManagement = require('./memoryManagement');

if (!Array.isArray(array)) return;

const hashProcess = fork('./generateHash.js');

array.forEach((el) => hashProcess.send({ value: String(el)}))

// function processArray(array, index = 0) {
//   if (index < array.length) {
//     hashProcess.send({ value: String(index)});
//     processArray(array, index + 1);
//   }
// }

// processArray(array);

memoryManagement();