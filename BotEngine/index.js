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
    console.log('\nReceived message')
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
      return
    }

    if (text.toLowerCase().indexOf('generic') >= 0) {
      Messages.findOne({name: 'generic'}).then((m) => {
        console.log('\nSending response for generic')
        console.log(JSON.stringify(m, null, 2))
        reply(m.contents)
      }, err => {
        if (err) console.error(err)
      })
      return
    }

    //this endpoint returns a list of all entry points
    if (text.toLowerCase().indexOf('all') >= 0) {
      Messages.find({entrypoint: true}).toArray().then(messages => {
        reply({
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: messages.map(m => {
                return m.contents
              })
            }
          }
        }, err => {
          if (err) console.error(err)
        })
      })
      return
    }

  })

  bot.on('postback', (payload, reply) => {
    console.log('\nReceived postback')
    console.log(payload)

    if (payload) {
      Messages.findOne({name: payload.postback.payload}).then((m) => {
        console.log(`\nSending response for ${payload.postback.payload}`)
        console.log(JSON.stringify(m, null, 2))
        reply(m.contents)
      })
    }
  })


  http.createServer(bot.middleware()).listen(3004)
  console.log('Echo bot server running at port 3004.')
})

//old webhookurl -- https://k8f3lcdcpl.execute-api.us-east-1.amazonaws.com/latest/facebook