const fs = require('fs');

fs.readFile('./txt/input.txt', 'utf-8', (error, data) => {
  if (error) {
    console.error("Error reading file:", error);
    return;
  }
  console.log(data);
});

console.log("Reading...");
