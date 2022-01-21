const { contextBridge, ipcRenderer } = require('electron');
const { shell } = require('electron');
// const path = require('path');
const { downloader } = require('./lib/downloadzip.js');
const open = require('open');

const iconv = require('iconv-lite');
var ipsinfo = (ipcRenderer.sendSync("getserverinfo", "s"));
// console.log("sss")
const fs = require('fs');
const path = require('path');
function getInfoFromMain() {
    return ipcRenderer.sendSync("getupdate", "");
}
function getFiles() {
    return ipcRenderer.sendSync("getupdatefiles", "");
}

var msgID = 0;
function showMsg(val, type) { //Type: info error warn ok
    msgID++;
    // var pid = `msg-${msgID + "-" + Math.round(Math.random() * 60 + 2)}`;
    // var elcode = `<div id="${pid}" style="display:none;" class="message${type} messages">${val.toString().replaceAll("\n", "<br/>").replaceAll(" ", "&nbsp;")}</div>`;
    // var msgBody = document.getElementById("messagebox");
    // msgBody.innerHTML = elcode;
    if (type == 'info')
        console.log('%c 信息 %c ' + val + '\n', 'color: #fff; background: #030307; padding:5px 0; margin-top: 1em;', 'background: #efefef; color: #333; padding:5px 0;');
    else if (type == 'warn')
        console.log('%c 警告 %c ' + val + '\n', 'color: #fff; background: rgb(240, 237, 93); padding:5px 0; margin-top: 1em;', 'background: #efefef; color: #333; padding:5px 0;');
    else if (type == 'error')
        console.log('%c 错误 %c ' + val + '\n', 'color: #fff; background: rgb(236, 62, 62); padding:5px 0; margin-top: 1em;', 'background: #efefef; color: #333; padding:5px 0;');
    else if (type == 'ok')
        console.log('%c 通过 %c ' + val + '\n', 'color: #fff; background: rgb(37, 196, 16); padding:5px 0; margin-top: 1em;', 'background: #efefef; color: #333; padding:5px 0;');
    // setTimeout(`delMsg('${pid}');`, 3000);
    // $("#" + pid).fadeIn(500);
}
// contextBridge.
const request = require('request');
// console.log(dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }))
var func = null;
contextBridge.exposeInMainWorld('writeFile', (paths, data, coding) => {
    // ipcRenderer.send("writefile",{path:paths,data:data,coding:coding});
    try {
        // var ;
        var encoded = iconv.encode(data.toString(), coding);
        fs.writeFileSync(paths, encoded, err => {
            return false;
        })
        return true;
    } catch (e) {
        console.warn(e)
        return false;
    }
});
contextBridge.exposeInMainWorld('selDir', (dat) => {
    func = dat;
    ipcRenderer.send("openDir", {});

});
ipcRenderer.on('log', (event, dat) => {
    console.log(dat);
});
ipcRenderer.on('returnDir', (event, dat) => {
    // var jj = JSON.parse(dat.func);
    func(dat.file);
    // console.log(jj)
    // console.log(`${jj.func}(${dat.file})`);
    // eval(`${jj.func}("${dat.file}")`);
});
function getCommandLine() {
    switch (process.platform) {
        case 'darwin': return 'open';
        case 'win32': return 'start "Bamboo Tool"';
        case 'win64': return 'start "Bamboo Tool"';
        default: return 'xdg-open';
    }
}
contextBridge.exposeInMainWorld('openUrlInB', (url) => {
    if (url == '#' || url == '') return;
    var cmd = getCommandLine();
    // shell.openExternal(url);
    var exec = require('child_process').exec;
    exec(`${cmd} "${url}"`);
    // open(url);
});
// contextBridge.exposeInMainWorld('openUrlInThis')
// const ffmpeg = require('fluent-ffmpeg');
// ffmpeg.setFfmpegPath("./ffmpeg.exe");
//ffmpeg('/path/to/file.avi')
// .on('progress', function(progress) {
//     console.log('Processing: ' + progress.percent + '% done');
//   });
// var command = ffmpeg('/path/to/file.avi');
// var command = ffmpeg(fs.createReadStream('/path/to/file.avi'));
// var command = ffmpeg({ option: "value", ... });
// var command = ffmpeg('/path/to/file.avi', { option: "value", ... });
// The following options are available:

// source: input file name or readable stream (ignored if an input file is passed to the constructor)
// timeout: ffmpeg timeout in seconds (defaults to no timeout)
// preset or presets: directory to load module presets from (defaults to the lib/presets directory in fluent-ffmpeg tree)
// niceness or priority: ffmpeg niceness value, between -20 and 20; ignored on Windows platforms (defaults to 0)
// logger: logger object with debug(), info(), warn() and error() methods (defaults to no logging)
// stdoutLines: maximum number of lines from ffmpeg stdout/stderr to keep in memory (defaults to 100, use 0 for unlimited storage)

// const { buildMenu } = require('./index.js');

// const { callbackify } = require('util');
var package = require("./package.json");
// var setting = require("./setting.json");
let setting = {};
let file = './setting.json'; // 文件路径
let isDef = true;
let fileD = "";
try {
    var data = fs.readFileSync(file);
    setting = JSON.parse(data.toString());
} catch (e) {
    console.log(e);
}
function saveConfig() {
    if (!isDef) {
        try {
            fs.writeFileSync(fileD, JSON.stringify(setting), 'UTF-8');
        } catch (e) {
            console.warn(e);
        }
        return;
    }
    try {
        fs.writeFileSync(file, JSON.stringify(setting), 'UTF-8');
    } catch (e) {
        console.warn(e);
    }

};

/**
 * 连接数组
 * @param a 数组a
 * @param b 数组b 会加入数组a
 */
