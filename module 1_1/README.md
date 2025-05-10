# 📌 Module 1 - Practical Task 1  

This project demonstrates different methods for processing a large array of numbers while monitoring memory usage and computing hash values asynchronously.  

## 🚀 Overview  

The project consists of:  
✅ Generating an array of **1,000,000** numbers (starting from `1`).  
✅ Logging **memory usage** every **1 second**.  
✅ Implementing an **asynchronous function** to hash string values.  
✅ Processing the array using three different approaches:  
   1️⃣ **For-loop**  
   2️⃣ **Function calls only** (no explicit loops)  
   3️⃣ **Batch processing** (custom batch size)  


## 📜 Descriptions  

### 📌 `array.js`  
Generates an array containing **1,000,000** numbers starting from `1`.  

### 📌 `generateHash.js`  
Contains an **asynchronous function** that accepts a string and returns its hash using a cryptographic algorithm.  

### 📌 `memoryManagement.js`  
Monitors **memory usage** and logs it every **1 second** to track performance.  

### 📌 `forLoop.js`  
Processes the array **sequentially** using a standard **for-loop**.  

### 📌 `noLoop.js`  
Processes the array **sequentially** using **function calls only**, without explicit loops.  

### 📌 `batching.js`  
Processes the array in **batches**. The batch size can be customized.

## Scripts

#### Runs processing using a for loop

```
npm run start:loop
```

#### Runs processing using function calls only (no explicit loops)

```
npm run start:noLoop
```

#### Runs processing using batch processing

```
npm run start:batching
```
