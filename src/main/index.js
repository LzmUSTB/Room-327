import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { WebSocket } from 'ws'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 605,
    height: 405,
    show: false,
    transparent: true,
    autoHideMenuBar: true,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC 
  let WsServer = null;

  ipcMain.on('enter-chatroom', (e, arg) => {
    WsServer = new WebSocket.Server({
      port: arg
    });

    const userList = new Map();

    // type 
    // 0:进入聊天室
    // 1:离开聊天室
    // 2:消息
    // 3:初始化聊天室
    // 消息帧：
    // {
    //   type:
    //   content:
    //   sender:
    //   receiver:
    //   key:
    // }

    WsServer.on('connection', (ws) => {
      ws.on('error', console.error);

      console.log('server连接成功')

      ws.on('message', (data) => {
        console.log(JSON.parse(data));
        const { type, content, sender, receiver, key } = JSON.parse(data);
        //根据不同的type执行不同的操作  
        if (type === 0) {
          ws.send(JSON.stringify({
            type: 3,
            content: Array.from(userList.keys()),
            sender: 0,
            receiver: 0,
            key: key
          }))
          broadcast({
            type: 0,
            content: 'login',
            sender: sender,
            receiver: 0,
            key: key
          });
          userList.set(sender, ws);
        }
        else if (type === 1) {
          console.log('收到type=1');
          broadcast({
            type: 1,
            content: content,
            sender: sender,
            receiver: 0,
            key: key
          });
        }
        else if (type === 2) {
          const req = {
            type: 2,
            content: content,
            sender: sender,
            receiver: receiver,
            key: key
          };
          if (receiver === '大厅') {
            broadcast(req);
          }
          else {
            userList.get(receiver).send(JSON.stringify(req))
          }
        }
      })

      ws.on('close', () => {
        console.log('用户离开');
      })
    })

    WsServer.on('close', () => {
      console.log('服务器关闭')
    })

    function broadcast(msg) {
      for (let ws of userList.values()) {
        ws.send(JSON.stringify(msg));
      }
    }
  })

  ipcMain.on('handle-quit', () => {
    app.quit();
  })

  ipcMain.on('handle-logout', () => {
    if (WsServer) {
      WsServer.close();
    }
  })

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
