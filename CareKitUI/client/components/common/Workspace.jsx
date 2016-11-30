import React from 'react'
import Card from './Card'
import CreateCardModal from './CreateCardModal'
import ToolsPalette from './ToolsPalette'
import Dimmer from './Dimmer'


export default class Workspace extends React.Component {
  render() {
    return (
        <div ref="container" className="jp-container">
          <ToolsPalette onAddCard={this.props.onAddCard}/>
          {
            this.props.cards.map((card) => (
                <Card data={card.toJS()}
                      key={card.get('id')}
                      onEditButtonTitle={this.props.onEditButtonTitle}
                      onEditMessage={this.props.onEditMessage}
                      onAddButton={this.props.onAddButton}
                      onSelectType={this.props.onSelectType}
                      onDeleteButton={this.props.onDeleteButton}
                />
            ))
          }
          <Dimmer show={this.props.loading}/>
        </div>
    )
  }
}