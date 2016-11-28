import React from 'react'
import uuid from 'uuid'
import {findDOMNode as getDOM}  from 'react-dom'

var CreateCardModal = React.createClass ({

    getInitialState: function() {
    var id = uuid.v1()
    var inputs = {
      inputs: []
    }
    return inputs;
  },
    addOption: function(){
      var new_id_number = this.state.length + 1
      var new_option_number = this.state.length + 1
      var id = uuid.v1()
      this.setState(this.state.inputs.inputs.concat([
              {id:new_id_number, name:new_option_number, uuid:{id}}
          ]))
  },
  render: function() {
    return (
        <div className="ui modal">
          <div className="header createcard"></div>
          <div className="content">
            <div className="ui input">
              <input ref="message" type="text" placeholder="Enter Title"/>
            </div>
            {
                    this.state.inputs.map((item) => (
                        <div className="ui input">
                          <input ref={item.id} type="text" key={item.uuid} placeholder={item.name}/>
                        </div>
                    ))
            }
            <div className="audio-card-upload">
            Upload Audio
             <div className="audio-upload">
              <input type="file" name="audio"></input>
             </div>
            </div>
            <div className="image-card-content">
             Upload Image
             <div className="image-upload">
              <input type="file" name="pic" accept="image/*"></input>
             </div>
             <div className="ui input">
              <textarea rows="4" cols="30" placeholder="Image Description"></textarea>
             </div>
            </div>
          </div>
           <div className="ui bottom attached button" onClick={this.addOption}>
            <i className="plus icon"/> Add Button
          </div>
          <div className="actions">
            <div className="ui green approve button" onClick={this.addCard}>Create</div>
            <div className="ui red cancel button">Cancel</div>
          </div>
        </div>
    );
  },
  addCard: function() {
    const id = uuid.v1()
    const message = getDOM(this.refs.message).value
    const button1Text = getDOM(this.refs.button1).value
    const button2Text = getDOM(this.refs.button2).value
    this.props.onAddCard({
      id,
      message,
      buttons: [{id: `${id}_button1`, text: button1Text}, {id: `${id}_button2`, text: button2Text}]
    })
  }
});

export default CreateCardModal