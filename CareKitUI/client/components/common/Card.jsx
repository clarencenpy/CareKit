import React from 'react'
import {RIEInput, RIETextArea} from 'riek'

const Button = (props) => (
    <div id={props.id} className="content center aligned card-button-override">
      <i className={props.icon}/>
      <RIEInput
          value={props.text.length > 0 ? props.text : 'Action Name...'}
          change={props.onEdit.bind(null, props.id)}
          propName="text"
          classEditing="inline-button-input"
      />
    </div>
)

class Card extends React.Component {
  render() {
    return (
        <div id={this.props.data.id} className="ui card jp-draggable">
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
                    <Button {...b} key={b.id} onEdit={this.props.onEditButton}/>
                )) : null
          }
          <div className="ui bottom attached button">
            <i className="plus icon"/> Add Button
          </div>

        </div>
    )
  }
}

export default Card