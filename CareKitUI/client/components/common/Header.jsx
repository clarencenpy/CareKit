import React from 'react'
import {RIEInput} from 'riek'
import Blaze from 'meteor/gadicc:blaze-react-component'

class Header extends React.Component {
  render() {
    return (
        <div className="ui borderless massive top attached red inverted menu">
          <div className="ui dropdown icon item" ref="headerDropdown" onClick={this.props.onOpenRecent}>
            <i className="bars icon"/>
            <div className="menu">
              <div className="item">
                New Pathway
              </div>
              <div className="item">
                <i className="dropdown icon"/>
                <span className="text">Open Recent</span>
                <div className="menu">
                  {
                    this.props.fetchingSavedPathways ?
                        <div className="item"><i className="notched circle loading icon"/></div> :
                        this.props.savedPathways.length > 0 ?
                            this.props.savedPathways.map(p => (
                                <a className="item" key={p._id}
                                   onClick={this.gotoPathway.bind(null, p._id)}>{p.name}</a>
                            )) : <div className="item">No Recently Saved Pathways</div>

                  }
                </div>
              </div>
              <div className="item">
                Save
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
          <div className="item">
            Name: &nbsp;
            <RIEInput
                value={this.props.pathwayName}
                change={this.props.onEditPathwayName}
                propName="text"
                className="pathwayName"
                classEditing="inline-pathwayName-input"
            />
          </div>
          <div className="right menu">
            <a className="ui item" onClick={this.props.onSave}>
              {this.props.saving ? <i className="notched circle loading icon"/> : <i className="save icon"/>} Save
            </a>
            <a className="ui item" onClick={this.props.onDeploy}>
              <i className="cloud upload icon"/> Deploy
            </a>
            <a className="ui active item">
              <Blaze template="loginButtons"/>
            </a>
          </div>
        </div>
    )
  }

  componentDidMount() {
    //initialise dropdown
    $(this.refs.headerDropdown).dropdown()
  }

  componentDidUpdate() {
    $(this.refs.headerDropdown).dropdown('refresh')
  }

  gotoPathway(id) {
    FlowRouter.go(`/pathway/${id}`)
    location.reload()
  }

}

export default Header