import React from 'react'

class ToolsPalette extends React.Component {
  render() {
    return (
        <div className="ui vertical labeled icon menu">
          <a className="item" onClick={this.showCreateCardModal}>
            <i className="file text outline icon" />
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
          <a className="item">
            <i className="list layout icon"/>
            List
          </a>
        </div>
    )
  }

  showCreateCardModal() {
    $('.ui.modal').modal('show');
  }
}



export default ToolsPalette