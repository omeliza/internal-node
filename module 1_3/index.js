const { readdir } = require('node:fs/promises');
const fs = require('node:fs');
const os = require('os');
const path = require('node:path');
const readline = require('node:readline/promises');

/**
 * 
 * @param {string} folderPath - path of the folder to scan
 * @param {string} extension - file extension to filter by (eg "txt")
 * @returns {void}
 */
const getFilesInFolder = async (folderPath, extension) => {
  if (!folderPath || !extension)
    console.error('Path and extension should be provided');

  try {
    const folders = await readdir(folderPath, { recursive: true });
    const filePaths = folders
      .filter((file) => path.extname(file) === `.${extension}`)
      .map((file) => path.join(folderPath, file));

    if (!filePaths.length) {
      console.log(
        'No files found with extension %s in folder $s',
        extension,
        folderPath
      );
      return;
    }

    return printFilesData(filePaths);
  } catch (error) {
    console.error('Could not read folder:', error?.message);
    process.exit(0);
  }
};
/**
 * 
 * @param {string[]} filePaths
 */
const printFilesData = (filePaths) => {
  const data = [];
  filePaths.forEach(async (filePath, i) => {
    let linesQty = 0;
    try {
      const size = (await fs.promises.stat(filePath)).size;

      const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        output: process.stdout,
        terminal: false,
      });
    
      rl.on('line', () => linesQty++);
      rl.on('close', () => {
        data.push({
          name: path.basename(filePath),
          linesQty,
          size
        });

        if (i === filePaths.length - 1) {
          data.sort((a, b) => b.size - a.size);
          console.table(data);
        }
      })
    } catch (error) {
      console.log('Caught error while trying to print files data. ', error?.message);
    }
  });
};
// call example
getFilesInFolder(path.join(os.homedir(), 'Desktop'), 'txt');
