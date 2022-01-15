// const audio = require("fluent-ffmpeg/lib/options/audio");
// program.getConfig("")
// const { fstat } = require("fs");
// var mplayer = document.getElementById("musicurl");


// // textarea 菜单键点击
// for (var i = 0; i < valueslist.length; i++)
//     valueslist[i].addEventListener('contextmenu', ev => {
//         // 阻止默认行为
//         ev.preventDefault();
//         // 获取鼠标位置
//         // 把鼠标位置发送到主进程
//         openeditmenu(ev.clientX, ev.clientY);
//     });
function parseEnter(e, ele) {
    var evt = window.event || e;
    if (evt.keyCode == 13) {
        // searchSongs(ele.value);
    }
}
function HTMLEncode(html) {
    // html = html.replaceAll(" ","&nbsp;")
    var temp = document.createElement("div");
    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
    var output = temp.innerHTML;
    temp.remove();
    temp = null;
    return output;
}


function HTMLEncode1(html) {
    if (html == null) return "";
    if (html == undefined) return "";
    var a = html.toString();
    a = a.replaceAll("<", "&lt;");
    a = a.replaceAll(">", "&gt;");
    a = a.replaceAll("\n", "<br/>");
    a = a.replaceAll(" ", "&nbsp;");
    return a;
}
/**
确认是否框
@param title 标题
@param content 内容
@param coded 是否转义
@param OKTitle 'OK' 标题
@param CANCELTitle 'CANCEL' 标题·
@param OKrecallFunc 'OK' 回调函数
@param CANCELrecallFunc 'CANCEL' 回调函数
*/
function c_confirm(title, content, coded, OKTitle, CANCELTitle, OKrecallFunc, CANCELrecallFunc) {
    var titles = title, contents = content;
    if (coded == null) coded = true;

    if (coded) {
        titles = HTMLEncode1(titles);
        contents = HTMLEncode1(contents);
    }
    var code = `<div id="alert-${++msgID}" style="display:none;" class="newadd alertBox"><div class="bcontent Mcenter">
    <h1>${titles}</h1>
    <div class="des">${contents}</div>
    <div class="control">
        <button class="button" onclick="cancelAlert(this);${OKrecallFunc}">${(OKTitle == null) ? "确定" : OKTitle}</button>
        <button class="button" onclick="cancelAlert(this);${CANCELrecallFunc}">${(CANCELTitle == null) ? "取消" : CANCELTitle}</button>
    </div>
</div>
    </div>`;
    document.getElementById("alertBox").innerHTML += code;
    var ele = document.getElementsByClassName("newadd")[0];
    $(ele).fadeIn(200);
    ele.classList.remove("newadd");
}
/**
提示框
@param title 标题
@param content 内容
@param coded 是否转义
@param OKTitle 'OK' 标题
@param recallFunc 回调函数
*/
function c_alert(title, content, coded, OKTitle, recallFunc) {
    msgID++;
    var titles = title, contents = content;
    if (coded == null) coded = true;
    if (coded) {
        titles = HTMLEncode1(titles);
        contents = HTMLEncode1(contents);
    }
    var code = `<div id="alert-${msgID}" style="display:none;" class="newadd alertBox"><div class="bcontent Mcenter">
    <h1>${titles}</h1>
    <div class="des">${contents}</div>
    <div class="control">
        <button class="button" onclick="cancelAlert(this);${recallFunc}">${(OKTitle == null) ? "确定" : OKTitle}</button>
    </div>
</div>
    </div>`;
    document.getElementById("alertBox").innerHTML += code;
    var ele = document.getElementsByClassName("newadd")[0];
    $(ele).fadeIn(200);
    ele.classList.remove("newadd");

}
function cancelAlert(btn) {
    var bbtn = btn;
    // bbtn.parentNode.parentNode.parentNode.style.display = "none";
    var id = bbtn.parentNode.parentNode.parentNode.id;
    bbtn.parentNode.parentNode.parentNode.style.pointerEvents = "none";
    // console.log(btn);
    $(bbtn.parentNode.parentNode.parentNode).fadeOut(200);
    setTimeout(`document.getElementById("${id}").remove()`, 200);
}
function propmtAlert(eleName, Func, FuncOK, OKmore) {
    // console.log(eleName);
    var ele = document.getElementById(eleName);
    // console.log(ele);

    var value = ele.getElementsByClassName("inputs")[0].value;
    // var value = ele.getElementsByClassName("inputs")[0].value;
    try {
        // console.log(`${Func}("${value.replaceAll("\\","\\\\").replaceAll("\"","\\\"")}", "${OKmore}")`)
        var back = eval(`${Func}("${value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}", "${OKmore}")`);
        // console.log(back);
        if (back == true || back == null || back == undefined) {
            cancelAlert(ele.getElementsByClassName("button")[0]);
            eval(`${FuncOK}("${value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}", "${OKmore}")`);
        }
    } catch (e) {
        cancelAlert(ele.getElementsByClassName("button")[0]);
        console.warn(e);
    }
}
/**
prompt
@param title 标题
@param content 内容
@param coded 是否转义
@param valueDef value 默认值
@param OKTitle 'OK' 标题
@param CANCELTitle 'CANCEL' 标题
@param inputJundge 输入判断函数
@param JundgeFuc 'OK' 函数 (return false 阻止关闭) 不加括号
@param OKmore 'OK' 更多参数
@param OKFunc 'OK' 回调
@param CANCELrecallFunc 'CANCEL' 回调函数 加括号
*/
function c_prompt(title, content, coded, valueDef, OKTitle, CANCELTitle, JundgeFunc, OKmore, OKFunc, CANCELrecallFunc) {
    var titles = title, contents = content;
    if (coded == null) coded = true;

    if (coded) {
        titles = HTMLEncode1(titles);
        contents = HTMLEncode1(contents);
    }
    msgID++;

    if (valueDef == null) valueDef = "";
    var code = `<div id="al-btn-${msgID}" style="display:none;" class="newadd alertBox"><div style="max-height:324px;" class="bcontent Mcenter">
    <h1>${titles}</h1>
    <div class="des-ipt">${contents}</div>
    <input class="inputs" value="${valueDef}" />
    <div class="control">
        <button class="button okbutton" onclick="">${(OKTitle == null) ? "确定" : OKTitle}</button>
        <button class="button" onclick="cancelAlert(this);${CANCELrecallFunc}">${(CANCELTitle == null) ? "取消" : CANCELTitle}</button>
    </div>
</div>
    </div>`;
    document.getElementById("alertBox").innerHTML += code;
    var ele = document.getElementsByClassName("newadd")[0];
    var ss = `propmtAlert("al-btn-${msgID}", "${JundgeFunc}", "${OKFunc}", "${OKmore}")`;
    ele.getElementsByClassName("okbutton")[0].onclick = () => {
        eval(ss);
    }
    $(ele).fadeIn(200);
    ele.classList.remove("newadd");

}


