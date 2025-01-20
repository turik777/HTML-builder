const fs = require('fs').promises;
const path = require('path');

async function copy() {
  await fs.mkdir(path.join(__dirname, 'files-copy'), {
    recursive: true,
  });

  const filesFolder = path.join(__dirname, 'files');
  const copyFolder = path.join(__dirname, 'files-copy');

  const files = await fs.readdir(filesFolder, { recursive: true });
  const copyFiles = await fs.readdir(copyFolder, { recursive: true });

  for (const file of copyFiles) {
    if (!files.includes(file)) {
      await fs.rm(path.join(copyFolder, file), { recursive: true });
    }
  }

  for (const file of files) {
    const filesPath = path.join(filesFolder, file);
    const copyPath = path.join(copyFolder, file);

    const stats = await fs.stat(filesPath);
    if (stats.isDirectory()) {
      await fs.mkdir(copyPath, { recursive: true });
    } else {
      await fs.copyFile(filesPath, copyPath);
    }
  }
}

copy();
