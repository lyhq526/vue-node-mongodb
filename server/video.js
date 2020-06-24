const request = require('request');
const schedule = require('node-schedule')
const { Cookie } = require('../module/user')
console.log('开始运行')
let loginUrl = 'https://access.video.qq.com/user/auth_refresh?vappid=11059694&vsecret=fdf61a6be0aad57132bc5cdf78ac30145b6cd2c1470b0cfe&type=qq&g_tk=&g_vstk=457703998&g_actk=1876589028&callback=jQuery1910047501314075923284_1590934892643&_=1590934892644';
let loginHeader = {
    'Referer': 'https://v.qq.com',
    'Cookie': '_ga=GA1.2.1592508785.1585213546; RK=O9Bp1Z8yfG; ptcz=40e2965b08f737c2976705ea88a9fa272eee4f5eef233a37b8c848a116a9ebdd; pgv_pvi=1615601664; tvfe_boss_uuid=3220cf98c9dea97f; video_guid=3b9156e421439e7c; video_platform=2; pgv_pvid=7546546872; gid=aa300c2c-0320-4bd2-81c9-efa41367b251; idt=1590908283; pgv_si=s176851968; pgv_info=ssid=s2256421417; _qpsvr_localtk=0.09295763290022041; main_login=qq; vqq_access_token=3E135E8E08C9CBB7165C7D944FD4FAFD; vqq_appid=101483052; vqq_openid=645F0707888CEF3CEA509BA37D428D2A; vqq_vuserid=151667436; vqq_vusession=FauNodAAOqbay5TxfD6MsA..; vqq_refresh_token=6FCD16BE2B22FBEBD81311F4BC741C76; login_time_init=2020-5-31 21:59:37; vqq_next_refresh_time=5221; vqq_login_time_init=1590934853; login_time_last=2020-5-31 22:20:54'
}
let url1 = 'https://vip.video.qq.com/fcgi-bin/comm_cgi?name=hierarchical_task_system&cmd=2'
let url2 = 'https://v.qq.com/x/bu/mobile_checkin'
let url3 = 'https://vip.video.qq.com/fcgi-bin/comm_cgi?name=spp_MissionFaHuo&cmd=4&task_id=1' //# 看视频60min
let url4 = 'https://vip.video.qq.com/fcgi-bin/comm_cgi?name=spp_MissionFaHuo&cmd=4&task_id=3' //# 使用弹幕特权
let url5 = 'https://vip.video.qq.com/fcgi-bin/comm_cgi?name=spp_MissionFaHuo&cmd=4&task_id=6' //# 使用赠片特权
let url6 = 'https://vip.video.qq.com/fcgi-bin/comm_cgi?name=spp_MissionFaHuo&cmd=4&task_id=7' //# 使用下载特权
function login(loginHead) {
    return new Promise((resolve, reject) => {
        request({ url: loginUrl, headers: loginHead, }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(formMate(body).vusession)
            } else {
                reject()
            }
        })
    })
}
async function start(loginHead) {
    return await new Promise((res, rej) => {
        login(loginHead).then(async (newVusession) => {
            let signHeader = loginHead
            signHeader.Cookie = signHeader.Cookie.split('vqq_vusession=')[0] + 'vqq_vusession=' + newVusession + ';'
            let str = ''
            await new Promise((resolve, reject) => {
                request({ url: url1, headers: signHeader, }, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        if (formMate(body).checkin_score !== null) {
                            str = str + '会员签到活动：' + formMate(body).checkin_score + '\n\n'
                        } else {
                            str = str + '会员签到活动：失败可能是cookie失效\n\n'
                        }
                        resolve()
                    } else {
                        reject()
                    }
                })
            })
            await new Promise((resolve, reject) => {
                request({ url: url2, headers: signHeader, }, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        str = str + '第二个签到活动，不知有什么用处\n\n'
                        resolve()
                    } else {
                        reject()
                    }
                })
            })
            await new Promise((resolve, reject) => {
                request({ url: url3, headers: signHeader, }, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        if (formMate(body).msg) {
                            str = str + '观看60分钟任务：' + formMate(body).msg + '\n\n'
                        } else {
                            str = str + '观看60分钟任务：失效，可能是cookie问题\n\n'
                        }
                        resolve()
                    } else {
                        reject()
                    }
                })
            })
            await new Promise((resolve, reject) => {
                request({ url: url4, headers: signHeader, }, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        if (formMate(body).msg) {
                            str = str + '使用弹幕特权：' + formMate(body).msg + '\n\n'
                        } else {
                            str = str + '使用弹幕特权：失效，可能是cookie问题\n\n'
                        }
                        resolve()
                    } else {
                        reject()
                    }
                })
            })
            await new Promise((resolve, reject) => {
                request({ url: url5, headers: signHeader, }, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        if (formMate(body).msg) {
                            str = str + '使用赠片特权：' + formMate(body).msg + '\n\n'
                        } else {
                            str = str + '使用赠片特权：失效，可能是cookie问题\n\n'
                        }
                        resolve()
                    } else {
                        reject()
                    }
                })
            })
            await new Promise((resolve, reject) => {
                request({ url: url6, headers: signHeader, }, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        if (formMate(body).msg) {
                            str = str + '使用下载特权：' + formMate(body).msg + "\n\n"
                        } else {
                            str = str + '使用下载特权：失效，可能是cookie问题\n\n'
                        }
                        resolve()
                    } else {
                        reject()
                    }
                })
            })
            res(str)
        }).catch(() => {
            rej()
        })
    })
}
function formMate(val) {
    return JSON.parse(JSON.stringify(val).match(/(?<=\().*(?=\))/g)[0].replace(/\\/g, ''))
}
const Rule = new schedule.RecurrenceRule()
Rule.hour = [16]
Rule.minute = [50]
schedule.scheduleJob(Rule, function () {
    // 每天晚上十一点三十运行
    Cookie.find({ status: { $ne: -1 } }, (err, data) => {
        if (err) {
            console.log('数据库查询错误')
            return
        }
        let dataLength = data.length
        for (let i = 0; i < dataLength; i++) {
            start({ 'Referer': 'https://v.qq.com', Cookie: data[i].videoCookie }).then(res => {
                console.log('成功')
                if (data[i].status === 2) {
                    Cookie.updateOne({ _id: data[i]._id }, { status: 1 }, (err, data) => {
                        if (data[i].ftqq && data[i].ftqq !== '') {
                            request.post('https://sc.ftqq.com/' + data[i].ftqq + '.send').form({ text: '腾讯视频签到结果', desp: res })
                        }
                    })
                } else {
                    if (data[i].ftqq && data[i].ftqq !== '') {
                        request.post('https://sc.ftqq.com/' + data[i].ftqq + '.send').form({ text: '腾讯视频签到结果', desp: res })
                    }
                }

            }).catch(() => {
                Cookie.updateOne({ _id: data[i]._id }, { status: -1 }, (err, res) => {
                    if (err) {
                        console.log(err)
                        console.log('更新错误')
                        return
                    }
                    if (data[i].ftqq && data[i].ftqq !== '') {
                        request.post('https://sc.ftqq.com/' + data[i].ftqq + '.send').form({ text: '腾讯视频签到Cookie失效' })
                    }
                    console.log('失效')
                })
            })
        }
    })
})