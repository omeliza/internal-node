const { memoryUsage } = require("node:process");

module.exports = () => {
  setInterval(() => console.table(memoryUsage()), 1000);
}