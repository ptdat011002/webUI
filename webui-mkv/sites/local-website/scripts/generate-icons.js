/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import glob from 'glob-promise';
import fs from 'fs';
import shell from 'shelljs';
import rimraf from 'rimraf';
import { promisify } from 'util';
import cheerio from 'cheerio';
import camelcase from 'camelcase';
import { fileURLToPath } from 'url';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const appendFile = promisify(fs.appendFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../../../');
const writeComponent = (filePath, content) =>
  writeFile(path.resolve(rootDir, filePath), content, 'utf8');

const appendComponent = (filePath, content) =>
  appendFile(path.resolve(rootDir, filePath), content, 'utf8');

const simpleGenId = () => 'icon-' + Math.random().toString(36).substr(2, 9);

async function generate() {
  const iconColored = [];
  const iconFilled = [];
  const iconOutlined = [];
  const iconSvgPaths = await glob(path.resolve(rootDir, 'icons/**/*.svg'));
  const rootComponentsDir = path.resolve(
    rootDir,
    'packages/ds-icons/src/components',
  );
  rimraf.sync(rootComponentsDir, {}, () => {
    console.log('Remove components folder');
  });
  await mkdir(rootComponentsDir);
  await writeComponent(
    `packages/ds-icons/src/index.ts`,
    `// THIS FILE IS AUTO GENERATED. DO NOT MODIFY!
    export * from './helpers';
    export * from './components';
    export * as DSIcons from './components';
    `,
  );
  await writeComponent(
    `packages/ds-icons/src/components/index.ts`,
    `// THIS FILE IS AUTO GENERATED. DO NOT MODIFY!
    `,
  );

  for (var svgPath of iconSvgPaths) {
    const svgContent = await promisify(fs.readFile)(svgPath, 'utf8');
    const relativeIconPath = svgPath.split('/icons/')[1];
    const iconType = relativeIconPath.split('/')[0];
    const folderPath = path.resolve(
      rootDir,
      'packages/ds-icons/src/components',
    );
    shell.mkdir('-p', folderPath);
    const iconName = camelcase(relativeIconPath.split('/').reverse(), {
      pascalCase: true,
    })
      .replace('Svg', '')
      .replace(/[^a-zA-Z0-9]/g, '');
    const iconComponentName = iconName;
    if (iconType === 'Colored') iconColored.push(iconComponentName);
    else if (iconType === 'Filled') iconFilled.push(iconComponentName);
    else iconOutlined.push(iconComponentName);
    const $svg = cheerio.load(svgContent, { xmlMode: true })('svg');
    let lastMaskId = '';
    const attrConverter = (attribs, tagName) =>
      attribs &&
      Object.keys(attribs)
        .filter(
          (name) =>
            ![
              'class',
              ...(tagName === 'svg'
                ? ['xmlns', 'xmlns:xlink', 'xml:space', 'width', 'height']
                : []),
            ].includes(name),
        )
        .reduce((obj, name) => {
          const newName = name === 'mask-type' ? 'masktype' : camelcase(name);
          if (tagName === 'mask' && newName === 'id') {
            lastMaskId = simpleGenId();
            obj[newName] = lastMaskId;
          } else if (
            (tagName === 'path' || tagName === 'g') &&
            newName === 'mask' &&
            attribs[name] &&
            attribs[name].startsWith('url') &&
            lastMaskId
          ) {
            obj[newName] = `url(#${lastMaskId})`;
            lastMaskId = '';
          } else
            switch (newName) {
              case 'fill':
                obj[newName] = attribs[name] || 'currentColor';
                break;
              default:
                obj[newName] = attribs[name];
                break;
            }
          return obj;
        }, {});

    const elementToTree = (element) => {
      return element
        .filter((_, e) => e.tagName && !['style'].includes(e.tagName))
        .map((_, e) => ({
          tag: e.tagName,
          attr: attrConverter(e.attribs, e.tagName),
          child:
            e.children && e.children.length
              ? elementToTree(cheerio(e.children))
              : undefined,
        }))
        .get();
    };

    const tree = elementToTree($svg);
    const iconData = tree[0];
    await writeComponent(
      path.resolve(folderPath, `${iconComponentName}.tsx`),
      `/*
      *   THIS FILE IS AUTO GENERATED. DO NOT MODIFY!
      */
    import React from 'react';
    import { GenIcon, IconBaseProps } from '../helpers';

    export const ${iconComponentName}: React.FunctionComponent<IconBaseProps> = (props: IconBaseProps) => {
      return GenIcon(${JSON.stringify(iconData)})(props);
    }
    `,
    );
    await appendComponent(
      'packages/ds-icons/src/components/index.ts',
      `export * from './${iconComponentName}';
      `,
    );
  }

  console.info('=============== ICON GENERATED ===============');
  // console.info('fill ', iconFilled);
}

generate();
