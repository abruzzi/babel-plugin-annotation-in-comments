import fs from 'fs';
import path from 'node:path';

import { pluginTester } from 'babel-plugin-tester';
import analyticsPlugin from '../annotation';

pluginTester({
  babelrc: false,
  plugin: analyticsPlugin,
  pluginName: 'analytics',
  fixtures: path.join(__dirname, 'fixtures'),
  babelOptions: {
    parserOpts: {
      plugins: ['jsx'],
    },
    generatorOpts: {quotes: 'double'},
  }
})