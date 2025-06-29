import { memoryUsage } from "node:process";

export default () => {
  setInterval(() => console.table(memoryUsage()), 1000);
}