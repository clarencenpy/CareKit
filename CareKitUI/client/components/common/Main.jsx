import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {findDOMNode as getDOM}  from 'react-dom'
import uuid from 'uuid'

import * as jp from './JSPlumbOptions'
import Card from './Card'
import CreateCardModal from './CreateCardModal'

export default class Main extends TrackerReact(React.Component) {

  constructor() {
    super()
    this.state = {
      cards: [{
        message: 'Card 1',
        id: 'card1',
        buttons: [{id: 'card1-1', text: 'Action 1', postback: 'card4'}, {id: 'card1-2', text: 'Action 2'}]
      }, {
        message: 'Card 2',
        id: 'card2',
        buttons: [{id: 'card2-1', text: 'Action 1', postback: 'card4'}, {id: 'card2-2', text: 'Action 2'}]
      }, {
        message: 'Card 3',
        id: 'card3',
        buttons: [{id: 'card3-1', text: 'Action 1'}, {id: 'card3-2', text: 'Action 2', postback: 'card4'}]
      }, {
        message: 'Card 4',
        id: 'card4',
        buttons: [{id: 'card4-1', text: 'Action 1'}, {id: 'card4-2', text: 'Action 2'}]
      }]
    }
  }

  addCard(data) {
    this.setState({
      cards: [...this.state.cards, data] //new array with the new card data added
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
        <div ref="container" className="jp-container">
          <CreateCardModal onAddCard={this.addCard.bind(this)}/>
          {
            this.state.cards.map((card) => (
                <Card data={card} key={card.id}/>
            ))
          }
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
      for (let card of this.state.cards) {
        if (params.sourceId.indexOf(card.id) >= 0) {
          let updated = false
          for (let button of card.buttons) {
            if (button.id === params.sourceId) {
              button.postback = params.targetId
              updated = true
              break;
            }
          }
          if (updated) break
        }
      }
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

    //instatiate all the endpoints
    for (let card of this.state.cards) {
      //make the card a target
      jpi.makeTarget(card.id, jp.ENDPOINT_TARGET)
      //add endpoint to each button
      for (let button of card.buttons) {
        jpi.addEndpoint(button.id, {uuid: button.id}, jp.ENDPOINT_SOURCE)
      }
    }

    //start connecting the endpoints based on established postbacks
    for (let card of this.state.cards) {
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
}