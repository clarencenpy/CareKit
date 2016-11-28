import React from 'react'

class Header extends React.Component {
  render() {
    return (
        <div className="ui borderless massive top attached red inverted menu">
          <div className="ui dropdown icon item" ref="headerDropdown">
            <i className="bars icon"/>
            <div className="menu">
              <div className="item">
                <i className="dropdown icon"/>
                <span className="text">New</span>
                <div className="menu">
                  <div className="item">Question Card</div>
                  <div className="item">Image</div>
                </div>
              </div>
              <div className="item">
                Open...
              </div>
              <div className="item">
                Save...
              </div>
              <div className="item">Edit Permissions</div>
              <div className="divider"></div>
              <div className="header">
                Export
              </div>
              <div className="item">
                Share...
              </div>
            </div>
          </div>
          <div className="header item" style={{
            letterSpacing: 2,
            textTransform: 'uppercase'
          }}>
            <i className="inverted first aid icon"/>
            CareKit
          </div>
          <div className="right menu">
            <a className="ui item" onClick={this.props.onSave}>
              {this.props.saving ? <i class="notched circle loading icon"/> : <i className="save icon"/>} Save
            </a>
            <a className="ui active item">
              <i className="cloud upload icon"/> Deploy
            </a>
          </div>
        </div>
    )
  }

  componentDidMount() {
    //initialise dropdown
    $(this.refs.headerDropdown).dropdown()
  }



}

export default Header