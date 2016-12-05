import React from 'react'

class ToolsPalette extends React.Component {
  render() {
    return (
        <div className="ui vertical labeled icon menu toolsPalette">
          <a className="item" onClick={this.props.onAddCard}>
            <i className="file text outline icon"/>
            Text
          </a>
          <a className="item">
            <i className="file image outline icon"/>
            Image
          </a>
          <a className="item">
            <i className="file audio outline icon"/>
            Audio
          </a>
          <a className="item">
            <i className="file video outline icon"/>
            Video
          </a>
          <a className="item" onClick={this.addKeywords}>
            <i className="list layout icon"/>
            Keywords
          </a>
        </div>
    )
  }

  addKeywords() {
   $('.ui.modal.keyword').modal('show');
  }

}



export default ToolsPalette