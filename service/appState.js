let fileName = null // to save file name
let editor = null //to save link to editor

const setEditor = (newEditor) => {
    editor = newEditor
}

const getEditor = () => {
    return editor
}

const changeSession = (fname) => {
    const ext = fname ? fname.split('.').pop() : ''
    switch (ext) {
        case 'js': {
            editor.session.setMode('ace/mode/javascript')
            break
        }
        case 'css': {
            editor.session.setMode('ace/mode/css')
            break
        }
        case 'html': {
            editor.session.setMode('ace/mode/html')
            break
        }

    }
}

const setFileName = (newFileName) => {
    fileName = newFileName
    document.querySelector('.current-document').textContent = fileName
    document.querySelector('.btn-save').removeAttribute('disabled')
    changeSession(fileName)
}

const getFileName = () => {
    return fileName
}

const getContent = () => {
    if (editor) {
        return editor.getValue()
    }
}

const setContent = (content) => {
    if (editor) {
        editor.setValue(content)
        editor.clearSelection()
        editor.focus()
        editor.gotoLine(1, 0)
    }
}

module.exports = {
    setEditor,
    getEditor,
    setFileName,
    getFileName,
    setContent,
    getContent
}