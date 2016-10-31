const botBuilder = require('claudia-bot-builder')
const excuse = require('huh')
const fbTemplate = require('claudia-bot-builder').fbTemplate
const rp = require('request-promise')

module.exports = botBuilder((request, originalApiRequest) => {
    if (!request.postback) {
        return rp(`https://graph.facebook.com/v2.8/${request.sender}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${originalApiRequest.env.facebookAccessToken}`)
            .then(response => {
                const user = JSON.parse(response)
                return [
                    `Hello ${user.first_name}. My name is Carrie, and I'll be pleased to assist you in your health matters.`,
                    'What can I do for you today?'
                ]
            })
    }   
})