var oLRC = {
    ti: "", //歌曲名
    ar: "", //演唱者
    al: "", //专辑名
    by: "", //歌词制作人
    offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
    ms: [] //歌词数组{t:时间,c:歌词}
};
function to_string(s) {
    return "" + s;
}
function round(s) {
    return Math.round(s);
}
function toLrcTime(second) {
    var result = "";
    var tHour = 0, tMin = 0;
    var tSec = round(second * 100) / 100; //初始化变量，四舍五入秒数。
    tMin = parseInt(tSec / 60);
    tSec = parseInt((tSec * 100) % 6000) / 100; //先乘100再取余，最后除以100。
    tHour = parseInt(tMin / 60);
    tMin = parseInt(tMin % 60);
    if (tHour > 0) { //判断有没有1小时
        if (tHour < 10) result = result + "0"; //小时
        result = result + to_string(tHour);

        result = result + ":";

        if (tMin < 10) result = result + "0"; //分钟
        result = result + to_string(tMin);

        result = result + ":";

        if (tSec < 10) result = result + "0"; //秒
        result = result + to_string(tSec);

        if (tSec * 100 % 100 == 0) result = result + ".0";
        if (tSec * 100 % 10 == 0) result = result + "0";
    }
    else {

        if (tMin < 10) result = result + "0"; //分钟
        result = result + to_string(tMin);

        result = result + ":";

        if (tSec < 10) result = result + "0"; //秒
        result = result + to_string(tSec);
        if (tSec * 100 % 100 == 0) result = result + ".0";
        if (tSec * 100 % 10 == 0) result = result + "0";
    }
    return result;
}
function JsonToLrc(json) {
    //     .版本 2

    // J1.解析 (JSON)
    // .计次循环首 (J1.成员数 (), i)
    //     J2 ＝ J1.取成员 (i － 1)
    //     gc ＝ 选择 (gc ＝ “”, gc, gc ＋ #换行符) ＋ “[” ＋ 转换为时间 (到数值 (去左右文本 (J2.取属性对象 (“time”), #引号))) ＋ “] ” ＋ 去左右文本 (J2.取属性对象 (“lineLyric”), #引号)

    //     ' 调试输出 (J2.取属性对象 (“lineLyric”))
    // .计次循环尾 ()
    var result = "";
    for (var i in json) {
        try {
            var nl = json[i];
            result += (result == "" ? "" : "\n") + "[" + toLrcTime(nl.time) + "]" + nl.lineLyric;
        } catch (e) {
            showMsg(e, "error");
        }
    }
    return result;

}

