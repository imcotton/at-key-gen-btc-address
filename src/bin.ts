#!/usr/bin/env node

import { argv, stdin } from 'node:process';
import { text } from 'node:stream/consumers';

import { main } from './main.ts';
import { parse } from './parse.ts';





main(parse(argv.slice(2)), console.log, () => text(stdin));

