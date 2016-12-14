import React from 'react'

class ToolsPalette extends React.Component {
  render() {
    return (
        <div className="ui vertical labeled icon menu toolsPalette">
          <div className="item"
               data-tooltip="Simple text message with buttons"
               data-position="right center"
               onClick={this.props.onAddCard.bind(null, 'button')}>
            <i className="file text outline icon"/>
            Text
          </div>
          <div className="item"
               data-tooltip="Message that can display an image"
               data-position="right center"
               onClick={this.props.onAddCard.bind(null, 'generic')}>
            <i className="file image outline icon"/>
            Image
          </div>
          <div className="item"
               data-tooltip="Send an audio file"
               data-position="right center">
            <i className="file audio outline icon"/>
            Audio
          </div>
          <div className="item"
               data-tooltip="Send a video file"
               data-position="right center">
            <i className="file video outline icon"/>
            Video
          </div>
          <div className="item"
               data-tooltip="Change settings for your pathway (Set keywords and landing image)"
               data-position="right center"
               onClick={this.addKeywords}>
            <i className="settings icon"/>
            Settings
          </div>

          {/*
          <div className="item"
               data-tooltip="Set the default landing image for your pathway"
               data-position="right center"
               onClick={this.openImageModal}>
            <i className="image icon"/>
            Set Image
          </div>
          */}

        </div>
    )
  }

  addKeywords() {
   $('.ui.modal.keyword').modal('show');
  }

  openImageModal() {
    $('.ui.modal.image-modal').modal('show')
  }

}



export default ToolsPalette