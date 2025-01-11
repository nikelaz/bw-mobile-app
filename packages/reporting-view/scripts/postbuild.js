import fs from 'fs';

const outputFileName = 'index.ts';

const generateOutputTemplate = (html) => `
  export const html = \`${encodeURIComponent(html)}\`;
`;

const main = () => {
  const dir = fs.readdirSync('./dist');
  const htmlFile = dir.filter(x => x.includes('html'))[0];

  if (!htmlFile) {
    console.log('Postbuild: Could not find bundled html file');
  }

  const htmlFileContents = fs.readFileSync(`./dist/${htmlFile}`, { encoding: 'utf8' });

  if (!htmlFileContents) {
    console.log('Postbuild: Could not open html file and read its contents');
  }

  fs.writeFileSync(`./dist/${outputFileName}`, generateOutputTemplate(htmlFileContents));

  console.log('Postbuild script completed successfully.');
};

main();
