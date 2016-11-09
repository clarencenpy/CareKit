import React from 'react'
import {findDOMNode as getDOM}  from 'react-dom'

import Card from './Card'

export default class Main extends React.Component {

  constructor() {
    super()
    this.state = {
      cards: [{
        description: 'Card 1',
        id: 'card1',
        buttons: [{id: '1-1', text: 'Action 1'}, {id: '1-2', text: 'Action 2'}]
      }, {
        description: 'Card 2',
        id: 'card2',
        buttons: [{id: '2-1', text: 'Action 1'}, {id: '2-2', text: 'Action 2'}]
      }, {
        description: 'Card 3',
        id: 'card3',
        buttons: [{id: '3-1', text: 'Action 1'}, {id: '3-2', text: 'Action 2'}]
      }, {
        description: 'Card 4',
        id: 'card4',
        buttons: [{id: '4-1', text: 'Action 1'}, {id: '4-2', text: 'Action 2'}]
      }]
    }
  }

  addCard(data) {
    let newCards = this.state.cards
    newState.push(data)
    this.setState({
      cards: newCards
    })
  }

  render() {
    return (
        <div ref="container" className="jp-container">
          {
            this.state.cards.map((card) => (
                <Card data={card} key={card.id}/>
            ))
          }
        </div>
    )
  }

  componentDidMount() {
    const jsPlumbInstance = jsPlumb.getInstance({
      Container: getDOM(this.refs.container)
    })
    jsPlumbInstance.bind('beforeDrop', (params) => {
      console.log(params) //this is where listeners can respond to drop events
      return true
    })
    jsPlumbInstance.bind('beforeDetach', (jp_connection) => {
      //hacky workaround for a bug that disregards target settings for
      //deleteEndpointOnDetach when the connections are drawn programatically
      let clone = {...jp_connection}
      setTimeout(() => { //setting timeout to allow connection to be deleted first
        //manually remove endpoint
        jsPlumbInstance.deleteEndpoint(clone.endpoints[1])
      }, 50)
      return true
    })

    const commonEP = {
      connector: ['Flowchart', {cornerRadius: 10}],
    }
    const actionEP = {
      isSource: true,
      isTarget: false,
      anchor: 'Right',
      endpoint: 'Rectangle',
      deleteEndpointsOnDetach: false
    }
    const cardEP = {
      isSource: false,
      isTarget: true,
      anchor: 'Continuous',
      endpoint: 'Dot',
      deleteEndpointsOnDetach: true
    }
    jsPlumbInstance.addEndpoint('1-1', {...actionEP, uuid: '1-1'}, commonEP)
    jsPlumbInstance.addEndpoint('1-2', actionEP, commonEP)
    jsPlumbInstance.addEndpoint('2-2', actionEP, commonEP)
    jsPlumbInstance.addEndpoint('2-1', actionEP, commonEP)
    jsPlumbInstance.addEndpoint('3-1', actionEP, commonEP)
    jsPlumbInstance.addEndpoint('3-2', actionEP, commonEP)
    jsPlumbInstance.addEndpoint('card3', {...cardEP, uuid: 'card3'}, commonEP)

    jsPlumbInstance.makeTarget('card1', cardEP, commonEP)
    jsPlumbInstance.makeTarget('card2', cardEP, commonEP)
    jsPlumbInstance.makeTarget('card3', cardEP, commonEP)


    jsPlumbInstance.connect({
      source: jsPlumbInstance.getEndpoint('1-1'),
      target: jsPlumbInstance.getEndpoint('card3')
    })

    jsPlumbInstance.draggable(
        $('.jp-draggable')
    )

  }
}