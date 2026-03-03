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
    let arr = []
    for (let todo of TODOS) {
        if (todo.indexOf("!") !== -1) {
            arr.push(todo)
        }
    }
    return arr;
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
function getAllAuthor() {
    let arr = [];
    for (let todo of TODOS) {
        let splited = todo.split(';');
        if (splited.length == 1) {
            continue;
        }
        arr.push(todo)
    }
    return arr;
}
function countExclamations(str) {
    return (str.match('/!/g') || []).length;
}
function getDate(str){
    date = str.split(';')
    return new Date(date[1]);
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
            console.log(getImportantTODO());
            break;
        case 'user':
            const author = payload[0];
            getFromAuthor(author);
            break;
        case 'sort':
            switch (payload) {
                case 'importance':
                    important = getImportantTODO();
                    important.sort((a, b) => countExclamations(a) - countExclamations(b));
                    for (const str of important) {
                        console.log(str);
                    }
                    for (const str of TODOS) {
                        if (!important.includes(str)) {
                            console.log(str);
                        }
                    }
                    break;
                case 'user':
                    users = getAllAuthor();
                    for (const str of users) {
                        console.log(str);
                    }
                    for (const str of TODOS) {
                        if (!users.includes(str)) {
                            console.log(str);
                        }
                    }
                    break;
                case 'date':
                    dates = TODOS.sort((a, b) => getDate(b) - getDate(a));
                    for (const str of dates) {
                        console.log(str);
                    }
                    break;
                default:
                        break;
                break
            }
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!