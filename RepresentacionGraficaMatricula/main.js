const { app, BrowserWindow } = require("electron");
const { updateBundle } = require("typescript");

let appWin;

createWindow = () => {
    appWin = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Representación gráfica de matrícula",
        resizable: true,
        webPreferences: {
            nodeIntegration: true
        },
        icon: __dirname + '/ubu.ico'
    });
    
    appWin.loadURL(`file://${__dirname}/dist/index.html`);

    appWin.setMenu(null);

    appWin.webContents.openDevTools();
    appWin.setBackgroundColor('#E5E8E8');
    appWin.on("closed", () => {
        appWin = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
});