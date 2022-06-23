const appConstants = {
    ipc: {
        channels:{
            main: 'main-message'
        },
        messageTypes: {
            newFile: 'new-file',
            openFile: 'open-file',
            initSaveFile: 'init-save-file',
            saveFile: 'save-file',
        }
    },
    menu: {
        menuItemIds: {
            open: 'item-open',
            saveAs: 'item-save-as',
            save: 'item-save',
            new: 'item-new',
        }
    }
}

module.exports = appConstants