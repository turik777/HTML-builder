const fs = require('fs').promises;
const path = require('path');

async function merge() {
  const stylesFolder = path.join(__dirname, 'styles');
  const styles = await fs.readdir(stylesFolder, { withFileTypes: true });

  let data = '';
  for (const style of styles) {
    const styleFile = path.join(stylesFolder, style.name);

    if (path.extname(styleFile) === '.css') {
      data += await fs.readFile(styleFile);
    }

    await fs.writeFile(
      path.join(__dirname, 'project-dist', 'bundle.css'),
      data,
    );
  }
}

merge();
