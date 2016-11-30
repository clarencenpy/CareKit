import React from 'react'
import Card from './Card'
import CreateCardModal from './CreateCardModal'
import ToolsPalette from './ToolsPalette'
import Dimmer from './Dimmer'


export default class Workspace extends React.Component {
  render() {
    return (
        <div ref="container" className="jp-container">
          <div style={{position: 'fixed', left: 30, top: 90}}><ToolsPalette/></div>
          <CreateCardModal onAddCard={this.props.addCard}/>
          {
            this.props.cards.map((card) => (
                <Card data={card.toJS()}
                      key={card.get('id')}
                      onEditButton={this.props.onEditButton}
                      onEditMessage={this.props.onEditMessage}
                      addButton={this.props.addButton}
                />
            ))
          }
          <Dimmer show={this.props.loading}/>
        </div>
    )
  }
}