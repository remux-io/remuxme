
"use strict"


const jsonfile = require('jsonfile');
const path = require('path');
const os = require('os');

const config = require('../').configuration;


console.log('--- remux.io config ---');
console.log(config.remux.read_json());
console.log('\n');
console.log('--- processes config ---');
console.log(config.processes.read_json());
