import React from 'react'
import {findDOMNode as getDOM}  from 'react-dom'
import uuid from 'uuid'
import Immutable from 'immutable'

import * as jp from './JSPlumbOptions'
import Header from './Header'
import Workspace from './Workspace'

const jsPlumbify = (component) => {
  let jpi = component.state.jsPlumbInstance
  jpi.reset()

  jpi.registerConnectionType('basic', jp.CONNECTION_STYLE)

  //instantiate all the endpoints
  let cards = component.state.cards.toJS()
  //use plain js from this point on, since no changes to state

  for (let card of cards) {
    //make the card a target
    jpi.makeTarget(card.id, jp.ENDPOINT_TARGET)
    //add endpoint to each button
    for (let button of card.buttons) {
      jpi.addEndpoint(button.id, {uuid: button.id}, jp.ENDPOINT_SOURCE)
    }
  }

  //start connecting the endpoints based on established postbacks
  for (let card of cards) {
    for (let button of card.buttons) {
      if (button.type === 'postback' && button.payload) {
        const uuidForEndpoint = uuid.v1()
        jpi.addEndpoint(button.payload, {uuid: uuidForEndpoint}, jp.ENDPOINT_TARGET)
        jpi.connect({uuids: [button.id, uuidForEndpoint], type: 'basic'})
      }
    }
  }

  //make all cards draggable
  jpi.draggable($('.jp-draggable'))

  jpi.bind('beforeDrop', (params) => {
    //add postback messageId to the card
    let cards = component.state.cards
    let cardIndex = cards.findIndex(card => params.sourceId.indexOf(card.get('id')) >= 0)
    let buttonIndex = cards.get(cardIndex).get('buttons').findIndex(button => button.get('id') === params.sourceId)
    component.setState({
      cards: cards.updateIn([
        cardIndex,
        'buttons',
        buttonIndex,
        'payload'
      ], () => params.targetId)
    })

    return true //permit the drop event to continue
  })

  jpi.bind('beforeDetach', (jp_connection) => {
    //hacky workaround for a bug that disregards target settings for
    //deleteEndpointOnDetach when the connections are drawn programatically
    let clone = {...jp_connection}
    setTimeout(() => { //setting timeout to allow connection to be deleted first
      //manually remove endpoint
      jpi.deleteEndpoint(clone.endpoints[1])
    }, 50)
    return true
  })


  jpi.repaintEverything()
}

export default class Main extends React.Component {

  constructor() {
    super()

    this.state = {
      cards: Immutable.List(),
      saving: false,
      deploying: false,
      loading: true,
      pathwayName: 'Untitled',
      landingImageUrl: '',
      fetchingSavedPathways: false,
      savedPathways: [],
      currentPathwayId: undefined
    }
  }

  render() {
    return (
        <div className="main-container">
          <Header
              onChangePathway={this.onChangePathway.bind(this)}
              onSave={this.onSave.bind(this)}
              onDeploy={this.onDeploy.bind(this)}
              saving={this.state.saving}
              deploying={this.state.deploying}
              pathwayName={this.state.pathwayName}
              onEditPathwayName={this.onEditPathwayName.bind(this)}
              savedPathways={this.state.savedPathways}
              fetchingSavedPathways={this.state.fetchingSavedPathways}
              onOpenRecent={this.onOpenRecent.bind(this)}
          />
          <Workspace
              loading={this.state.loading}
              pathwayId={this.state.currentPathwayId}
              landingImageUrl={this.state.landingImageUrl}
              onEditLandingImageUrl={this.onEditLandingImageUrl.bind(this)}
              cards={this.state.cards}
              onAddCard={this.onAddCard.bind(this)}
              onAddButton={this.onAddButton.bind(this)}
              onEditButtonTitle={this.onEditButtonTitle.bind(this)}
              onEditMessage={this.onEditMessage.bind(this)}
              onEditTitle={this.onEditTitle.bind(this)}
              onEditImageURL={this.onEditImageURL.bind(this)}
              imgHasLoaded={this.imgHasLoaded.bind(this)}
              onSelectType={this.onSelectType.bind(this)}
              onDeleteButton={this.onDeleteButton.bind(this)}
          />

        </div>
    )
  }

