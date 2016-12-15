import React from 'react'
import Card from './Card'
import ToolsPalette from './ToolsPalette'
import Keyword from './Keyword'
import ImageModal from './ImageModal'
import Dimmer from './Dimmer'


export default class Workspace extends React.Component {
  render() {
    return (
        <div ref="container" className="jp-container">

          <ToolsPalette onAddCard={this.props.onAddCard}/>
          <Keyword keywords={this.props.keywords}
                   onKeywordsEdit={this.props.onKeywordsEdit}
                   landingImageUrl={this.props.landingImageUrl}
                   onEditLandingImageUrl={this.props.onEditLandingImageUrl}/>

                   
          <ImageModal landingImageUrl={this.props.landingImageUrl}
                      onEditLandingImageUrl={this.props.onEditLandingImageUrl}/>

          {
            this.props.cards.map((card) => (
                <Card data={card.toJS()}
                      key={card.get('id')}
                      onEditButtonTitle={this.props.onEditButtonTitle}
                      onEditMessage={this.props.onEditMessage}
                      onEditTitle={this.props.onEditTitle}
                      onEditImageURL={this.props.onEditImageURL}
                      imgHasLoaded={this.props.imgHasLoaded}
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