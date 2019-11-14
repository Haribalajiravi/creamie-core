const {
    exec
} = require('child_process');

const projectGenerator = (name) => {
    exec(`git clone https://github.com/Haribalajiravi/creamie-project.git ${name}`, (err, stdout, stderr) => {
        if (err) {
            console.log('Install git and try again!');
        } else {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
        }
    });
}

module.exports = projectGenerator;