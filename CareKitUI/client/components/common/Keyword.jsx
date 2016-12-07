import React from 'react'

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
            <div className="ui green approve button">Save</div>
          </div>
        </div>
    )
  }
}

export default Keyword