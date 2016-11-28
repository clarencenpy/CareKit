import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {findDOMNode as getDOM}  from 'react-dom'
import uuid from 'uuid'
import Immutable from 'immutable'

import * as jp from './JSPlumbOptions'
import Header from './Header'
import Card from './Card'
import CreateCardModal from './CreateCardModal'
import ToolsPalette from './ToolsPalette'

export default class Main extends React.Component {

  constructor() {
    super()
    this.state = {
      cards: Immutable.List(),
      saving: false,
      pathwayName: 'Untitled',
      fetchingSavedPathways: false,
      savedPathways: []
    }
  }

  addCard(data) {
    data.left = 150 //default positions to place the card
    data.top = 30
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

  render() {
    return (
        <div>
          <Header onSave={this.onSave.bind(this)}
                  saving={this.state.saving}
                  pathwayName={this.state.pathwayName}
                  onEditPathwayName={this.onEditPathwayName.bind(this)}
                  savedPathways={this.state.savedPathways}
                  fetchingSavedPathways={this.state.fetchingSavedPathways}
                  onOpenRecent={this.onOpenRecent.bind(this)}
          />
          <div ref="container" className="jp-container">
            <div style={{position: 'fixed', left: 30, top: 80}}><ToolsPalette/></div>
            <CreateCardModal onAddCard={this.addCard.bind(this)}/>
            {
              this.state.cards.map((card) => (
                  <Card data={card.toJS()}
                        key={card.get('id')}
                        onEditButton={this.onEditButton.bind(this)}
                        onEditMessage={this.onEditMessage.bind(this)}
                        addButton={this.addButton.bind(this)}
                  />
              ))
            }
          </div>
        </div>
    )
  }

  componentDidMount() {
    this.state.jsPlumbInstance = jsPlumb.getInstance({
      Container: getDOM(this.refs.container)
    })

    const jpi = this.state.jsPlumbInstance

    jpi.bind('beforeDrop', (params) => {
      //add postback messageId to the card
      let cards = this.state.cards
      let cardIndex = cards.findIndex(card => params.sourceId.indexOf(card.get('id')) >= 0)
      let buttonIndex = cards.get(cardIndex).get('buttons').findIndex(button => button.get('id') === params.sourceId)
      this.setState({
        cards: cards.updateIn([
          cardIndex,
          'buttons',
          buttonIndex,
          'postback'
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

    //instantiate all the endpoints
    let cards = this.state.cards.toJS()
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
        if (button.postback) {
          const uuidForEndpoint = uuid.v1()
          jpi.addEndpoint(button.postback, {uuid: uuidForEndpoint}, jp.ENDPOINT_TARGET)
          jpi.connect({uuids: [button.id, uuidForEndpoint]})
        }
      }
    }

    //make all cards draggable
    jpi.draggable($('.jp-draggable'))

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
    Meteor.call('deploy', {cards: this.state.cards.toJS(), pathwayName: this.state.pathwayName}, (err) => {
      if (err) console.log(err)
      this.setState({saving: false})
    })
  }

  onEditButton(id, data) {
    //where id is the id of the button so I can locate it
    //and data is the callback value from riek
    let cardIndex = this.state.cards.findIndex(card => id.indexOf(card.get('id')) >= 0)
    let buttonIndex = this.state.cards.get(cardIndex).get('buttons').findIndex(button => button.get('id') === id)

    this.setState({
      cards: this.state.cards.updateIn([cardIndex, 'buttons', buttonIndex, 'text'], () => data.text)
    })
  }

  onEditMessage(id, data) {
    let cardIndex = this.state.cards.findIndex(card => id.indexOf(card.get('id')) >= 0)
    this.setState({cards: this.state.cards.updateIn([cardIndex, 'message'], () => data.message)}, () => {
      //since the card may now have been resized
      this.state.jsPlumbInstance.getDragManager().updateOffsets(id)
      this.state.jsPlumbInstance.repaint(id)
    })
  }

  addButton(id) {
    let cardIndex = this.state.cards.findIndex(card => id.indexOf(card.get('id')) >= 0)
    let buttonId = `${id}_button${this.state.cards.get(cardIndex).get('buttons').size + 1}`
    this.setState({
      cards: this.state.cards.updateIn([cardIndex, 'buttons'], buttons => {
        return buttons.push(Immutable.Map({
          id: buttonId,
          text: `Action ${buttons.size + 1}`
        }))
      })
    }, () => {
      //jsPlumb to add endpoints
      const jpi = this.state.jsPlumbInstance //get the instance saved in state object
      jpi.addEndpoint(buttonId, {uuid: buttonId}, jp.ENDPOINT_SOURCE)
    })
  }
}