const fs = require('fs');
const path = require('path');

let template = '';
fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (error) => {
  if (error) console.log(error);
});

const write = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'index.html'),
);

fs.createReadStream(path.join(__dirname, 'template.html')).on(
  'data',
  (data) => {
    template += data;

    fs.readdir(
      path.join(__dirname, 'components'),
      { withFileTypes: true },
      (_, components) => {
        components.forEach((component, i) => {
          const name = component.name.split('.')[0];
          fs.createReadStream(
            path.join(__dirname, 'components', `${name}.html`),
          ).on('data', (data) => {
            const content = data.toString();
            template = template.replace(`{{${name}}}`, content);
            if (i === components.length - 1) {
              write.write(template);
            }
          });
        });
      },
    );
  },
);

const stylesFolder = path.join(__dirname, 'styles');

fs.readdir(stylesFolder, { withFileTypes: true }, (_, styles) => {
  const write = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
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

fs.mkdir(
  path.join(__dirname, 'project-dist', 'assets'),
  { recursive: true },
  (error) => {
    if (error) console.log(error);
  },
);

const filesFolder = path.join(__dirname, 'assets');
const copyFolder = path.join(__dirname, 'project-dist', 'assets');

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
