Meteor.methods({
  deploy(cards) {

    //save the state of the flowchart

    //transform each card into the format messenger requires
    cards = cards.map(card => {
      let output = {
        name: card.id,
        contents: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: card.message,
              buttons: card.buttons.map(b => {
                return {
                  type: 'postback',
                  title: b.text,
                  payload: b.postback
                }
              })
            }
          }
        }
      }

      Messages.update({name: output.name}, output, {upsert: true})
    })
  }
})