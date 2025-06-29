import { array } from './array.js';
import { hashStringAsync } from './hashStringAsync.js';
import memoryManagement from './memoryManagement.js';

async function forLoop() {
  if (!Array.isArray(array)) return;
  for (let i = 0; i < array.length; i++) {
    await hashStringAsync(array[i]);
  }
}

forLoop();
memoryManagement();