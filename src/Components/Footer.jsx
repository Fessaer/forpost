import React, { Component } from 'react'
import '../styles/footer.css'
export class Footer extends Component {
  render() {
    return (
      <footer id="footer" className="footer bg-light">
        <div className="text-center p-3" style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
          © 2021 Copyright:
          <a className="text-dark" href="https://github.com/">Верзаков Дмитрий Анатольевич Github.ru</a>
        </div>
      </footer>
    )
  }
}
export default Footer;

