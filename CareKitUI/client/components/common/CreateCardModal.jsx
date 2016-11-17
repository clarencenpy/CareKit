import React from 'react'
import uuid from 'uuid'
import {findDOMNode as getDOM}  from 'react-dom'

class CreateCardModal extends React.Component {
  render() {
    return (
        <div className="ui modal">
          <div className="header">Create Card</div>
          <div className="content">
            <div className="ui input">
              <input ref="message" type="text" placeholder="Enter Message..."/>
            </div>
            <div className="ui input">
              <input ref="button1" type="text" placeholder="Action 1"/>
            </div>
            <div className="ui input">
              <input ref="button2" type="text" placeholder="Action 2"/>
            </div>
          </div>
          <div className="actions">
            <div className="ui green approve button" onClick={this.addCard.bind(this)}>Create</div>
            <div className="ui red cancel button">Cancel</div>
          </div>
        </div>
    )
  }

  addCard() {
    const id = uuid.v1()
    const message = getDOM(this.refs.message).value
    const button1Text = getDOM(this.refs.button1).value
    const button2Text = getDOM(this.refs.button2).value
    this.props.onAddCard({
      id,
      message,
      buttons: [{id: `${id}_button1`, text: button1Text}, {id: `${id}_button2`, text: button2Text}]
    })
  }
}

export default CreateCardModal