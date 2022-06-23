const { ipcRenderer } = require('electron')
const appConstants = require('./service/appConstants')
const state = require('./service/appState')

const sendIpcMessage = (message) => {
    ipcRenderer.send(appConstants.ipc.channels.main, message)
}

const ipcMessageHandler = (event, data = {}) => {
    const {type} = data
    switch(type){
        case appConstants.ipc.messageTypes.newFile: {
            const {fileName} = data
            state.setFileName(fileName)
            state.setContent('')
            break
        }
        case appConstants.ipc.messageTypes.initSaveFile: {
            const {fileName, saveAs} = data
            const content = state.getContent()
            const f = saveAs ? fileName : state.getFileName()
            state.setFileName(f)
            sendIpcMessage({type: appConstants.ipc.messageTypes.saveFile, fileName:f, content})
            break
        }
        case appConstants.ipc.messageTypes.openFile: {
            const {fileName, content} = data
            state.setContent(content)
            state.setFileName(fileName)
            break
        }
    }
}

ipcRenderer.on(appConstants.ipc.channels.main, ipcMessageHandler)

const buttonClickHandler = (e) => {
    const el = e.target

    if(el.classList.contains('btn-new')){
        console.log('btn-new')
        sendIpcMessage({type: appConstants.ipc.messageTypes.newFile})
    } else if(el.classList.contains('btn-open')){
        console.log('btn-open')
        sendIpcMessage({type: appConstants.ipc.messageTypes.openFile})
    } else if(el.classList.contains('btn-save')){
        console.log('btn-save')
        const content = state.getContent()
        const fileName = state.getFileName()
        sendIpcMessage({type: appConstants.ipc.messageTypes.saveFile, fileName, content})
    } else if(el.classList.contains('btn-save-as')){
        console.log('btn-save-as')
        sendIpcMessage({type: appConstants.ipc.messageTypes.initSaveFile})
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const editor = ace.edit('editor')
    state.setEditor(editor)
    editor.setTheme('ace/theme/monokai')
    editor.session.setMode('ace/mode/javascript')
    document.querySelector('.current-document').textContent = ''
    const buttons = document.querySelectorAll('.toolbar-buttons .tool-button')
    if(buttons){
        buttons.forEach(el => el.addEventListener('click', buttonClickHandler))
    }
})