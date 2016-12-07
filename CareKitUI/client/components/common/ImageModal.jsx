import React from 'react'

class ImageModal extends React.Component {
  render() {
    return (
        <div className="ui modal image-modal">
          <div className="header">Set Landing Image</div>
          <div className="content">

            <div className="ui grid">
              <div className="nine wide column">
                <div className="ui form">
                  <div className="inline fields">
                    <div className="field">
                      <label>Image URL</label>
                      <input type="text"
                             value={this.props.landingImageUrl}
                             onChange={this.props.onEditLandingImageUrl}/>
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

export default ImageModal