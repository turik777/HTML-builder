const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const write = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Greetings my friend! Please, enter the message.\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  write.write(data);
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  stdout.write('\nGoodbye, I hope we will meet again.');
});
