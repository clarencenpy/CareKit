import React from 'react'

class ToolsPalette extends React.Component {
  render() {
    return (
        <div className="ui vertical labeled icon menu">
          <a className="item" onClick={() => this.showCreateCardModal("Text")}>
            <i className="file text outline icon" />
            Text
          </a>
          <a className="item" onClick={() => this.showCreateCardModal("Image")}>
            <i className="file image outline icon"/>
            Image
          </a>
          <a className="item" onClick={() => this.showCreateCardModal("Audio")}>
            <i className="file audio outline icon" />
            Audio
          </a>
          <a className="item" onClick={() => this.showCreateCardModal("Video")}>
            <i className="file video outline icon" />
            Video
          </a>
          <a className="item" onClick={() => this.showCreateCardModal("List")}>
            <i className="list layout icon"/>
            List
          </a>
        </div>
    )
  }

  showCreateCardModal(type) {
    $('.header.createcard').text("Create Card: " + type);
    if(type!="Image"){
      $(".image-card-content").hide();
    }else{
      $(".image-card-content").show();
    }
    if(type!="Audio"){
      $(".audio-card-upload").hide();
    }else{
      $(".audio-card-upload").show();
    }
    $('.ui.modal').modal({
    inverted: true
  }).modal('show');
  }
}



export default ToolsPalette