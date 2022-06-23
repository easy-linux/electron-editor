const fs = require("fs")

const createFile = (fileName) => {
    if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, '', { encoding: 'utf-8' })
    } else {
        throw Error('File exists')
    }
}

const openFile = (fileName) => {
    if (fs.existsSync(fileName)) {
        return fs.readFileSync(fileName, { encoding: 'utf-8' })
    } else {
        throw Error('File not exists')
    }
}

const saveFile = (fileName, content = '') => {
    fs.writeFileSync(fileName, content, { encoding: 'utf-8' })
}

module.exports = {
    createFile,
    openFile,
    saveFile
}