  componentDidMount() {

    //instantiate jsplumb and get instance
    this.state.jsPlumbInstance = jsPlumb.getInstance({
      Container: getDOM(this.refs.container)
    })

    //try to load project
    let pathwayId = FlowRouter.getParam('id')
    if (pathwayId) {
      Meteor.call('getPathway', pathwayId, (err, pathway) => {
        this.setState({
          cards: Immutable.fromJS(pathway.savedState.cards),
          pathwayName: pathway.savedState.pathwayName,
          landingImageUrl: pathway.savedState.landingImageUrl,
          currentPathwayId: pathway._id,
          loading: false
        }, () => {
          jsPlumbify(this)
        })
      })
    } else {
      this.setState({loading: false})
      jsPlumbify(this)
    }
  }

  onChangePathway(id, pathwayName) {
    this.setState({loading: true})
    let returned = false
    let minDurationPassed = false
    let p
    Meteor.call('getPathway', id, (err, pathway) => {
      p = pathway
      returned = true
      if (minDurationPassed) {
        this.setState({
          loading: false,
          currentPathwayId: id,
          pathwayName,
          landingImageUrl: pathway.savedState.landingImageUrl || '',
          cards: pathway ? Immutable.fromJS(pathway.savedState.cards) : Immutable.List()
        }, () => {
          jsPlumbify(this)
        })
      }
    })
    setTimeout(() => {
      minDurationPassed = true
      if (returned) this.setState({
        loading: false,
        currentPathwayId: id,
        pathwayName,
        landingImageUrl: p ? p.savedState.landingImageUrl || '' : '',
        cards: p ? Immutable.fromJS(p.savedState.cards) : Immutable.List()
      }, () => {
        jsPlumbify(this)
      })

    }, 1000)
  }

  onEditLandingImageUrl(e) {
    this.setState({landingImageUrl: e.target.value})
  }

  onAddCard(template_type) {
    let data = {
      id: uuid.v1(),
      template_type,
      message: '',
      buttons: []
    }
    if (template_type === 'generic') {
      data.image_url = ''
      data.title = ''
    }

    //place the card at the center of where the user has scrolled to
    data.left = $('.main-container').scrollLeft() + 400
    data.top = $('body').scrollTop() + 300

    this.setState({
      cards: this.state.cards.push(Immutable.fromJS(data))
    }, () => {
      //after the card has been updated by react..
      //jsplumb does its work
      const jpi = this.state.jsPlumbInstance //get the instance saved in state object
      jpi.draggable($(`#${data.id}`))
      //make the card a target
      jpi.makeTarget(data.id, jp.ENDPOINT_TARGET)
      //add endpoint to each button
      data.buttons.forEach(button => {
        jpi.addEndpoint(button.id, {uuid: button.id}, jp.ENDPOINT_SOURCE)
      })
    })
  }

  onEditPathwayName(data) {
    this.setState({pathwayName: data.text})
  }

  onOpenRecent() {
    this.setState({fetchingSavedPathways: true})
    Meteor.call('getSavedPathways', (err, savedPathways) => {
      this.setState({
        fetchingSavedPathways: false,
        savedPathways
      })
    })
  }

  onSave() {
    this.setState({saving: true})
    let cards = this.state.cards.toJS()
    cards = cards.map(card => {
      //append the position of every card
      let elem = $(`#${card.id}`)
      card.top = elem.css('top')
      card.left = elem.css('left')
      return card
    })

    // grabbing keywords
    const inputs = $(".ui.modal.keyword .ui.input input");
    const keywords = [];
    let count = 0;
    while (count < 3) {
      let currentKeyword = $(inputs[count]).val();
      keywords.push(currentKeyword);
      count += 1;
    }

    let id = this.state.currentPathwayId || Random.id()
    let returned = false
    let minDurationPassed = false
    Meteor.call('save', {
      cards,
      id,
      keywords,
      pathwayName: this.state.pathwayName,
      landingImageUrl: this.state.landingImageUrl
    }, () => {
      returned = true
      if (minDurationPassed) this.setState({deploying: false})
    })
    setTimeout(() => {
      minDurationPassed = true
      if (returned) this.setState({saving: false, currentPathwayId: id})

    }, 1000)
  }

  onDeploy() {
    this.setState({deploying: true})
    let returned = false
    let minDurationPassed = false
    
    // grabbing keywords
    const inputs = $(".ui.modal.keyword .ui.input input");
    const keywords = [];
    let count = 0;
    while (count < 3) {
      let currentKeyword = $(inputs[count]).val();
      keywords.push(currentKeyword);
      count += 1;
    }

    Meteor.call('deploy', {
      cards: this.state.cards.toJS(),
      pathwayName: this.state.pathwayName,
      landingImageUrl: this.state.landingImageUrl,
      id: this.state.currentPathwayId,
      keywords
    }, () => {
      returned = true
      if (minDurationPassed) this.setState({deploying: false})
    })
    setTimeout(() => {
      minDurationPassed = true
      if (returned) this.setState({deploying: false})
    }, 1000)
  }

