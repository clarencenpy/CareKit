import React from 'react'

const Button = (props) => (
    <div id={props.id} className="ui bottom attached button">
      <i className={props.icon}/>
      {props.text}
    </div>
)


class Card extends React.Component {
  render() {
    return (
        <div className="ui card jp-draggable">
          <div className="content">
            <div className="header">{this.props.header}</div>
            <div className="description">
              {this.props.description}
            </div>
          </div>
          {
            this.props.buttons && this.props.buttons.length > 0 ?
                this.props.buttons.map((b) => (
                    <Button {...b} key={b.id}/>
                )) : null
          }

        </div>
    )
  }
}

export default Card