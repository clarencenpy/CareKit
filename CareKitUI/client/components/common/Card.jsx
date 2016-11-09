import React from 'react'

const Button = (props) => (
    <div id={props.id} className="ui bottom attached button">
      <i className="add icon"/>
      {props.text}
    </div>
)

class Card extends React.Component {
  render() {
    return (
        <div id={this.props.data.id} className="ui card jp-draggable">
          <div className="content">
            <div className="description">
              {this.props.data.description}
            </div>
          </div>
          {
            this.props.data.buttons && this.props.data.buttons.length > 0 ?
                this.props.data.buttons.map((b) => (
                    <Button {...b} key={b.id}/>
                )) : null
          }
        </div>
    )
  }
}

export default Card