const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const im = require('./src/im')
const ctlr = require('./src/controller')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.post('/api/need-robot', (req, res) => {
  const {user} = req.body
  const options = {
    fromAccount: 'robot',
    toAccount: user,
    msgContent: {
      Text: '请问您需要咨询什么？'
    }
  }
  im.sendMsg(options)
  .then(() => {
    res.json({code: 0, msg: 'success'})
  })
  .catch(msg => {
    res.end({code: 1, msg})
  })
})

app.post('/api/need-servicer', async (req, res) => {
  const { servicer, user } = req.body
  const options1 = {
    fromAccount: user,
    toAccount: servicer,
    msgType: 'TIMCustomElem',
    msgContent: {
      Data: 'new_user',
    }
  }
  const options2 = {
    fromAccount: servicer,
    toAccount: user,
    syncOther: 1,
    msgContent: {
      Text: '您好！'
    }
  }
  try {
    await im.sendMsg(options1)
    await im.sendMsg(options2)
    res.json({code: 0, msg: 'success'})
  } catch(msg) {
    res.json({code: 1, msg})
  }
})

const commendType = {
  'State.StateChange': 'State.StateChange',
  "C2C.CallbackAfterSendMsg": 'C2C.CallbackAfterSendMsg'
}

const UserState = {
  "Logout": "Logout",
  "LogIn": "LogIn"
}

app.post('/api/im-callback', (req, res) => {
  const { CallbackCommand, Info, From_Account, To_Account, MsgBody } = req.body
  switch (CallbackCommand) {
    case commendType["State.StateChange"]:
      if (Info.Action === UserState.LogIn && !/servicer/.test(Info.TO_Account)) {
        ctlr.robotAutoRep(Info.TO_Account)
      }
      break
    case commendType["C2C.CallbackAfterSendMsg"]:
      if (To_Account === 'robot') {
        ctlr.robotPickServicer(From_Account, 'servicer1')
      }
      break
  }
  const resData = {
    "ActionStatus": "OK", 
    "ErrorInfo": "", 
    "ErrorCode": 0
  }
  res.json(resData)
})

const port = process.env.PORT || 3000
app.listen(port,err => {
  if (err) {
    throw err
  } else {
    console.log(`listening to localhost://${port}`)
  }
})