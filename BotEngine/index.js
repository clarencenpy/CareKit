const http = require('http')
const Bot = require('messenger-bot')
const mongo = require('mongodb').MongoClient

const MONGO_URL = 'mongodb://localhost:3001/meteor';
const bot = new Bot({
  token: 'EAAagfPM1rmwBAD1JtOTdgz1wtZBuOvkKHNgNr6hHH7ZCGz5ZBmbZAvHgrBIoKY1vMvcBolzIFnhvZB9RrmJM0kvmE9tYMnrN4sX48d93xF5pivWnwxwHNdWxsZBDcKlAAjgbcO8aOQyLfPcrQyfLvJ4kBfpdHY7SOnRkfpHz44ZBgZDZD',
  verify: 'CHECK_CHECK_ONE',
  app_secret: 'ff6255bfd5e4dea28cc8fa40821fb802'
})

mongo.connect(MONGO_URL).then(db => {

  const Messages = db.collection('messages')

  bot.on('error', (err) => {
    console.error(err.message)
  })

  bot.on('message', (payload, reply) => {
    console.log('\nreceived message')
    console.log(payload)
    let text = payload.message.text

    if (text.toLowerCase().indexOf('hello') >= 0) {
      bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) throw err

        reply({text: `Hello ${profile.first_name}, its nice to meet you!`}, () => {
          bot.sendSenderAction(payload.sender.id, 'typing_on')
        })
        setTimeout(() => {
          reply({text: 'Hey again after 5s!'})
        }, 5000)
      })
    }

    if (text.toLowerCase().indexOf('generic') >= 0) {
      console.log('request for generic message received.. sending')
      Messages.findOne({name: 'generic'}).then((m) => {
        reply(m.contents, (err) => {
          if (err) console.log(err)
        })
      })
    }


  })

  bot.on('postback', (payload, reply) => {
    console.log(`Payload: ${JSON.stringify(payload, null, 2)}`)
    console.log(payload.postback.payload)
    if (payload) {
      Messages.findOne({name: payload.postback.payload}).then((m) => {
        console.log(JSON.stringify(m, null, 2))
        reply(m.contents)
      })
      .catch((err) => {
        console.log(err)
      })
    }
  })


  http.createServer(bot.middleware()).listen(3004)
  console.log('Echo bot server running at port 3004.')
})

//old webhookurl -- https://k8f3lcdcpl.execute-api.us-east-1.amazonaws.com/latest/facebook