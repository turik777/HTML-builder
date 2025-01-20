const fs = require('fs');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');

fs.readdir(stylesFolder, { withFileTypes: true }, (_, styles) => {
  const write = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css'),
  );

  styles.forEach((style) => {
    const styleFile = path.join(stylesFolder, style.name);

    if (path.extname(styleFile) === '.css') {
      fs.createReadStream(styleFile).on('data', (data) => {
        write.write(data);
      });
    }
  });
});
