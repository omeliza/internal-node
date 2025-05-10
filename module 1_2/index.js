const { memoryUsage } = require('node:process');

let prevExecutionTime = null;
let currentTime = null;
let difference = 0;
let count = 0;
const MAX_COUNT = 5;

function printUsedMemory() {
  if (prevExecutionTime) {
    currentTime = new Date().getTime();
    difference = (currentTime - prevExecutionTime) / 1000;
    prevExecutionTime = currentTime;
  } else prevExecutionTime = new Date().getTime();
  console.log(
    `Memory used: ${formatMemoryUsage(memoryUsage().rss)} (${difference}sec)`
  );
}

setInterval(() => {
  if (count >= MAX_COUNT) {
    console.log('Finished');
    process.exit(0);
  }
  printUsedMemory();
  count++;
}, 1000);

function formatMemoryUsage(data) {
  return `${Math.round((data / 1024 / 1024) * 100) / 100}MB`;
}
