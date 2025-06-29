import { array } from './array.js';
import memoryManagement from './memoryManagement.js';
import { hashStringAsync } from "./hashStringAsync.js";

async function processArray(array, index = 0) {
  if (!Array.isArray(array)) return;

  if (index < array.length) {
    await hashStringAsync(array[index]);

    setTimeout(() => {
      processArray(array, index + 1);
    }, 0);
  }
}

processArray(array);
memoryManagement();