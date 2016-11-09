import React from 'react'
class NewCard extends React.Component {
  render() {
    return (
        <div className="ui modal">
  			<div className="header">Create Card</div>
  				<div className="content">
    				<div className="ui input"><input type="text" ref="xx" className="question_text" placeholder="Enter Question..."></input></div><br /><br />
    				<div className="ui input"><input type="text" className="option_1" placeholder="Option 1"></input></div><br /><br />
    				<div className="ui input"><input type="text" className="option_2" placeholder="Option 2"></input></div>
    			</div>
							<div className="actions">
							  <div className="ui green approve button" onClick={this.props.addCardCallback.bind(null, {
							  	description: '',
							  	id: '',
							  	button: [{id: '', text: ''}, {id: '', text: ''}]
							  })}>Create</div>
							  <div className="ui red cancel button">Cancel</div>
							</div>
			 </div>
    )
  }

}




export default NewCard