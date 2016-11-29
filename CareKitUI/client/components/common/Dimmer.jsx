import React from 'react'
import {findDOMNode as getDOM}  from 'react-dom'

export default class Dimmer extends React.Component {
  render() {
    return (
        <div className="ui dimmer" ref="pageDimmer">
          <div className="content">
            <div className="center">
              <h2 className="ui inverted icon header">
                <i className="first aid icon"/>
                Loading...
              </h2>
            </div>
          </div>
        </div>
    )
  }

  componentDidMount() {
    let $dimmer = $(getDOM(this.refs.pageDimmer))
    if (this.props.show) {
      $dimmer.dimmer('show')
    } else {
      $dimmer.dimmer('hide')
    }
  }

  componentDidUpdate() {
    let $dimmer = $(getDOM(this.refs.pageDimmer))
    if (this.props.show) {
      $dimmer.dimmer('show')
    } else {
      $dimmer.dimmer('hide')
    }
  }
}