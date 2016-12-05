import React from 'react'
import {RIEInput, RIETextArea} from 'riek'
import {findDOMNode as getDOM}  from 'react-dom'

class Keyword extends React.Component {
  render() {
    return (
        <div className="ui modal keyword">
          <div className="header">Keywords</div>
          <div className="content">
            <div className="ui input">
              <input ref="keyword1" type="text" placeholder="Keyword 1"/>
            </div>
            <div className="ui input">
              <input ref="keyword2" type="text" placeholder="Keyword 2"/>
            </div>
            <div className="ui input">
              <input ref="keyword3" type="text" placeholder="Keyword 3"/>
            </div>
          </div>
          <div className="actions">
            <div className="ui green approve button" onClick={this.showData}>Save</div>
          </div>
        </div>
    )
  }

  showData() {
    console.log("showing data");
    console.log(this);
  }
}

export default Keyword