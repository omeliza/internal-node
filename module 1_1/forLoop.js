const { fork } = require("node:child_process");

const array = require('./array');
const memoryManagement = require('./memoryManagement');

if (!Array.isArray(array)) return;

const hashProcess = fork('./generateHash.js');

for (let i = 0; i < array.length; i++) {
  hashProcess.send({ value: String(i)});
}

// hashProcess.on('message', (message) => console.log(message));

memoryManagement();