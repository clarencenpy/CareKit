import React from 'react'
import {findDOMNode as getDOM}  from 'react-dom'

import Card from './Card'

export default class Main extends React.Component {
  render() {
    const buttons1 = [{id: '1-1', text: 'Action 1'}, {id: '1-2', text: 'Action 2'}]
    const buttons2 = [{id: '2-1', text: 'Action 1'}, {id: '2-2', text: 'Action 2'}]
    const buttons3 = [{id: '3-1', text: 'Action 1'}, {id: '3-2', text: 'Action 2'}]
    return (
        <div ref="container" className="jp-container">
          <Card ref="card1" header="Header" description="Hello this is pretty cool" buttons={buttons1}/>
          <Card ref="card2" header="Header" description="Hello this is pretty cool" buttons={buttons2}/>
          <Card ref="card3" header="Header" description="Hello this is pretty cool" buttons={buttons3}/>
        </div>
    )
  }

  componentDidMount() {
    const jsPlumbInstance = jsPlumb.getInstance({
      Container: getDOM(this.refs.container)
    })
    const common = {
      detachable: true
    }
    const commonEP = {
      endpoint: 'Dot',
      connector: ['Flowchart', {cornerRadius: 10}],
    }
    const actionEP = {
      isSource: true,
      isTarget: false,
      anchor: 'Right'
    }
    const cardEP = {
      isSource: false,
      isTarget: true,
      anchor: 'Continuous'
    }
    jsPlumbInstance.addEndpoint('1-1', commonEP, actionEP)
    jsPlumbInstance.addEndpoint('1-2', commonEP, actionEP)
    jsPlumbInstance.addEndpoint('2-2', commonEP, actionEP)
    jsPlumbInstance.addEndpoint('2-1', commonEP, actionEP)
    jsPlumbInstance.addEndpoint('3-1', commonEP, actionEP)
    jsPlumbInstance.addEndpoint('3-2', commonEP, actionEP)
    jsPlumbInstance.addEndpoint(getDOM(this.refs.card1), commonEP, cardEP)
    jsPlumbInstance.addEndpoint(getDOM(this.refs.card2), commonEP, cardEP)
    jsPlumbInstance.addEndpoint(getDOM(this.refs.card3), commonEP, cardEP)


    jsPlumbInstance.draggable(
        $('.jp-draggable')
    )

  }
}