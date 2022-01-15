const request = require("request");
const fs = require("fs");
const path = require("path");
const progress = require('progress-stream');
const http = require("http");
const https = require("https");

//下载 的文件 地址
function test() {
    console.log("Load lib successfully!")
}

function downloader(URL, SavePath, callBackFunc) { // callBackFunc(data)
    // this.controller = new AbortController();
    // this.signal = this.controller.signal;
    this.fileURL = URL;
    //下载保存的文件路径
    this.fileSavePath = SavePath;
    //缓存文件路径
    this.downloadRequest = null;
    this.canceled = false;
    fs.mkdir(path.dirname(SavePath), () => { });
    this.tmpFileSavePath = path.join(path.dirname(SavePath), path.basename(SavePath) + new Date().getTime() + ".tmp");
    //创建写入流 
    this.callBackFunc = callBackFunc;
    this.cancel = () => {
        (downloadRequest.abort());
        // this.controller.abort();
        this.canceled = true;
        // console.log("Canceled");
        this.fileW.end();
        this.callBackFunc({ "state": "cancel", "msg": "不再关注下载" });
        try {
            fs.unlink(this.tmpFileSavePath, (err) => {
                if (err) console.warn(err);
                console.log('Deleted');
            });
        }
        catch (e) {
            console.warn(e);
        }
    }
    this.fileW = null;
    this.startDownload = () => {
        let sks = this;

        let tmpFileSavePath = this.tmpFileSavePath, fileSavePath = this.fileSavePath, callBackFunc = this.callBackFunc;
        try {
            fs.unlink(fileSavePath, (err) => {
                if (err) console.warn(err);
                // console.log('Deleted');
            });
            fs.unlink(tmpFileSavePath, (err) => {
                if (err) console.warn(err);
                // console.log('Deleted');
            });
        }
        catch (e) {
            console.warn(e);
        }

        // const fileStream = fs.createWriteStream(this.tmpFileSavePath).on('error', function (e) {
        //     console.error('error==>', e);
        //     callBackFunc({ "state": "failed", "msg": e });
        //     try {
        //         fs.unlink(fileSavePath, (err) => {
        //             if (err) console.warn(err);
        //             console.log('Deleted');
        //         });
        //         fs.unlink(tmpFileSavePath, (err) => {
        //             if (err) console.warn(err);
        //             console.log('Deleted');
        //         });
        //     }
        //     catch (e) {
        //         console.warn(e);
        //     }
        // }).on('ready', function () {
        //     // console.log("开始下载:", fileURL);
        //     callBackFunc({ "state": "started" });

        // }).on('finish', function () {
        //     //下载完成后重命名文件
        //     //console.log(tmpFileSavePath, fileSavePath);
        //     console.log("Finished");
        //     if (sks.canceled == true) {
        //         console.log("Delect the temp file.");
        //         try {
        //             fs.unlink(tmpFileSavePath, (err) => {
        //                 if (err) console.warn(err);
        //                 console.log('Deleted');
        //             });
        //         } catch (e) {
        //             console.warn(e);
        //         }

        //         return;
        //     }
        //     fs.renameSync(tmpFileSavePath, fileSavePath);

        //     callBackFunc({ "state": "done", "msg": fileSavePath });

        //     //console.log('文件下载完成:', fileSavePath);


        // });
        // let 
        // let signal =this.signal;

        if (this.canceled == true) return;
        if (this.fileURL.substr(0, "http://".length) === "http://") {
            console.log(1)
            http.get(this.fileURL, {
                rejectUnauthorized: false
            }, (res) => {
                // parseD(res);
                parseD(res, this.fileURL);
            });
        } else {
            // console.log(2,this.fileURL);
            https.get(this.fileURL, (res) => {
                // console.log(1)
                parseD(res, this.fileURL);
            });
        }
        function parseD(res, fileURL) {
            if (res.statusCode === 200) {
                res.setEncoding(null); // 设置编码
                let str = progress({
                    length: res.headers['content-length'],
                    time: 500 /* ms */
                });
                str.on('progress', function (progressData) {
                    // console.log('percentage:', progress.percentage) // 下载进度
                    callBackFunc({ "state": "doing", "progress": progressData });
                });
                let url = fileURL; // 远程文件下载地址
                let globalRequest = request.get({ url: url, encoding: null, strictSSL: false }, (err, requestRes, body) => {
                    if (err) console.warn(err);
                    // callback && callback();
                    // callBackFunc({ "state": "doing", "msg": "" });
                    if (sks.canceled == true) {
                        console.log("Delect the temp file.");

                        try {
                            fs.unlink(tmpFileSavePath, (err) => {
                                if (err) console.warn(err);
                                console.log('Deleted');
                            });
                        } catch (e) {
                            console.warn(e);
                        }

                        callBackFunc({ "state": "cancel", "msg": fileSavePath });

                        return;
                    }
                    console.log("下载完毕！")
                    fs.renameSync(tmpFileSavePath, fileSavePath);
                    callBackFunc({ "state": "done", "msg": fileSavePath });
                });
                // 两个pip(通道) => 下载进度监控、存储到本地路径
                this.fileW = fs.createWriteStream(tmpFileSavePath);

                globalRequest.pipe(str).pipe(this.fileW);
                this.downloadRequest = globalRequest; // 用于取消下载
                // return globalRequest;
            } else {
                callBackFunc({ "state": "failed", "msg": '远程地址出错:' + res.statusMessage });
                console.warn(res.statusMessage)
            }
        }
        // var req = request(this.fileURL, {
        //     method: 'GET',
        //     headers: { 'Content-Type': 'application/octet-stream' },
        //     // timeout: 100,
        // }).then(res => {
        //     if (this.canceled == true) return;
        //     //获取请求头中的文件大小数据
        //     let fsize = res.headers.get("content-length");
        //     //创建进度
        //     let str = progressStream({
        //         length: fsize,
        //         time: 500 /* ms */
        //     });
        //     // 下载进度 
        //     var sk = this;
        //     str.on('progress', function (progressData) {
        //         if (sk.canceled == true) return;
        //         // console.log(111)
        //         //不换行输出
        //         // let percentage = Math.round(progressData);
        //         callBackFunc({ "state": "doing", "progress": progressData });
        //         //console.log(percentage);
        //         // process.stdout.write('\033[2J'+);
        //         // console.log(progress);
        //         /*
        //         {
        //             percentage: 9.05,
        //             transferred: 949624,
        //             length: 10485760,
        //             remaining: 9536136,
        //             eta: 42,
        //             runtime: 3,
        //             delta: 295396,
        //             speed: 949624
        //         }
        //         */
        //     });
        //     res.body.pipe(str).pipe(fileStream);
        // }).catch(e => {
        //     //自定义异常处理

        //     console.warn(e);
        //     callBackFunc({ "state": "failed", "msg": ("详见 DevTools" + "") });

        //     try {
        //         // console.log(tmpFileSavePath)

        //         fs.unlink(tmpFileSavePath, (err) => {
        //             if (err) console.warn(err);
        //             console.log('Deleted');
        //         });

        //         fs.unlink(fileSavePath, (err) => {
        //             if (err) console.warn(err);
        //             console.log('Deleted');
        //         });
        //         // fs.unlink(tmpFileSavePath);
        //     }
        //     catch (e) {
        //         console.warn(e);
        //     }

        // });

        // console.log(signal);
    }

    //请求文件

}
module.exports = {
    downloader,
    test
}