import React from 'react'
import {findDOMNode as getDOM}  from 'react-dom'

import Card from './Card'

export default class Main extends React.Component {
  render() {
    const buttons1 = [{id: '1-1', text: 'Action 1'}, {id: '1-2', text: 'Action 2'}]
    const buttons2 = [{id: '2-1', text: 'Action 1'}, {id: '2-2', text: 'Action 2'}]
    const buttons3 = [{id: '3-1', text: 'Action 1'}, {id: '3-2', text: 'Action 2'}]
    return (
        <div id="jp-container" className="jp-container">
          <Card ref="card1" header="Header" description="Hello this is pretty cool" buttons={buttons1}/>
          <Card ref="card2" header="Header" description="Hello this is pretty cool" buttons={buttons2}/>
          <Card ref="card3" header="Header" description="Hello this is pretty cool" buttons={buttons3}/>
        </div>
    )
  }

  componentDidMount() {
    const jsPlumbInstance = jsPlumb.getInstance({
      Container: 'jp-container'
    })
    jsPlumbInstance.connect({
      source: '1-1',
      target: getDOM(this.refs.card2),
      anchors: ['Right', 'Top'],
      endpoint: 'Dot'
    })
    jsPlumbInstance.connect({
      source: '2-1',
      target: getDOM(this.refs.card3),
      anchors: ['Right', 'Top'],
      endpoint: 'Dot'
    })
    jsPlumbInstance.draggable(
        $('.jp-draggable')
    )

  }
}