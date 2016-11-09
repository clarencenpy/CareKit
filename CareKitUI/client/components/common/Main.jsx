import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {findDOMNode as getDOM}  from 'react-dom'

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
        buttons: [{id: '1-1', text: 'Action 1'}, {id: '1-2', text: 'Action 2'}]
      }, {
        message: 'Card 2',
        id: 'card2',
        buttons: [{id: '2-1', text: 'Action 1'}, {id: '2-2', text: 'Action 2'}]
      }, {
        message: 'Card 3',
        id: 'card3',
        buttons: [{id: '3-1', text: 'Action 1'}, {id: '3-2', text: 'Action 2'}]
      }, {
        message: 'Card 4',
        id: 'card4',
        buttons: [{id: '4-1', text: 'Action 1'}, {id: '4-2', text: 'Action 2'}]
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
      console.log(params) //this is where listeners can respond to drop events
      return true
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
    this.state.cards.forEach(card => {
      //make the card a target
      jpi.makeTarget(card.id, jp.ENDPOINT_TARGET)
      //add endpoint to each button
      card.buttons.forEach(button => {
        jpi.addEndpoint(button.id, {uuid: button.id}, jp.ENDPOINT_SOURCE)
      })
    })

    // jpi.connect({
    //   source: '1-1',
    //   target: 'card3'
    // })

    //make all cards draggable
    jpi.draggable(
        $('.jp-draggable')
    )

  }
}