Meteor.methods({

  getSavedPathways() {
    return Pathways.find({createdBy: Meteor.userId()}).fetch()
  },

  getPathway(id) {
    return Pathways.findOne({_id: id})
  },

  save({cards, pathwayName, keywords, id}) {
    Pathways.update({_id: id}, {
      _id: id,
      name: pathwayName,
      createdBy: Meteor.userId(),
      keywords: keywords,
      savedState: {
        cards,
        pathwayName
      }
    }, {upsert: true})
  },

  deploy({cards, pathwayName, id, keywords}) {
    //add entrypoint

    let keywordResult = Messages.findOne({name: "keywords"})
    let keywordMap = {};
    let entryPointMap = {};
    let storedEntryKeywords = [];
    if (keywordResult) {
      keywordMap = keywordResult.keywordMap;
      entryPointMap = keywordResult.entryPointMap;
    }

    if (id in entryPointMap) {
      storedEntryKeywords = entryPointMap[id];
      for (let i in storedEntryKeywords) {
        let keyword = storedEntryKeywords[i];
        if (!(keyword in keywords)) {
          let tempIdMap = keywordMap[keyword];
          tempIdMap = tempIdMap.filter(function(v){
            return (v != id);
          });
          keywordMap[keyword] = tempIdMap;
        }
      }
    }

    for (let i in keywords) {
      let keyword = keywords[i];
      if (!(keyword in storedEntryKeywords)) {
        if (keyword in keywordMap) {
          let entrypoints = keywordMap[keyword];
          entrypoints.push(id);
          keywordMap[keyword] = entrypoints;
        } else {
          keywordMap[keyword] = [id];
        }
      }
    }

    entryPointMap[id]=keywords;

    Messages.update({name: "keywords"}, {
      name: "keywords",
      keywordMap: keywordMap,
      entryPointMap: entryPointMap
    }, {upsert: true});

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