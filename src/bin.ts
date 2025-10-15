#!/usr/bin/env node

import { argv } from 'node:process';
import { main } from './main.ts';
import { parse } from './parse.ts';





main(parse(argv.slice(2)));

