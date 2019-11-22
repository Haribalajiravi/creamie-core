const process = require('child_process');
const fs = require('fs');
const rmrf = require('rimraf');
const currentPackage = require('./../../package.json');
const package = require('./project/package');
const AppComponent = require('./project/app-component');

/**
 * Below method will initiate process of creating Creamie project for developers
 * @param {string} name 
 */
const projectGenerator = (name) => {

    console.log(`Creamie started creating '${name}' project`);

    /**
     * Cloning sample project from git repository
     */
    process.execSync(`git clone https://github.com/Haribalajiravi/creamie-project.git ${name}`, { stdio: 'inherit' });
    /**
     * remove current git origin as a fresh project
     */
    rmrf(`${name}/.git/`, () => {
        console.log('Project refreshed!');
    });

    /**
     * update creamie version in app page
     */
    fs.writeFile(`${name}/src/app/app-component.html`, AppComponent.get(currentPackage.version), (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`Don't forget to check creamie version!`);
        }
    });

    /**
     * Creating default package.json with default settings and dependencies
     */
    // Update user given name of package
    package.name = name;
    /**
     * Overiding package.json with our default content
     */
    fs.writeFile(`${name}/package.json`, JSON.stringify(package, null, 4), (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('package.json initiated!')
        }
    });
}

module.exports = projectGenerator;