const cli = require('cli');
const {exec} = require('child_process');

let options = cli.parse();

let cwd = process.cwd();


exec('git status', (err, stdout, stderr)=>{
    console.log(stdout);
    console.log(stderr);
    
})