  onEditMessage(id, data) {
    let cardIndex = this.state.cards.findIndex(card => id === card.get('id'))
    this.setState({cards: this.state.cards.updateIn([cardIndex, 'message'], () => data.message)}, () => {
      //since the card may now have been resized
      this.state.jsPlumbInstance.recalculateOffsets(id)
      this.state.jsPlumbInstance.repaint(id)
    })
  }

  onEditTitle(id, data) {
    let cardIndex = this.state.cards.findIndex(card => id === card.get('id'))
    this.setState({cards: this.state.cards.updateIn([cardIndex, 'title'], () => data.title)})
  }

  onEditImageURL(id, data) {
    let cardIndex = this.state.cards.findIndex(card => id === card.get('id'))
    this.setState({cards: this.state.cards.updateIn([cardIndex, 'image_url'], () => data.image_url)}, () => {
      //since the card may now have been resized
      this.state.jsPlumbInstance.recalculateOffsets(id)
      this.state.jsPlumbInstance.repaint(id)
    })
  }

  imgHasLoaded(id) {
    //since the card may now have been resized
    this.state.jsPlumbInstance.recalculateOffsets(id)
    this.state.jsPlumbInstance.repaint(id)
  }

  onAddButton(id) {
    let cardIndex = this.state.cards.findIndex(card => id.indexOf(card.get('id')) >= 0)
    let buttonId = `${id}_button${this.state.cards.get(cardIndex).get('buttons').size + 1}`
    this.setState({
      cards: this.state.cards.updateIn([cardIndex, 'buttons'], buttons => {
        return buttons.push(Immutable.Map({
          id: buttonId,
          title: `Action ${buttons.size + 1}`,
          type: 'postback'
        }))
      })
    }, () => {
      //jsPlumb to add endpoints
      const jpi = this.state.jsPlumbInstance //get the instance saved in state object
      jpi.addEndpoint(buttonId, {uuid: buttonId}, jp.ENDPOINT_SOURCE)
    })
  }

  onEditButtonTitle(id, data) {
    //where id is the id of the button so I can locate it
    //and data is the callback value from riek
    let cardIndex = this.state.cards.findIndex(card => id.indexOf(card.get('id')) >= 0)
    let buttonIndex = this.state.cards.get(cardIndex).get('buttons').findIndex(button => button.get('id') === id)

    this.setState({
      cards: this.state.cards.updateIn([cardIndex, 'buttons', buttonIndex, 'title'], () => data.text)
    })
  }

  onSelectType(id, type, data) {
    let cardIndex = this.state.cards.findIndex(card => id.indexOf(card.get('id')) >= 0)
    let buttonIndex = this.state.cards.get(cardIndex).get('buttons').findIndex(button => button.get('id') === id)
    let button = this.state.cards.get(cardIndex).get('buttons').get(buttonIndex).toJS()
    switch (type) {
      case 'message':
        this.setState({
          cards: this.state.cards.updateIn([cardIndex, 'buttons', buttonIndex], () => {
            return Immutable.fromJS({
              id: button.id,
              title: button.title,
              type: 'postback'
            })
          })
        })
        break

      case 'url':
        this.setState({
          cards: this.state.cards.updateIn([cardIndex, 'buttons', buttonIndex], () => {
            return Immutable.fromJS({
              id: button.id,
              title: button.title,
              type: 'web_url',
              payload: data //to change to web_url
            })
          })
        })
        break

      case 'call':
        this.setState({
          cards: this.state.cards.updateIn([cardIndex, 'buttons', buttonIndex], () => {
            return Immutable.fromJS({
              id: button.id,
              title: button.title,
              type: 'phone_number',
              payload: data
            })
          })
        })
        break
    }
  }

  onDeleteButton(id) {
    let cardIndex = this.state.cards.findIndex(card => id.indexOf(card.get('id')) >= 0)
    let buttonIndex = this.state.cards.get(cardIndex).get('buttons').findIndex(button => button.get('id') === id)
    let jpi = this.state.jsPlumbInstance
    this.setState({
      cards: this.state.cards.updateIn([cardIndex, 'buttons'], buttons => {
        return buttons.filter(b => {
          return b.get('id') !== id
        })
      })
    }, () => {
      let cardId = id.substring(0, id.indexOf('_'))
      jpi.recalculateOffsets(cardId)
      jpi.repaint(cardId)
    })
    jpi.deleteEndpoint(id)

  }
}