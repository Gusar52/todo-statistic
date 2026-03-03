const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let TODOS = [];
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllTODO() {
    let tokens = files.map(s => s.split(/\/\/|\n/));
    for (let token of tokens) {
        for (let str of token){
            if (str.startsWith(' TODO')) {
                TODOS.push(str);
        }}
    }
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            getAllTODO();
            console.log(TODOS);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
