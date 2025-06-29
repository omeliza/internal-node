import { array } from './array.js';
import { hashStringAsync } from './hashStringAsync.js';
import memoryManagement from './memoryManagement.js';

const processBatch = async (arr) => {
  if (!Array.isArray(array)) return;
  arr.forEach(async (el) => await hashStringAsync(el))
}

async function processArray (batchSize = 1e2) {
  for (let i = 0; i < array.length; i+=batchSize) {
    const batch = array.slice(i, i + batchSize);
    await processBatch(batch);
  }
} 

processArray();
memoryManagement();