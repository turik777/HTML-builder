const fs = require('fs');
const path = require('path');
const { stdout } = process;

fs.createReadStream(path.join(__dirname, 'text.txt')).on('data', (data) =>
  stdout.write(data),
);
