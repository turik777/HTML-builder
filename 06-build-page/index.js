const fs = require('fs').promises;
const path = require('path');

let template = '';
async function build() {
  await fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

  const data = await fs.readFile(path.join(__dirname, 'template.html'));
  template += data;

  const components = await fs.readdir(path.join(__dirname, 'components'), {
    withFileTypes: true,
  });
  for (const component of components) {
    const name = component.name.split('.')[0];
    const data = await fs.readFile(
      path.join(__dirname, 'components', `${name}.html`),
    );
    template = template.replace(`{{${name}}}`, '\n' + data);
  }

  await fs.writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    template,
  );

  await merge();
  await copy();
}

async function merge() {
  const stylesFolder = path.join(__dirname, 'styles');
  const styles = await fs.readdir(stylesFolder, { withFileTypes: true });

  let data = '';
  for (const style of styles) {
    const styleFile = path.join(stylesFolder, style.name);

    if (path.extname(styleFile) === '.css') {
      data += await fs.readFile(styleFile);
    }

    await fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), data);
  }
}

async function copy() {
  await fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), {
    recursive: true,
  });

  const filesFolder = path.join(__dirname, 'assets');
  const copyFolder = path.join(__dirname, 'project-dist', 'assets');

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

build();
