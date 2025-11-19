//Common utilities to write and read fileName

const fs = require("fs").promises;
const path = require("path");

const dataDirectory = path.join(__dirname, "../data");

async function readDataFile(fileName){
  const filePath = path.join(dataDirectory, fileName);
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data)
}

async function writeDataFile(fileName,data) {
  const filePath = path.join(dataDirectory, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

module.exports = {
  readDataFile,
  writeDataFile
};