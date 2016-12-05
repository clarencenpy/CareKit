import React from 'react'
import uuid from 'uuid'
import {findDOMNode as getDOM}  from 'react-dom'

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
          {/*
          <a className="item">
            <i className="list layout icon"/>
            List
          </a>
          */}
          <a className="item" onClick={this.addKeywords}>
            <i className="list layout icon"/>
            Keywords
          </a>
        </div>
    )
  }

  showCreateCardModal() {
    console.log("show create card modal");
    $('.ui.modal.newCard').modal('show');
  }

  addKeywords() {
    console.log("this is adding keyword");
   $('.ui.modal.keyword').modal('show');
  }

}



export default ToolsPalette