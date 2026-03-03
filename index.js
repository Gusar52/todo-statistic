const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let TODOS = [];
getAllTODO();
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllTODO() {
    let tokens = files.map(s => s.split(/\/\/|\n|\r/));
    for (let token of tokens) {
        for (let str of token){
            if (str.startsWith(' TODO')) {
                TODOS.push(str);
        }}
    }
}
function getImportantTODO() {
    for (let todo of TODOS) {
        if (todo.indexOf("!") !== -1) {
            console.log(todo)
        }
    }
}

function getFromAuthor(author) {
    for (let todo of TODOS) {
        let splited = todo.split(';');
        if (splited.length == 1) {
            continue;
        }
        let currentAuthor = splited[0].replace(/.*TODO\s+/, "").trim();
        if (currentAuthor.toLowerCase().startsWith(author.toLowerCase())) {
            console.log(todo);
        }
    }
}

function processCommand(command) {
    const [cmd, ...args] = command.trim().split(" ");
    const payload = args.join(" ");
    switch (cmd) {
        case 'exit':
            process.exit(0);
        case 'show':
            console.log(TODOS);
            break;
        case 'important':
            getImportantTODO();
            break;
        case 'user':
            const author = payload[0];
            getFromAuthor(author);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
