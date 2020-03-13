const im = require('./im')

function robotAutoRep(user) {
  const options = {
    fromAccount: 'robot',
    toAccount: user,
    msgContent: {
      Text: '请问您需要咨询什么？'
    }
  }
  return im.sendMsg(options)
}

function robotPickServicer(user, servicer) {
  const options = {
    fromAccount: 'robot',
    toAccount: user,
    msgType: 'TIMCustomElem',
    msgContent: {
      Data: servicer
    }
  }
}

module.exports = {
  robotAutoRep,
  robotPickServicer
}