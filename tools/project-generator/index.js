const process = require('child_process');
const fs = require('fs');
const rmrf = require('rimraf');
const currentPackage = require('./../../package.json');
const package = require('./project/package');
const AppComponent = require('./project/app-component');

const Reset = "\x1b[0m";
const Bright = "\x1b[1m";
const Dim = "\x1b[2m";
const Underscore = "\x1b[4m";
const Blink = "\x1b[5m";
const Reverse = "\x1b[7m";
const Hidden = "\x1b[8m";

const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";

const BgBlack = "\x1b[40m";
const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";
const BgBlue = "\x1b[44m";
const BgMagenta = "\x1b[45m";
const BgCyan = "\x1b[46m";
const BgWhite = "\x1b[47m";

/**
 * Below method will initiate process of creating Creamie project for developers
 * @param {string} name 
 */
const projectGenerator = (name) => {

    let title =
        `        -----------------------
                 CREAMIE
         -----------------------
    🔥 A JavaScript Framework (v ${currentPackage.version}) 🔥`;
    console.log(Blink, title);
    console.log(`\nCreamie started creating '${name}' project..\n`);

    console.log(FgGreen, '');
    console.log(FgGreen, `Started generating...`);
    console.log(FgBlue, '');
    /**
     * Cloning sample project from git repository
     */
    process.execSync(`git clone https://github.com/Haribalajiravi/creamie-project.git ${name}`, { stdio: 'inherit' });
    /**
     * remove current git origin as a fresh project
     */
    rmrf(`${name}/.git/`, () => {});

    /**
     * update creamie version in app page
     */
    fs.writeFile(`${name}/src/app/app-component.html`, AppComponent.get(currentPackage.version), (err) => {
        if (err) {
            console.error(err);
        } else {
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
                    console.error(FgRed, err);
                } else {
                    console.log(FgYellow, '\npackage.json initiated✔️');

                    console.log(FgYellow, '\nNOTE: Use below mandatory commands! else your project won`t run!')
                    console.log(Reset, `Use 'cd ${name}'`);
                    console.log(Reset, `And 'npm init' command to define your project!`);
                    console.log(`And 'npm install' to install all the dependencies of your project! \n`);

                    console.log(FgMagenta, `Now project is ready to use!`);
                    console.log(Reset, '');
                }
            });
        }
    });

}

module.exports = projectGenerator;