function createLrcObj(lrc) {
    oLRC.ms = [];
    if (lrc.length == 0) return;
    var lrc1 = lrc;
    lrc1.replaceAll("\r\n", "\n");
    lrc1.replaceAll("\n\r", "\n");
    lrc1.replaceAll("\r", "\n"); //处理特殊换行
    var lrcs = lrc1.split('\n');//用回车拆分成数组
    for (var i in lrcs) {//遍历歌词数组
        lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
        var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
        var s = t.split(":");//分离:前后文字
        if (isNaN(parseInt(s[0]))) { //不是数值
            for (var i in oLRC) {
                if (i != "ms" && i == s[0].toLowerCase()) {
                    oLRC[i] = s[1];
                }
            }
        } else { //是数值
            var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
            var start = 0;
            for (var k in arr) {
                start += arr[k].length; //计算歌词位置
            }
            var content = lrcs[i].substring(start);//获取歌词内容
            for (var k in arr) {
                var t = arr[k].substring(1, arr[k].length - 1);//取[]间的内容
                var s = t.split(":");//分离:前后文字
                oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
                    t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
                    c: content
                });
            }
        }
    }
    oLRC.ms.sort(function (a, b) {//按时间顺序排序
        return a.t - b.t;
    });
    /*
    for(var i in oLRC){ //查看解析结果
        console.log(i,":",oLRC[i]);
    }*/
    //From https://blog.csdn.net/fenglin247/article/details/86674646
}
var lrcs = [];

function lrcinit() {
    var res = "";
    for (var i in oLRC.ms) {
        var line = oLRC.ms[i];
        //t Time c Text
        var code = `<div id='lrc-${i}' class='lrc-line' time='${line.t}'>${line.c}</div>`
        res += code;
    }
    if (res == "") res = "<div id='lrc-0' class='lrc-line' time='0'>该歌曲无歌词提供</div>"
    document.getElementById("lrycishow").innerHTML = res;
}
var timer = 0;
function ScrolltoEx(ele, x) {
    if (timer != 0) {
        try {
            clearInterval(timer);
            timer = 0;
        } catch (e) {
            console.log(e);
        }
    }
    var mb = Math.round(x);
    if (mb < 0) mb = 0;
    if (mb > ele.scrollHeight) mb.ele.scrollHeight;
    var g = Math.round(Math.abs(x - ele.scrollTop) / 30);
    // console.log(g);
    if (g <= 0) g = 1;
    var tl = 0;
    timer = setInterval(function () {
        //让滚动条到顶部的距离自动缩减到0;
        // ele.scrollTop = document.body.scrollTop = Math.floor(Ontop - 200);//兼容性设置;
        //设置定时器
        // console.log(ele.scrollTop,mb)
        tl++;
        if (tl >= 50) {
            ele.scrollTop = mb;
            clearInterval(timer);
            timer = 0;
        } else
            if (Math.abs(ele.scrollTop - mb) <= g / 2) {
                ele.scrollTop = mb;
                clearInterval(timer);
                timer = 0;
            } else {
                // if (g < 16 && tt%2==0) g++,tt=1;
                // else tt++;
                if (ele.scrollTop > mb)
                    ele.scrollTop = (ele.scrollTop) - g;
                else
                    ele.scrollTop = (ele.scrollTop) + g;
            }
    }, 10);
}
// mplayer.ontimeupdate = () => {
//     //设置时间
//     var times = mplayer.currentTime;
//     // console.log(time)