function c_concat(a, b) {
    for (var i in b) {
        a[a.length] = b[i];
    }
}
/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 * @param dg 是否搜寻子文件夹
 * @param includeDir 是否包含目录
 */
function fileDisplay(filePath, dg, includeDir) {
    //根据文件路径读取文件，返回文件列表
    var result = [];

    try {
        let files = fs.readdirSync(filePath);
        files.forEach(function (filename) {
            //获取当前文件的绝对路径
            var filedir = path.join(filePath, filename);
            //根据文件路径获取文件信息，返回一个fs.Stats对象
            try {
                let stats = fs.statSync(filedir);

                var isFile = stats.isFile(); //是文件
                var isDir = stats.isDirectory(); //是文件夹
                if (isFile) {
                    // console.log(filedir);
                    result[result.length] = { type: 'file', path: filedir };
                }
                if (isDir && includeDir) {
                    result[result.length] = { type: 'dir', path: filedir };
                    // console.log(filedir);

                }
                if (isDir && dg) {
                    c_concat(result, (result.length, 0, fileDisplay(filedir))); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                }

            } catch (e) {
                console.warn(e);
            }

        });
    } catch (e) {
        console.warn(e);
    }
    // console.log(result)
    return result;
}
function useExample(exampleName) {
    isDef = false;
    fileD = "./" + exampleName;
    setting = [];

    try {
        var data = fs.readFileSync(fileD);

        setting = JSON.parse(data.toString());

    } catch (e) {
        console.log(e);

        return false;
    }
    return true;
}
contextBridge.exposeInMainWorld('program', {
    ip: ipsinfo,
    getFiles: () => { return getFiles() },
    hadFile: (filename) => {
        return fs.existsSync(filename);
    }, isUpdated: () => {
        return getInfoFromMain();
    }, getState: () => {
        return isDef;
    },
    getinfo: () => {
        var rjson = { "package": {}, "process": {} };
        rjson.package = package;
        rjson.process = process.versions;
        return rjson;
    },
    setConfig: (config, value) => {
        // if (!isDef) {
        // showMsg("无法设置：当前使用预设配置。若要修改配置，请换成自定义配置。", "error");
        // return false;
        // }
        setting[config] = value;
        saveConfig();
        return true;
    },
    getConfig: (config, defaultValue) => {

        var rt = setting[config];
        if (rt == null) rt = defaultValue;
        if (rt == undefined) rt = defaultValue;
        return rt;
    },
    saveAs: (fileName, name) => {
        fileName += ".json";
        try {
            var pt = path.dirname("./example/" + fileName);
            fs.mkdirSync(pt);
        } catch (e) {
            console.warn(e);
        }
        try {
            setting.name = name;

            fs.writeFileSync("./example/" + fileName, JSON.stringify(setting), 'UTF-8');
            // useExample("example/" + fileName);
            return true;

        } catch (e) {
            console.warn(e);
            return false;

        }
        return false;
    }, useDef: () => {
        setting = {};
        isDef = true;

        try {
            var data = fs.readFileSync(file);
            setting = JSON.parse(data.toString());
        } catch (e) {
            console.log(e);
            // return false;
        }
        console.log("配置文件恢复！");
        // setting = 
        return true;

    },
    useExample: (exampleName) => {
        return useExample(exampleName);
    },
    listFiles: (Menu, Deep, includeDir) => {
        var res = fileDisplay(Menu, Deep, includeDir);
        // if()
        var ress = [];
        for (var i in res) {
            let name = path.basename(res[i].path, "");
            ress[ress.length] = { name: name, path: res[i].path };
        }
        return ress;
    },
    listExampleConfig: (dg) => {
        var res = fileDisplay("./example", dg, false, false);
        var ress = [];
        for (var i in res) {
            let name = path.basename(res[i].path, "json");
            try {
                var resss = fs.readFileSync(res[i].path, "UTF-8");
                name = JSON.parse(resss).name;
            } catch (e) {
                console.warn(e);
            }
            ress[ress.length] = { name: name, path: res[i].path };
        }
        return ress;
    },
    resetConfig: (a) => {
        if (!isDef && !a) {
            showMsg("重置失败！", "error");
            return false;
        }
        try {
            if (!isDef) fs.unlinkSync(fileD, function (err) {
                if (err) {
                    console.warn(err)// eslint-disable-line
                } else {

                }
            });
            else fs.unlinkSync(file, function (err) {
                if (err) {
                    console.warn(err)// eslint-disable-line
                } else {

                }
            });
        } catch (e) {
            console.warn(e);
        }

        setting = {};
        return true;
    },
    returnConfig: () => {
        return setting;
    }
});
contextBridge.exposeInMainWorld('downloader', (URL, SavePath, callBackFunc) => {
    return new downloader(URL, SavePath, callBackFunc);
});
contextBridge.exposeInMainWorld('openeditmenu', (x, y) => {
    ipcRenderer.send("openeditmenu", { "x": x, "y": y });
});
contextBridge.exposeInMainWorld('fetchinfo', (url, headers, recfunc, otherc) => {


    const options = {
        url: url,
        headers: headers
    };

    function callback(error, response, body) {

        if (!error && response.statusCode == 200) {
            try {
                recfunc(JSON.parse(body), otherc);
                return;
            } catch (e) {

            }
            recfunc(body, otherc);
            return;
            // const info = JSON.parse(body);
            // console.log(info.stargazers_count + " Stars");
            // console.log(info.forks_count + " Forks");
        } else {
            // try{
            recfunc(body, otherc);
            // }catch(e){
            //     console.warn(body, otherc, e)
            // }
        }
    }

    request(options, callback);
});

