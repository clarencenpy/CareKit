import React from 'react'
import {RIEInput, RIETextArea} from 'riek'
import {findDOMNode as getDOM}  from 'react-dom'

class Popup extends React.Component {
  render() {
    return (
        <div className="ui flowing popup">
          <h4 className="ui content header" style={{paddingBottom: 5, borderBottom: '1px solid rgb(212,212,212)'}}>
            Edit Button Settings
            <i className="trash icon red link"
               style={{position: 'relative', left: 100, top: -5}}
               onClick={this.props.onDeleteButton}
            />
          </h4>
          <div className="ui three column divided center aligned grid">
            <div className="column">
              <h5 className="ui header">Message Link</h5>
              <div className="spacer" style={{height: 35}}></div>
              <br/>
              {
                this.props.type === 'postback' ?
                    <div className="ui small basic button green">Selected</div> :
                    <div className="ui small basic button" onClick={this.props.onSelectType.bind(null, 'message')}>
                      Select</div>
              }
            </div>
            <div className="column">
              <h5 className="ui header">Web Link</h5>
              <div className="ui small form">
                <div className="field">
                  <input ref="urlInput" type="text" placeholder="Web URL"
                         defaultValue={this.props.type === 'web_url' ? this.props.payload : ''}/>
                </div>
              </div>
              <br/>
              {
                this.props.type === 'web_url' ?
                    <div className="ui small basic button green">Selected</div> :
                    <div className="ui small basic button" onClick={this.onSelectType_URL.bind(this)}>Select</div>
              }
            </div>
            <div className="column">
              <h5 className="ui header">Call Button</h5>
              <div className="ui small form">
                <div className="field">
                  <input ref="phoneInput" type="text" placeholder="Phone No."
                         defaultValue={this.props.type === 'phone_number' ? this.props.payload : ''}/>
                </div>
              </div>
              <br/>
              {
                this.props.type === 'phone_number' ?
                    <div className="ui small basic button green">Selected</div> :
                    <div className="ui small basic button" onClick={this.onSelectType_Call.bind(this)}>Select</div>
              }
            </div>
          </div>
        </div>
    )
  }

  onSelectType_URL() {
    //grab the url and bind it to the returning function
    let url = getDOM(this.refs.urlInput).value
    this.props.onSelectType.bind(null, 'url', url)()
  }

  onSelectType_Call() {
    //grab the phone no and bind it to the returning function
    let phone = getDOM(this.refs.phoneInput).value
    this.props.onSelectType.bind(null, 'call', phone)()
  }
}

class Button extends React.Component {
  render() {
    return (
        <div id={this.props.id} className="content center aligned card-button-override">
          <i className="ellipsis horizontal icon left floated" ref={'settingBtn_' + this.props.id}/>
          <Popup
              onSelectType={this.props.onSelectType.bind(null, this.props.id)}
              onDeleteButton={this.props.onDeleteButton.bind(null, this.props.id)}
              type={this.props.type}
              payload={this.props.payload}
          />
          <RIEInput
              value={this.props.title.length > 0 ? this.props.title : 'Action Name...'}
              change={this.props.onEditButtonTitle.bind(null, this.props.id)}
              propName="text"
              classEditing="inline-button-input"
          />
        </div>
    )
  }

  componentDidMount() {
    $(getDOM(this.refs['settingBtn_' + this.props.id])).popup({
      boundary: '.jp-container',
      on: 'click',
      position: 'bottom center',
    })
  }
}

class Card extends React.Component {
  render() {
    return (
        <div id={this.props.data.id} className="ui card jp-draggable"
             style={{left: this.props.data.left, top: this.props.data.top}}>
          <div className="content">
            <div className="description">
              <RIETextArea
                  value={this.props.data.message.length > 0 ? this.props.data.message : 'Enter Message...'}
                  change={this.props.onEditMessage.bind(null, this.props.data.id)}
                  propName="message"
                  classEditing="inline-textarea-input"
                  rows={5}
              />
            </div>
          </div>
          {
            this.props.data.buttons && this.props.data.buttons.length > 0 ?
                this.props.data.buttons.map((b) => (
                    <Button {...b} key={b.uuid} onEdit={this.props.onEditButton}/>
                )) : null
          }
          <div className="ui bottom attached button" onClick={this.props.onAddButton.bind(null, this.props.data.id)}>
            <i className="plus icon"/> Add Button
          </div>

        </div>
    )
  }
}

export default Card