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

  deploy({cards, pathwayName, id}) {
    //add entrypoint
    Messages.update({_id: id}, {
      _id: id,
      entrypoint: true,
      contents: {
        title: pathwayName,
        buttons: [{
          type: 'postback',
          title: 'Start',
          payload: cards[0].id
        }]
      }
    }, {upsert: true})

    //transform each card into the format messenger requires
    cards.forEach(card => {
      if (card.buttons.length > 0) {
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
                    type: b.type,
                    title: b.title,
                    payload: b.type === 'web_url' ? null : b.payload,
                    url: b.type === 'web_url' ? b.payload : null
                  }
                })
              }
            }
          }
        }
        Messages.update({name: output.name}, output, {upsert: true})

      } else {
        //card has no buttons
        Messages.update({name: card.id}, {
          name: card.id,
          contents: {
            text: card.message
          }
        }, {upsert: true})
      }
    })
  }
})