//     var i = 0;
//     if (oLRC.ms.length == 0) return;
//     try {
//         var tmp = parseFloat(oLRC.ms[0].t);
//         while (i < oLRC.ms.length && tmp <= times) {
//             i++;
//             if (i < oLRC.ms.length) tmp = parseFloat(oLRC.ms[i].t);
//         }
//         // console.log(i);
//         i -= 1;
//         if (i == -1) i = 0;
//         hilightlrc(i);
//     } catch (e) {
//         console.log(e);
//     }

//     // setTime(currentTimeTxt, times);
//     // console.log(times);
//     //设置进度条
//     //document.getElementById("lrycishow").scrollTop = 10 / 100 *document.getElementById("lrycishow").scrollHeight
// };
function hilightlrc(idx) {
    var ele = document.getElementsByClassName("lrc-line-sel");
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].id == ('lrc-' + idx)) return;
        ele[i].classList.remove("lrc-line-sel");
    }
    var bh = window.innerHeight;
    // 显示到： bh/2;

    ScrolltoEx(document.getElementById("lrycishow"), (idx) / oLRC.ms.length * document.getElementById("lrycishow").scrollHeight - bh / 2 + 160);
    document.getElementById("lrc-" + idx).classList.add("lrc-line-sel");
}

var lasterr = "";
function showPage(whom) {
    if (whom.id == 'setting') {
        // flushLrcSetting();
    }
    else if (whom.id == "music") {
        // reflushCanvas();
    }
    else if (whom.id == 'mylove') {
        // flushLike();
    }
    var eles = document.getElementsByClassName("barlist-hover");
    for (var i = 0; i < eles.length; i++) {
        eles[i].classList.remove("barlist-hover");
    }
    whom.classList.add("barlist-hover");
    document.getElementById('selectBar').style.top = whom.getBoundingClientRect().top + "px";
    try {
        // console.log(whom.id);
        var eles = document.getElementsByClassName("page");
        for (var i = 0; i < eles.length; i++) {
            eles[i].style.display = "none";
        }
        document.getElementById("p" + whom.id).style.display = "inline-block";
    } catch (e) {
        console.error(e);
        lasterr = e;
        document.getElementById("errorPage").style.display = "inline-block";
        // document.getElementById("showerror").style.display = "inline-block";
        // document.getElementById("errormsg").style.display = "none";
    }
};
function showError(ele) {
    ele.style.display = "none";
    // document.getElementById("errormsg").style.display = "inline-block";
    // document.getElementById("errormsg").innerHTML = lasterr;
}
function delEle_A(ele) {
    // console.log(ele);
    $("#" + ele).fadeOut(200);
    setTimeout(`delEle(document.getElementById('${ele}'))`, 200)
}
function delEle(ele) {
    ele.remove();
}

