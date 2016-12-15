import React from 'react'

class Keyword extends React.Component {
  render() {
    return (
        <div className="ui modal keyword">
          <div className="header">Pathway Settings</div>
          <div className="content">
          <div className="ui form">
            <div className="inline fields">
              <div className="field">
                <label>Keywords</label>
                <div className="ui input">
                  <input ref="keyword1" type="text" placeholder="Keyword 1"
                          value = {this.props.keywords[0]}
                          onChange = {this.props.onKeywordsEdit.bind(null, 0)}/>
                </div>
                <div className="ui input">
                  <input ref="keyword2" type="text" placeholder="Keyword 2"
                          value = {this.props.keywords[1]}
                          onChange = {this.props.onKeywordsEdit.bind(null, 1)}/>
                </div>
                <div className="ui input">
                  <input ref="keyword3" type="text" placeholder="Keyword 3"
                          value = {this.props.keywords[2]}
                          onChange = {this.props.onKeywordsEdit.bind(null, 2)}/>
                </div>
              </div>
            </div>
          </div>

          <div className="ui grid">
            <div className="nine wide column">
              <div className="ui form">
                <div className="inline fields">
                  <div className="field">
                    <label>Image URL</label>
                    <div className="ui input image">
                    <input type="text"
                           value={this.props.landingImageUrl}
                           onChange={this.props.onEditLandingImageUrl}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="three wide column">
              <img className="image-preview" src={this.props.landingImageUrl}/>
            </div>
          </div>


          </div>
          <div className="actions">
            <div className="ui green approve button">Save</div>
          </div>
        </div>
    )
  }
}

export default Keyword