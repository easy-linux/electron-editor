const { BrowserWindow, app, dialog, ipcMain } = require('electron')
const path = require("path")
const appConstants = require('./service/appConstants')
const { openFile, createFile, saveFile } = require('./service/fileTools')
const { enableMenuItemById, initMainMenu } = require('./service/mainMenu')


let mainWindow

const state = {
    fileName: null
}

const isMac = process.platform === 'darwin'

const createApp = () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        titleBarStyle: "hiddenInset",
        minWidth: 800,
        minHeight: 600,
        name: "Electron Editor",
        webPreferences: {
            preload: path.join(app.getAppPath(), "web.js"),
            contextIsolation: false
        }
    })
    mainWindow.loadFile('index.html')
}

const sendIpcMessage = (message) => {
    mainWindow.webContents.send(appConstants.ipc.channels.main, message)
}

const fileFilters = [
    { name: 'Supported files', extensions: ['*.js', '*.css', '*.html'] },
    { name: 'javascript files', extensions: ['*.js'] },
    { name: 'css files', extensions: ['*.css'] },
    { name: 'html files', extensions: ['*.html'] },
]

const fileNewHandler = async () => {
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
        properties: ['openFile', 'createDirectory'],
        filters: [...fileFilters]
    })

    if (!canceled) {
        try {
            createFile(filePath)
            state.fileName = filePath
            enableMenuItemById(appConstants.menu.menuItemIds.save, true)
            sendIpcMessage({ type: appConstants.ipc.messageTypes.newFile, fileName: filePath })

        } catch (e) {
            dialog.showErrorBox('Error', e)
        }
    }
}

const fileOpenHandler = async () => {
    const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [...fileFilters]
    })

    if (!canceled) {
        try {
            const content = openFile(filePaths[0])
            state.fileName = filePaths[0]
            enableMenuItemById(appConstants.menu.menuItemIds.save, true)
            sendIpcMessage({ type: appConstants.ipc.messageTypes.openFile, fileName: filePaths[0], content })

        } catch (e) {
            dialog.showErrorBox('Error', e)
        }
    }
}

const fileSaveHandler = async () => {
    sendIpcMessage({ type: appConstants.ipc.messageTypes.initSaveFile, fileName: state.fileName })
}

const fileSaveAsHandler = async () => {
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
        defaultPath: path.basename(state.fileName),
        properties: ['createDirectory'],
        filters: [...fileFilters]
    })

    if (!canceled) {
        try {

            enableMenuItemById(appConstants.menu.menuItemIds.save, true)
            sendIpcMessage({ type: appConstants.ipc.messageTypes.initSaveFile, fileName: filePath, saveAs: true })

        } catch (e) {
            dialog.showErrorBox('Error', e)
        }
    }
}

const { menu } = initMainMenu({ newHandler: fileNewHandler, openHandler: fileOpenHandler, saveHandler: fileSaveHandler, saveAsHandler: fileSaveAsHandler })


app.whenReady().then(() => {
    createApp()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createApp()
        }
    })
})

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})

const ipcMessageHandler = async (event, data) => {
    if (data?.type) {
        switch (data.type) {
            case appConstants.ipc.messageTypes.newFile: {
                await fileNewHandler()
                break
            }
            case appConstants.ipc.messageTypes.openFile: {
                await fileOpenHandler()
                break
            }
            case appConstants.ipc.messageTypes.initSaveFile: {
                await fileSaveAsHandler()
                break
            }
            case appConstants.ipc.messageTypes.saveFile: {
                const { fileName, content } = data
                try {
                    saveFile(fileName, content)
                    state.fileName = fileName
                } catch (e) {
                    dialog.showErrorBox('Error', e)
                }
                break
            }
        }
    }
}

ipcMain.on(appConstants.ipc.channels.main, ipcMessageHandler)