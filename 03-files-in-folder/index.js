const fs = require('fs');
const path = require('path');
const { stdout } = process;

const secret = path.join(__dirname, 'secret-folder');

fs.readdir(secret, { withFileTypes: true }, (_, files) => {
  files.forEach((file) => {
    fs.stat(path.join(secret, file.name), (_, stats) => {
      if (file.isFile()) {
        const extension = path
          .extname(path.join(file.path, file.name))
          .slice(1);
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
    });
  });
});
