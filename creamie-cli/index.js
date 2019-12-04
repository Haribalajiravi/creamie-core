#!/usr/bin/env node
let action = process.argv[2];
let name = process.argv[3];
let option = process.argv[4];

const project = require('./project-generator/index');
const component = require('./component-generator/index');

const help = () => {
    console.log('creamie create <project-name> (A new project will generate)');
    console.log('creamie component <component-name> (A new component will generate under `src` folder)');
}

if(action) {
    switch(action) {
        case 'create' : 
            project(name); break;
        case 'component' : 
            component(name, option); break;
        case 'help' :
            help(); break;
        default:
            help(); break;
    }
} else {
    console.log('ERROR! : Please specify `action` name to proceed futhur!');
}
