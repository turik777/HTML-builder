const fs = require('fs').promises;
const path = require('path');
const { stdout } = process;

async function info() {
  const secret = path.join(__dirname, 'secret-folder');

  const files = await fs.readdir(secret, { withFileTypes: true });
  for (const file of files) {
    const stats = await fs.stat(path.join(secret, file.name));
    if (file.isFile()) {
      const extension = path.extname(path.join(file.path, file.name)).slice(1);
      let fileName = file.name.replace(extension, '');
      fileName =
        fileName[fileName.length - 1] === '.'
          ? fileName.substring(0, fileName.length - 1)
          : fileName;
      stdout.write(
        fileName +
          ' - ' +
          path.extname(path.join(file.path, file.name)).slice(1) +
          ' - ' +
          stats.size +
          ' bytes\n',
      );
    }
  }
}

info();
