const cli = require('cli');
const {exec} = require('child_process');

let options = cli.parse({
    author: ['a', 'commits author', 'string', ''],
    month: ['m', 'month of which you want commits (current year if year not specified), empty for all', 'number'],
    year: ['y', 'year of which you want commits','number', new Date().getFullYear()],
    group: ['g', 'Group by (days=d, author=a)', 'string', 'd']
});
let cwd = process.cwd();


exec('git log', (err, stdout, stderr)=>{
    if(stderr)
        console.log(stderr);
    console.log(options);
    let commits = handleOutput(stdout);
    //filter authors
    commits = commits.filter(c=>c.author.indexOf(options.author ? options.author : '')>-1);
    //filter months
    commits = commits.filter(c=> 
        (!options.month || (new Date(c.date).getMonth() + 1) === options.month) &&
        (new Date(c.date).getFullYear() === options.year)
    );
    commits = groupBy(commits);
    console.log(commits);
    generateCsv(commits);
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
    return commits;

}

function groupBy(commits){
    let output = [];
    switch(options.group){
        case 'd':{
            let days = {};
            commits.forEach(commit=>{
                let date = new Date(commit.date);
                let value = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
                if(!days[value]){
                    days[value] = {
                        days: []
                    }
                }
                days[value].days.push(commit);
            })
            return days;
        }
        case 'a':{
            
            return output;
        }

    }
}

function generateCsv(){
    let data = 'date, work time, hours, work';

}