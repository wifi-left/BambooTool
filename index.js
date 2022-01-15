const { dialog, app, BrowserWindow, ipcMain, Menu, Tray } = require('electron')
const path = require("path");
const http = require('http');        // HTTP服务器API
const fs = require('fs');            // 文件系统API
const iconv = require('iconv-lite')
const querystring = require("querystring");
const qrCreate = require("qr-image");
// const express = require('express');            // 文件系统API
// const fs = require("fs");
// const path = require("path");
const downloadzip = require("./lib/downloadzip.js");
const os = require('os');
var interfaces = os.networkInterfaces();
var IPv4 = [];

var hostIp = function () {
    if (process.platform === 'darwin') {
        for (var i = 0; i < interfaces.en0.length; i++) {
            if (interfaces.en0[i].family == 'IPv4') {
                IPv4[IPv4.length] = interfaces.en0[i].address;
            }
        }
    } else if (process.platform === 'win32') {
        for (var devName in interfaces) {
            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1') {
                    IPv4[IPv4.length] = alias.address;
                    // console.log(alias.address,alias.cidr,alias.mac,alias.netmask)
                }
            }
        }
    }

    return IPv4;
}
hostIp();

var canQuit = false;
let appTray = null;
downloadzip.test();
function createWindow() {
    const custommenu = [
        {
            label: '程序菜单',
            submenu: [
                {
                    label: '显示 / 隐藏界面',
                    accelerator: 'CmdOrCtrl+F1',
                    click() {
                        showandhide();
                    }
                },
                {
                    label: '退出',
                    accelerator: 'CmdOrCtrl+Q',
                    click() {
                        canQuit = true;
                        app.quit();
                    }
                }
            ]
        },
        // undo, redo, cut, copy, paste, pasteAndMatchStyle, delete, selectAll
        {
            label: '文本编辑',
            submenu: [
                {
                    label: '撤销',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo'
                }, {
                    label: '恢复',
                    accelerator: 'CmdOrCtrl+Y',
                    role: 'redo'
                },
                {
                    accelerator: 'CmdOrCtrl+Y',
                    type: 'separator'
                },
                {
                    label: '剪切',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                },
                {
                    label: '复制',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                }, {
                    label: '粘贴',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                },
                {
                    label: '全选',
                    accelerator: 'CmdOrCtrl+A',
                    role: 'selectAll'
                }
            ]
        },
        {
            label: '调试工具',
            submenu: [
                {
                    label: '重新加载程序',
                    accelerator: 'CmdOrCtrl+R',
                    role: 'reload'
                }, {
                    label: '强制重新加载程序',
                    accelerator: 'CmdOrCtrl+F5',
                    role: 'forceReload'
                },
                {
                    label: '打开开发者工具',
                    role: 'toggleDevTools'
                }
            ]
        }
    ];
    const win = new BrowserWindow({
        width: 900,
        height: 600,
        // menu: null,
        icon: path.join(__dirname, './res/img/icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    appTray = new Tray(path.join(__dirname, './res/img/icon.ico'))
    win.loadFile('gui/index.html');
    //console.log(win.getApplicationMenu());
    win.setMenu(Menu.buildFromTemplate(custommenu));
    appTray.setToolTip("Bamboo Gamom's Music Manager");
    //actions
    win.setMinimumSize(600, 500);
    let programtemple = [

        {
            label: '显示 / 隐藏界面',
            accelerator: 'CmdOrCtrl+F1',
            click() {
                showandhide();
            }
        },
        {
            label: '退出',
            accelerator: 'CmdOrCtrl+Q',
            click() {
                canQuit = true;
                app.quit();
            }
        }

    ];
    appTray.setContextMenu(Menu.buildFromTemplate(programtemple))
    win.on('close', (event) => {
        if (!canQuit) {
            event.preventDefault();
            win.hide();
            return;
        }
        appTray.destroy();

    });
    appTray.on('click', function () {
        // 显示主程序
        win.show();
        // 关闭托盘显示
    });
    function showandhide() {
        //console.log(win.isVisible())
        if (win.isVisible())
            win.hide();
        else win.show();
    };

}
app.whenReady().then(() => {
    createWindow();
});
app.on('window-all-closed', function () {
    //console.log(1);
    //return false;
    if (process.platform !== 'darwin') app.quit();
});
// function buildMenu (Template){
//     return Menu.buildFromTemplate(Template);
// }
// module.exports = {
//     buildMenu
// }
ipcMain.on("openDir", (event, arg) => {
    event.reply("returnDir", {
        file: dialog.showOpenDialogSync({
            title: "请选择保存目录",
            buttonLabel: "选择",
            properties: [
                'openDirectory'
            ]
        })
    });
});
ipcMain.on("openeditmenu", (event, arg) => {
    let custtommenu = [{
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
    }, {
        label: '恢复',
        accelerator: 'CmdOrCtrl+Y',
        role: 'redo'
    },
    {
        accelerator: 'CmdOrCtrl+Y',
        type: 'separator'
    },
    {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
    },
    {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
    }, {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
    },
    {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll'
    }
    ];

    let m1enu = Menu.buildFromTemplate(custtommenu);

    // 弹出上下文菜单
    m1enu.popup({
        x: arg.x,
        y: arg.y
    });
});
// try {
//     fs.writeFileSync(path.join(__dirname, paths), data, coding, err => {
//         return false;
//     })
//     return true;
// } catch (e) {
//     console.warn(e)
//     return false;
// }


function mkQrcode(URL, name) {

    var userStr = URL;
    // 生成二维码文件流
    var qr_svg = qrCreate.image(userStr, { ec_level: "M", type: "svg" });
    var qr_png = qrCreate.image(userStr, { ec_level: "M", type: "png" });
    // 创建可以写入流，当有pipe它的时候就会生成一个userStr.png的文件
    var img = fs.createWriteStream(`./res/http/qr/${name}_qr.png`);
    var img2 = fs.createWriteStream(`./res/http/qr/${name}_qr.svg`);
    // 将生成的二维码流pipe进入刚刚创建的可写入流，并生成文件
    qr_png.pipe(img);
    qr_svg.pipe(img2);

}

function randomPassword(size) {
    var seed = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'Q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '2', '3', '4', '5', '6', '7', '8', '9'
    );//数组
    seedlength = seed.length;//数组长度
    var createPassword = '';
    for (i = 0; i < size; i++) {
        j = Math.floor(Math.random() * seedlength);
        createPassword += seed[j];
    }
    return createPassword;
}
var fileUpdated = false;

ipcMain.on('getupdate',(event,arg)=>{
    event.returnValue = fileUpdated;
    fileUpdated = false;
});
var password = randomPassword(7);

var server = new http.Server();    // 创建新的HTTP服务器
var port = 0; // 随机
server.listen(port);            // 在端口8000伤运行它
port = server.address().port;
var log = require('util').log;
log(`Http Server is listening to ${port} port.`);
log(`IP: `);

for (var i = 0; i < IPv4.length; i++) {
    var ip = IPv4[i];
    console.log(`${ip}:${port}`);
    mkQrcode(`http://${ip}:${port}/checkNoRes?psw=${password}`,ip.replaceAll("/", "_").replaceAll(".", "_").replaceAll(":", "_"));
}

// Node使用'on'方法注册事件处理程序
// 当服务器收到新请求,则运行函数处理它

log("Connect password is " + password);
server.on('request', function (request, response) {
    var filename = null;
    // 解析请求的URL
    var url = require('url').parse(request.url);

    var getdatas = querystring.parse(url.query);
    var cookie = {};
    // cookie = request.headers.cookie
    request.headers.cookie && request.headers.cookie.split(';').forEach(function (Cookie) {
        var parts = Cookie.split('=');
        cookie[parts[0].trim()] = (parts[1] || '').trim();
    });
    switch (url.pathname) {
        case '/state':
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
            response.setHeader("Access-Control-Allow-Methods", "GET");
            response.writeHead(200, { 'Content-type': "text/json; charset=UTF-8" });
            if (cookie["psw"] != password) {
                response.write(`{"state":"Failed"}`);
            }else{
                response.write(`{"state":"OK"}`);
            }
            response.end();
            

            break;

        case '/checkNoRes':
            if (cookie["psw"] == password) {
                response.writeHead(302, { 'Location': 'index.html' });

                response.end();

                break;
            }
            // log((request));
            // // ipcRenderer.send("log",request);
            // console.log()
            if (getdatas.psw != password) {
                response.writeHead(201, { 'Content-type': "text/html; charset=UTF-8" });
                // response.write("密码错误");
                response.write("<b>密码错误</b>，请重新扫描/打开程序中链接！");

            } else {
                response.setHeader("Set-Cookie", `psw=${getdatas.psw};HttpOnly`);
                response.writeHead(302, { 'Location': 'index.html' });
            }
            response.end();
            break;
        case '/check':
            if (cookie["psw"] == password) {
                response.writeHead(302, { 'Location': 'index.html' });
                response.end();
                break;
            }
            // log((request));
            // // ipcRenderer.send("log",request);
            // console.log()
            if (getdatas.psw != password) {
                response.writeHead(201, { 'Content-type': "text/json; charset=UTF-8" });
                // response.write("密码错误");
                response.write(JSON.stringify({ state: "Failed", msg: "密码错误" }));

            } else {
                response.setHeader("Set-Cookie", `psw=${getdatas.psw};HttpOnly`);
                response.writeHead(200, { 'Content-type': "text/json; charset=UTF-8" });
                response.write(JSON.stringify({ state: "OK" }));

            }
            response.end();
            break;
        case '/upload':
            if (cookie["psw"] != password) {
                response.writeHead(302, { 'Location': 'check.html' });

                response.end();

                break;
            }
            // if (cookie["psw"] != password) {
            //     response.writeHead(403, { 'Content-type': "text/html; charset=UTF-8" });
            //     response.write("错误：无法验证您的身份。<a href='check.html'>点击此处进入验证页面</a>")
            //     response.end();
            //     break;
            // }
            response.writeHead(200, { 'Content-type': "text/html; charset=UTF-8" });

            var _fileName = request.headers['file-name'];
            if(process.platform == 'win32'){
                _fileName = decodeURIComponent(_fileName);
            }
            log("Recieveing " + _fileName);
            if (_fileName == undefined || _fileName == null) {
                response.write("Error Undefined File!")
                response.end();
            }
            else {
                try {
                    fs.mkdirSync("./res/http/files");
                } catch (e) {

                }
                try {
                    fs.unlinkSync("./res/http/files/" + _fileName);
                } catch (e) {

                }
                var fis = fs.createWriteStream("./res/http/files/" + _fileName);

                request.on('data', function (data) {
                    // 大文件
                    try {
                        fis.write(data);

                    } catch (e) {
                        log(`ERROR: ${e}`);
                        // response.writeHead
                        response.writeHead(500, { 'Content-type': 'text/plain; charset=UTF-8' });
                        response.write("出错！" + e.message);

                    }

                });
                request.on("close", () => {
                    log("Recieved!");
                    fileUpdated = true;
                    fis.end();
                    response.end();
                })
            }
            break;
        case '/' || '/index.html':
            // console.log(cookie["psw"])

            if (cookie["psw"] != password) {
                // console.log("s")
                response.writeHead(302, { 'Location': 'check.html' });
                response.end();
                break;
            }
            filename = 'index.html';
        case '/check.html':
            if (cookie["psw"] == password) {
                // console.log(cookie["psw"])

                response.writeHead(302, { 'Location': 'index.html' });
                response.end();
                break;
            } else {

            }
        default:
            try {
                filename = "./res/http/" + (filename || url.pathname.substring(1));  // 去掉前导'/'

            } catch (e) {
                response.writeHead(404, { 'Content-type': 'text/plain; charset=UTF-8' });
                response.write("出错！" + err.message);
                response.end();
                return;

            }
            // 基于其扩展名推测内容类型
            var type = (function (_type) {
                switch (_type) { // 扩展名
                    case 'html':
                    case 'htm': return 'text/html; charset=UTF-8';
                    case 'js': return 'application/javascript; charset=UTF-8';
                    case 'css': return 'text/css; charset=UTF-8';
                    case 'txt': return 'text/plain; charset=UTF-8';
                    case 'manifest': return 'text/cache-manifest; charset=UTF-8';
                    case 'ico': return 'image/x-icon';
                    case 'png': return 'image/png';
                    case 'jpg': return 'image/jpg';
                    case 'bmp': return 'image/bmp';
                    case 'svg': return 'image/svg';

                    default: return 'application/octet-stream';
                }
            }(filename.substring(filename.lastIndexOf('.') + 1)));
            // 异步读取文件,并将内容作为单独的数据块传回给回调函数
            // 对于确实很大的文件,使用API fs.createReadStream()更好
            // fs.createReadStream(filename)
            try {
                var content = fs.readFileSync(filename);
                response.writeHead(200, { 'Content-type': type });
                response.write(content); // 把文件内容作为响应主体
            } catch (e) {
                response.writeHead(404, { 'Content-type': 'text/plain; charset=UTF-8' });
                response.write("出错！" + e.message);
            }
            response.end();

    }

});
// ipcMain.on('getos',(event,arg)=>{
// event.reply(port);
// });
ipcMain.on('getserverinfo', (event, arg) => {
    // console.log(arg);
    event.returnValue = { port: port, IPv4: IPv4, password: password };
});