var msgID = 0;
function showMsg(val, type) { //Type: info error warn ok
    msgID++;
    var pid = `msg-${msgID + "-" + Math.round(Math.random() * 60 + 2)}`;
    var elcode = `<div id="${pid}" style="display:none;" class="message${type} messages">${val.toString().replaceAll("\n", "<br/>").replaceAll(" ", "&nbsp;")}</div>`;
    var msgBody = document.getElementById("messagebox");
    msgBody.innerHTML = elcode;
    if (type == 'info')
        console.log('%c 信息 %c ' + val + '\n', 'color: #fff; background: #030307; padding:5px 0; margin-top: 1em;', 'background: #efefef; color: #333; padding:5px 0;');
    else if (type == 'warn')
        console.log('%c 警告 %c ' + val + '\n', 'color: #fff; background: rgb(240, 237, 93); padding:5px 0; margin-top: 1em;', 'background: #efefef; color: #333; padding:5px 0;');
    else if (type == 'error')
        console.log('%c 错误 %c ' + val + '\n', 'color: #fff; background: rgb(236, 62, 62); padding:5px 0; margin-top: 1em;', 'background: #efefef; color: #333; padding:5px 0;');
    else if (type == 'ok')
        console.log('%c 通过 %c ' + val + '\n', 'color: #fff; background: rgb(37, 196, 16); padding:5px 0; margin-top: 1em;', 'background: #efefef; color: #333; padding:5px 0;');
    setTimeout(`delMsg('${pid}');`, 3000);
    $("#" + pid).fadeIn(500);
}
function removeMsg(pid) {
    var ele = document.getElementById(pid);
    try {
        ele.remove();

    } catch (e) {
        console.warn(e);
    }
}
function delMsg(pid) {
    // var msgBody = document.getElementById("messagebox");

    var ele = document.getElementById(pid);
    // console.log("->",pid,ele);
    if (ele != null) {
        // console.log("!!!",pid);
        $("#" + pid).fadeOut();
        setTimeout(`removeMsg('${pid}')`, 500);
    }
}
changeIP(program.ip.IPv4[0]);
document.getElementById("pswshow").innerHTML = `密钥：${program.ip.password}`;
function changeIP(IPAddress) {
    if (IPAddress == '' || IPAddress == null) {
        IPAddress = "127.0.0.1";
    }
    document.getElementById("localIp").href = `http://${IPAddress || "127.0.0.1"}:${program.ip.port}/checkNoRes?psw=${program.ip.password}`;
    document.getElementById("qrcode").style.backgroundImage = `url("http://${IPAddress || "127.0.0.1"}:${program.ip.port}/qr/${IPAddress.replaceAll(":", "_").replaceAll(".", "_")}_qr.png")`;
}
flushIps();
function changeIPEvent(ele) {
    var sel = ele.selectedIndex;
    // console.log(ele.options[sel].value);
    changeIP(ele.options[sel].value)
}
function flushIps() {
    var res = '';
    program.ip.IPv4.forEach((dat) => {
        var code = `<option ipaddress='${dat}'>${dat}</option>`;
        res += code;
    });
    document.getElementById("ipselect").innerHTML = res;
}
var Lastres = [];
function flushFiless() {
    var menu = "./res/http/files";
    var res = program.listFiles(menu, true, false);
    var sk = res;
    var l = 0;
    for (var i = 0; i - l < res.length; i++) {
        var flag = false;
        for (var j = 0; j < Lastres.length; j++) {
            if (res[i - l].name == Lastres[j].name) {
                flag = true;
                break;
            }
        }
        if (flag) {
            res.splice(i - l, 1);
            l++;
        }
    }
    // console.log(Lastres);
    Lastres = sk;
    var out = '';
    res.forEach((dat) => {
        var code = `<a href='${menu}/${dat.name}'>${dat.name}</a><br/>`;
        out += code;
    });
    document.getElementById("filelist").innerHTML = out + document.getElementById("filelist").innerHTML;

    reLinkOpen();
}
function flushFiles() {
    var menu = "./res/http/files";
    var res = program.listFiles(menu, true, false);
    Lastres = res;
    var out = '';
    res.forEach((dat) => {
        var code = `<a href='${menu}/${dat.name}'>${dat.name}</a><br/>`;
        out += code;
    });
    document.getElementById("filelist").innerHTML = out;

    reLinkOpen();
}
flushFiles();
setInterval(() => {
    if (program.isUpdated()) {
        flushFiless();
        showMsg("上传成功！","ok");
    };
}, 5000);

reLinkOpen();
function reLinkOpen() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        if (link.href != '#' && link.href != '' && link.href != null && link.href != undefined) {
            link.onclick = (e) => {
                e.preventDefault();
                openUrlInB(link.getAttribute('href'));
            }
        }
    });
}