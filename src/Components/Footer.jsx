import React, { Component } from 'react'

export class Footer extends Component {
  render() {
    return (
      <footer id="footer" className="footer  border-top border-primary bg-light">
        <div className="text-center p-3" style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
          © 2021 Copyright:
          <a className="text-dark" href="https://github.com/Fessaer/forpost">Верзаков Дмитрий Анатольевич Github.ru</a>
        </div>
      </footer>
    )
  }
}
export default Footer;

