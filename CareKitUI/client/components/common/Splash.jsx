import React from 'react'

export default class Splash extends React.Component {
  render() {
    return (
        <div className="splash-container">
          <div className="hero-container">
            <div className="title">
              <span id="typed"/>
            </div>
            <img className="hero" src="logo.png"/>
            <br/>
            <a href="/new" className="ui button large basic inverted">
              <i className="sign in icon"/>
              Login with AndrewId
            </a>
          </div>
        </div>
    )
  }

  componentDidMount() {
    $('#typed').typed({
      contentType: 'html',
      strings: [
        'Hello.^1000<br>This is <strong class="highlight">CareKit</strong>^2000',
        'I help create <strong class="highlight">engaging</strong> chat experiences<br>between students and health services.^2000',
        'I <strong class="highlight">empower</strong> Health Professionals<br>to help others.^2000'
      ],
      backSpeed: 1,
      loop: true
    })
  }
}