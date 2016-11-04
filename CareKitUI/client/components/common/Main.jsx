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
    jsPlumbInstance.addEndpoint(getDOM(this.refs.card3), {...cardEP, uuid: 'card3'}, commonEP)

    jsPlumbInstance.makeTarget(getDOM(this.refs.card1), cardEP, commonEP)
    jsPlumbInstance.makeTarget(getDOM(this.refs.card2), cardEP, commonEP)
    jsPlumbInstance.makeTarget(getDOM(this.refs.card3), cardEP, commonEP)


    jsPlumbInstance.connect({
      source: jsPlumbInstance.getEndpoint('1-1'),
      target: jsPlumbInstance.getEndpoint('card3')
    })

    jsPlumbInstance.draggable(
        $('.jp-draggable')
    )

  }
}