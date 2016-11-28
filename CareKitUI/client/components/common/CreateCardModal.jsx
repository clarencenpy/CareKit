import React from 'react'
import uuid from 'uuid'
import {findDOMNode as getDOM}  from 'react-dom'

var CreateCardModal = React.createClass ({

    getInitialState: function() {
    var inputs = {
      inputs: []
    }
    return inputs;
  },
    addOption: function(){
      var new_id_number = this.state.inputs.length + 1;
      var new_option_number = this.state.inputs.length + 1;
      var id = uuid.v1();
      console.log(this.state);
      var new_input = this.state.inputs.push([{
        id_num:new_id_number, name:new_option_number, uuid:{id}
      }]);
      this.setState({new_input});
      var newArray = this.state.inputs.map(function(obj){
        console.log(obj[0].uuid.id);
      });
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
                         {/*<a className={item[0]["id_num"]} onClick={() => this.linkify(item[0]["id_num"])}>
                          <i className="green large link linkify icon"/>
                         </a>*/}
                          <input className={item[0]["id_num"]} type="text" key={item[0]["uuid"]["id"]} placeholder={"Option " + item[0].name}/>
                          <a className={item[0]["id_num"]} onClick={() => this.removeInput(item[0]["id_num"])}>
                            <i className="red big link remove circle icon"/>
                          </a>
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
            <div className="ui red cancel button" onClick={this.cancel}>Cancel</div>
          </div>
        </div>
    );
  },
  linkify: function(index){

  },
  removeInput: function(index){
    this.setState({
      inputs: this.state.inputs.filter((_, i) => i !== index-1)
  });
    console.log(this.state.inputs);
  },
  cancel: function(){
    this.setState(this.getInitialState);
  },
  addCard: function() {
    this.setState(this.getInitialState);
    const id = uuid.v1()
    const message = getDOM(this.refs.message).value

    var input_id = 0;
    var buttons = [];
    $(".ui.input :input").each(function() {
      var text = $(this).text();
      var id = input_id;
      input_id = input_id + 1;
      var button = {id:id, text:text};
      buttons.push(button);
    });

    this.props.onAddCard({
      id,
      message,
      buttons: buttons
    })
  }
});

export default CreateCardModal