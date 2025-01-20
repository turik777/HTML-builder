const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (error) => {
  if (error) console.log(error);
});

const filesFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

fs.readdir(filesFolder, { recursive: true }, (_, files) => {
  fs.readdir(copyFolder, { recursive: true }, (_, copyFiles) => {
    copyFiles.forEach((file) => {
      if (!files.includes(file)) {
        fs.rm(path.join(copyFolder, file), { recursive: true }, (error) => {
          if (error) console.log(error);
        });
      }
    });
  });

  files.forEach((file) => {
    const filesPath = path.join(filesFolder, file);
    const copyPath = path.join(copyFolder, file);

    fs.stat(filesPath, (_, stats) => {
      if (stats.isDirectory()) {
        fs.mkdir(copyPath, { recursive: true }, (error) => {
          if (error) console.log(error);
        });
      } else {
        fs.copyFile(filesPath, copyPath, (error) => {
          if (error) console.log(error);
        });
      }
    });
  });
});
