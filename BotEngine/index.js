const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'EAAagfPM1rmwBAGWohqS325caNvEg55e3BKhTnPZCXbvMj1R5acCz4nC7qHYIkyBDa1w0AebcYF91MPVcWlXWSCkMUsVz1BoWXR9ZAmJEvFQWdNypDft0kO5Hfqlxa0w8TeZAZAPLZBUyLxTlZAbeJKw4iVHmnLVsundKUfG0sdAwZDZD',
  verify: 'CHECK_CHECK_ONE',
  app_secret: 'ff6255bfd5e4dea28cc8fa40821fb802'
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    reply({text: `Hello ${profile.first_name}, its nice to meet you!`}, () => {
      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
      bot.sendSenderAction(payload.sender.id, 'typing_on')
    })
    setTimeout(() => {
      reply({text: 'Hey again after 5s!'})
    }, 5000)
  })
})

http.createServer(bot.middleware()).listen(3004)
console.log('Echo bot server running at port 3004.')

//old webhookurl -- https://k8f3lcdcpl.execute-api.us-east-1.amazonaws.com/latest/facebook