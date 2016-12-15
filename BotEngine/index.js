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

    Messages.findOne({name: "keywords"}).then(message => {
      let keywordMap = message.keywordMap;
      let entrypoints = [];

      for (let keyword in keywordMap) {
        if (keyword !== "") {
          if (text.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
            entrypoints = entrypoints.concat(keywordMap[keyword]);
          }
        }
      }

      bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) console.log(err)

        if (entrypoints.length > 0) {
          reply({text: `Hey ${profile ? profile.first_name : 'there'}! Great to hear from you! I have found some CareKits that can help you!`}, () => {
            bot.sendSenderAction(payload.sender.id, 'typing_on')
          })
          Messages.find({_id: {$in: entrypoints}}).toArray().then(messages => {
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
        } else {
          reply({text: `Hey ${profile ? profile.first_name : 'there'}! Great to hear from you! I'm sorry.. I tried, but I couldn't find a CareKit for your needs..`})
        }
      })

    })

  })

  bot.on('postback', (payload, reply) => {
    console.log('\nReceived postback')
    console.log(payload)

    if (payload) {
      Messages.findOne({name: payload.postback.payload}).then((m) => {
        console.log(`\nSending response for ${payload.postback.payload}`)
        console.log(JSON.stringify(m, null, 2))
        reply(m.contents, err => {
          if (err) console.error(err)
        })
      })
    }
  })


  http.createServer(bot.middleware()).listen(3004)
  console.log('Echo bot server running at port 3004.')
})

//old webhookurl -- https://k8f3lcdcpl.execute-api.us-east-1.amazonaws.com/latest/facebook