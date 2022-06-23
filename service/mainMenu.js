const { app, Menu, shell } = require("electron")

const appConstants = require('./appConstants')

const isMac = process.platform === 'darwin'

let menu

const initMainMenu = ({ newHandler, openHandler, saveHandler, saveAsHandler }) => {
    const template = [
        { role: 'appMenu' },

        {
            label: 'File',
            submenu: [
                { label: 'New...', id: appConstants.menu.menuItemIds.new, click: newHandler },
                { label: 'Open...', id: appConstants.menu.menuItemIds.open, click: openHandler },
                { label: 'Save', id: appConstants.menu.menuItemIds.save, click: saveHandler },
                { label: 'Save as...', id: appConstants.menu.menuItemIds.saveAs, click: saveAsHandler },
                { type: 'separator' },
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },

        { role: 'editMenu' },
        { role: 'viewMenu' },
        { role: 'windowMenu' },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn more', click: async () => {
                        await shell.openExternal("https://github.com/")
                    }
                }
            ]
        }
    ]

    menu = Menu.buildFromTemplate(template)
    const saveMenuItem = menu.getMenuItemById(appConstants.menu.menuItemIds.save)
    saveMenuItem.enabled = false
    Menu.setApplicationMenu(menu)
    return { menu }
}

const enableMenuItemById = (id, enabled) => {
    const menuItem = menu.getMenuItemById(id)
    menuItem.enabled = enabled
}

module.exports = {initMainMenu, enableMenuItemById}