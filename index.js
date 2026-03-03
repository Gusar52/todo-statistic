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
function isTODO(str) {
    str = str.toLowerCase().trim();
    if (str.startsWith('todo ' ) || str.startsWith('todo:' )) {
        return true;
    }
    return false;
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
    return (str.match(/!/g) || []).length;
}
function getDate(str){
    date = str.split(';')
    return new Date(date[1]);
}

function print(str) {
    if (!str || str.trim() === '') return '';

    const parts = str.split(';');
    if (parts.length < 3){
        let result = `${Array(countExclamations(str)+1).join('!').padEnd(10, ' ').padEnd(10, ' ')}|${''.padEnd(10, ' ')}|${'' .padEnd(12, ' ')}|${str.split('TODO')[1].padEnd(10, ' ')}`;
        console.log(result);
        return;
    }

    const exclamations = countExclamations(str);
    const exclamationMarks = '!'.repeat(exclamations).padEnd(10, ' ');

    const firstPart = parts[0].trim();
    const name = firstPart.split(' ')[1] || '';

    const date = parts[1].trim();
    const description = parts[2].trim();

    let result = `${exclamationMarks}|${name.padEnd(10, ' ')}|${date.padEnd(12, ' ')}|${description.padEnd(10, ' ')}`;
    console.log(result);
}

function getSinceDate(dateStr) {
    const thresholdDate = new Date(dateStr);

    if (isNaN(thresholdDate)) {
        console.log('Некорректный формат даты!');
        return;
    }

    for (let todo of TODOS) {
        let splited = todo.split(';');
        if (splited.length < 3) continue;
        let todoDateStr = splited[1].trim();
        let todoDate = new Date(todoDateStr);
        if (todoDate >= thresholdDate) {
            print(todo);
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
            for (const str of TODOS){
                print(str);
                // console.log(str);
            }
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
                        print(str)
                    }
                    for (const str of TODOS) {
                        if (!important.includes(str)) {
                            print(str)
                        }
                    }
                    break;
                case 'user':
                    users = getAllAuthor();
                    for (const str of users) {
                        print(str)
                    }
                    for (const str of TODOS) {
                        if (!users.includes(str)) {
                            print(str)
                        }
                    }
                    break;
                case 'date':
                    dates = TODOS.sort((a, b) => getDate(b) - getDate(a));
                    for (const str of dates) {
                        print(str)
                    }
                    break;
                default:
                        break;
                break
            }
            break;
        case 'date':
            const date = payload;
            getSinceDate(date);
            break;
        // default:
        //     console.log('wrong command');
        //     break;
    }
}

// TODO you can do it!