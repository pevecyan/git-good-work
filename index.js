const cli = require('cli');
const {exec} = require('child_process');

let options = cli.parse();

let cwd = process.cwd();


exec('git log', (err, stdout, stderr)=>{
    if(stderr)
        console.log(stderr);
    handleOutput(stdout);
})


function handleOutput(output){
    let lines = output.split('\n');

    let commits = [];
    
    for(let i = 0; i < lines.length; i++){
        //console.log(lines[i])
        let line = lines[i];
        if(line.indexOf('commit') == 0){
            let commit = {
                id: line.replace('commit ', ''),
                author: lines[++i].replace('Author:', '').trim(),
                date: lines[++i].replace('Date:', '').trim()
            };
            //ignore one line
            i++;
            let message = '';
            for(let k = i; k < lines.length; k++, i++){
                if(lines[k].indexOf('commit') == 0){
                    i--;
                    break;
                }
                message = message + lines[k];
            }
            commit.message = message.trim();
            commits.push(commit);
        }
    }
    console.log(commits);
}
