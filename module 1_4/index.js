const readline = require('readline');
const { memoryUsage } = require('node:process');
const stateObserver = require('./state-observer');

const args = process.argv.slice(2);

if (args.length !== 2) console.log()
console.log(process.argv[2], process.argv[3]);

const VALID_LIMITS = ['file-size', 'rows-limit'];
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// const yellow = '\x1b[33m';
// const green = '\x1b[32m';
// const reset = '\x1b[0m';
// const red = '\x1b[31m';

// const question = `Choose a file limit type:
//   ${yellow}1. File size (MB)${reset}
//   ${green}2. Row count${reset}
// Enter your choice (1 or 2): `;

// rl.question(question, (answer) => {
//   if (answer === '1') {
//     console.log('You chose file size limit');
//     rl.question('Please enter size limit: ', (limit) => {
//       const value = Number(limit);
//       if (!isNaN(value) && value > 0) {
//         console.log('Got %s as size limit', value);
//         // handle size limit case
//         stateObserver.sizeLimit = value;
//       } else {
//         console.log(`${red}Invalid answer${reset}`);
//       }
//       rl.close();
//     });
//   } else if (answer === '2') {
//     rl.question('Please enter row count: ', (limit) => {
//       const value = Number(limit);
//       if (!isNaN(value) && value > 0) {
//         console.log('Got %s as row count limit', value);
//         // handle row count limit case
//         stateObserver.rowLimit = value;
//       } else {
//         console.log(`${red}Invalid answer${reset}`);
//       }
//       rl.close();
//     });
//   } else {
//     console.log(`${red}Invalid choice. Please run the script again${reset}`);
//     rl.close();
//   }
// });

function formatMemoryUsage(data) {
  return `${Math.round((data / 1024 / 1024) * 100) / 100}MB`;
}

setInterval(() => {
  const rssInMb = +formatMemoryUsage(memoryUsage().rss);
  if (rssInMb > 80) {
    console.error('Memory limit exceeded!');
    process.exit(74);
  }
  console.log(
    `Memory used: ${formatMemoryUsage(memoryUsage().rss)}`
  );
}, 5000);

// 1. Implement script, which generates a file with fake CSV data.

// 2. User must specify one of the limitations as script arguments during the console run: file size in MB or rows limit.

// 3. Implement all the necessary script arguments validations.

// 4. Script must correctly finish the execution and display corresponding message if any limit has been reached.

// 5. Display the memory consuming every 5sec.

// 6. Generated CSV file must correctly be opened in Excel.

// 7. CSV file size must not exceed the size limit if specified.

// 8. CSV rows count must not exceed the rows limit if specified.

// 9. CSV file should contain the following generated fake fields (“casual” lib or similar):

// - A row number (#)

// - First Name

// - Last Name

// - Company (randomly presented)

// - Address

// - City

// - Country

// - ZIP/Postal Code

// - Phone

// - Email

// - Web Link (randomly presented)

// 10. Test the script with limitation 2GB and higher.

// 11. Measure the memory consuming and exit with error if it exceeds the 80MB
