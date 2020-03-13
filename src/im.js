const { Api } = require('./enc')
const Axios = require('axios').default

const axios = Axios.create({headers: {'Content-Type': 'text/plain;charset=UTF-8'}})

const sdkappid = 1400330732
const sdksecret = '0c00e08554976298af5fc102b154320b93aa3e776ee6ab3fa95ac9157dd1dd6c'
const identifier = 'administrator'
const expire = 60 * 24 * 30

const enc = new Api(sdkappid, sdksecret)

const sig = enc.genSig(identifier, expire)

function sendMsg(options = {}) {
  const {toAccount, fromAccount, syncOther, msgType, msgContent} = options
  const data = {
      "SyncOtherMachine": syncOther || 2, // 消息不同步至发送方
      "To_Account": toAccount,
      "MsgLifeTime":60, // 消息保存60秒
      "MsgRandom": 1287657,
      "MsgTimeStamp": Math.floor(Date.now() / 1000),
      "MsgBody": [
          {
              "MsgType": msgType || "TIMTextElem",
              "MsgContent": msgContent
          }
      ]
  }
  if (fromAccount) {
    data["From_Account"] = fromAccount
  }
  return new Promise((resolve, reject) => {
    axios.post(`https://console.tim.qq.com/v4/openim/sendmsg?sdkappid=${sdkappid}&identifier=${identifier}&usersig=${sig}&random=99999999&contenttype=json`, JSON.stringify(data))
    .then(res => {
      if (res.data.ActionStatus === 'OK') {
        resolve()
      } else {
        reject( res.data.ErrorCode + res.data.ErrorInfo)
      }
    })
  })
}

function importUser(users=[]) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({Accounts: users})
    axios.post(`https://console.tim.qq.com/v4/im_open_login_svc/multiaccount_import?sdkappid=${sdkappid}&identifier=${identifier}&usersig=${sig}&random=99999999&contenttype=json`, data, {headers: {}})
    .then(res => {
      if (res.data.ActionStatus === 'OK') {
        resolve()
      } else {
        reject(res.data.ErrorInfo)
      }
    })
  })
}

function deleteUsers(users = []) {
  const mapUsers = users.map(u => ({UserID: u}))
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({DeleteItem: mapUsers})
    axios.post(`https://console.tim.qq.com/v4/im_open_login_svc/account_delete?sdkappid=${sdkappid}&identifier=${identifier}&usersig=${sig}&random=99999999&contenttype=json`, data)
    .then(res => {
      if (res.data.ActionStatus === 'OK') {
        resolve()
      } else {
        reject(res.data.ErrorInfo)
      }
    })
  })
}

module.exports = {
  sendMsg,
  importUser,
  deleteUsers
}

