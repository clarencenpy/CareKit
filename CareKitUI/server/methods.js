Meteor.methods({

  getSavedPathways() {
    return Pathways.find({createdBy: Meteor.userId()}).fetch()
  },

  getPathway(id) {
    return Pathways.findOne({_id: id})
  },

  save({cards, pathwayName, id}) {
    Pathways.update({_id: id}, {
      _id: id,
      name: pathwayName,
      createdBy: Meteor.userId(),
      savedState: {
        cards,
        pathwayName
      }
    }, {upsert: true})
  },

  deploy({cards, pathwayName}) {

    //add entrypoint
    Messages.insert({
      entrypoint: true,
      contents: {
        title: pathwayName,
        buttons: [{
          type: 'postback',
          title: 'Start',
          payload: cards[0].id
        }]
      }
    })

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