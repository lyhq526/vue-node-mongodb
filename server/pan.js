const request = require('request');
const { Cookie } = require("../module/user")
const schedule = require('node-schedule')

let userList = [
    {
        headers: {
            'SessionKey': '52c70d2d-39b5-4682-a288-1b7160799308',
            'Signature': '3158657469979c0881974a4e471ac65fb25be742',
            'Date': 'Mon, 11 May 2020 04:37:28 GMT'
        },
        server: 'SCU97117Td7246eb6c0d8512e74b68486b5a11eef5eb60e3332f98',
        COOKIE_LOGIN_USER: '320EE9AFADCC1E9976D78517B15090991CD71784EE3834ECD58DF2FDED92714E262243FCED27F27DE2114364D9F73171B04FD85B1589E2AA3046C9ABBAB9337B'
    },
    {
        headers: {
            'SessionKey': '02bef9a9-401e-47e4-af09-6eeba5a30965',
            'Signature': 'b5e960fc4465191a7614cca00f2e993c5b9d9c65',
            'Date': 'Mon, 11 May 2020 02:00:09 GMT'
        },
        // server: 'SCU97117Td7246eb6c0d8512e74b68486b5a11eef5eb60e3332f98',
        COOKIE_LOGIN_USER: '9A55639E390C468BF49A0F9055D306C0B2D840D422F686FF1F81131959387648F9B6F5C740B5B87B2B8EDC6143A32D4A9EA49B2C6512AA4EDC62528A'
    },
    {
        headers: {
            'SessionKey': '0fcc86c3-7545-4a37-acc1-97198ceb1679',
            'Signature': '7ed01411e6db5beb19e753ed5f422431d08e4098',
            'Date': 'Mon, 11 May 2020 05:55:25 GMT'
        },
        server: 'SCU37112T9280f804f659fd07c04e7c1e69ab5c3a5c07e048851a3',
        COOKIE_LOGIN_USER: '070EE4A212DA14EB1EF16EE996736B6CD269EE4CF67DF0EF238EFB24BBBD6A084C08DA5D97F44014F10E6348C0801604FD77487D43E77A0874676118'
    },
    {
        headers: {
            'SessionKey': 'ebd4b2c0-bee3-402d-b8ef-1eefa56b1a8a',
            'Signature': '43033d2aa541b426c2c1bdb7abb33dedee4da05f',
            'Date': 'Thu, 14 May 2020 03:17:30 GMT'
        },
        //server: 'SCU37112T9280f804f659fd07c04e7c1e69ab5c3a5c07e048851a3',
        COOKIE_LOGIN_USER: '251BB4531AF1BF40E04E2CCF6D358F2C262A932E41B9B9243D04CDEAFF18B178C3190A498078D14F23B1C276E3DE202688A7669F53E9C54C1061E2E57DDC09D9'
    }
]
function stepOne(val) {
    return new Promise(function (resolve, reject) {
        request({ url: 'https://api.cloud.189.cn/mkt/userSign.action', headers: val.header, }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(body)
            } else {
                reject()
            }
        })
    })
}
function stepTwo(val) {
    return new Promise(function (resolve, reject) {
        const j = request.jar();
        const cookie = request.cookie('COOKIE_LOGIN_USER=' + val.COOKIE_LOGIN_USER);
        const url = 'https://m.cloud.189.cn/v2/drawPrizeMarketDetails.action?taskId=TASK_SIGNIN&activityId=ACT_SIGNIN';
        j.setCookie(cookie, url);
        request({ url: url, jar: j }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(body)
            } else {
                reject()
            }
        })
    })
}
function stepThree(val) {
    return new Promise(function (resolve, reject) {
        const j = request.jar();
        const cookie = request.cookie('COOKIE_LOGIN_USER=' + val.COOKIE_LOGIN_USER);
        const url = 'https://m.cloud.189.cn/v2/drawPrizeMarketDetails.action?taskId=TASK_SIGNIN_PHOTOS&activityId=ACT_SIGNIN';
        j.setCookie(cookie, url);
        request({ url: url, jar: j }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(body)
            } else {
                reject()
            }
        })
    })
}
function strat(list) {
    let length = list.length
    for (let i = 0; i < length; i++) {
        stepOne(list[i].panCookie).then((body) => {
            stepTwo(list[i].panCookie).then((body) => {
                stepThree(list[i].panCookie).then((body) => {
                    if (list[i].status == 2) {
                        Cookie.updateOne({ _id: list[i]._id }, { status: 1 }, (err, data) => {
                        })
                    }
                    if (list[i].ftqq) {
                        let Today = new Date();
                        request.post('https://sc.ftqq.com/' + list[i].ftqq + '.send').form({ text: '天翼云盘' + Today.getFullYear() + " 年 " + (Today.getMonth() + 1) + " 月 " + Today.getDate() + " 日签到成功" })
                    }

                })
            }).catch(() => {
                Cookie.updateOne({ _id: list[i]._id }, { status: -1 }, (err, data) => {
                    if (list[i].ftqq) {
                        request.post('https://sc.ftqq.com/' + list[i].ftqq + '.send').form({ text: 'cookie已经失效，请重新获取' })
                    }
                })


            })
        }).catch(() => {
            Cookie.updateOne({ _id: list[i]._id }, { status: -1 }, (err, data) => {
                if (list[i].ftqq) {
                    request.post('https://sc.ftqq.com/' + list[i].ftqq + '.send').form({ text: 'SessionKey已经失效，请重新获取' })
                }
            })


        })
    }
    // setTimeout(strat(), 1000*60*60*24);
}

const Rule = new schedule.RecurrenceRule()
Rule.hour = [0]
Rule.minute = [11]
schedule.scheduleJob(Rule, function () {
    // 每天早上七点16运行
    Cookie.find({ status: { $ne: -1 }, type: 2 }, (err, res) => {
        strat(res)
    })

})

