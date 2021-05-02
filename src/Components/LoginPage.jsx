import React, { useContext, useState} from 'react';
import { Context } from './Store'

const LoginPage = () => {
  const [state, setState] = useState({});
  const [inState, inSetState] = useContext(Context);
  

  const handleClick = async(e) => {
    e.preventDefault()
    let urle = 'https://va.fpst.ru/api/login';
    
    const form = document.querySelector('form');
    await fetch(urle, {
      method: 'POST',
      body: new FormData(form)

      
    }).then(function(response) {
      return response.text();
    }).then(function(data) {
      console.log(data);
      const {SessionID, ChangePasswordAtNextLogin} = JSON.parse(data);
      return { SessionID, ChangePasswordAtNextLogin}
    }).then((dataSession) => {
      const {SessionID, ChangePasswordAtNextLogin} = dataSession
    if (dataSession.SessionID !== false || dataSession.SessionID !== undefined) {
      const validation = true
      inSetState({...inState, validation, SessionID, ChangePasswordAtNextLogin})
    }
  })
  }

  const handleLogin = (e) => {
    const login = e.target.value
    setState({...state, login})
  }

  const handlePassword = (e) => {
    const password = e.target.value
    setState({...state, password})
  }
  const handleForm = (e) => {
    console.log(e.target.value)
  }

return (
  
  <div style={{margin: "10% 0px"}} id="form" className="container-fluid d-flex h-100 justify-content-center align-items-center p-0">
    <div className="row bg-white shadow-sm">
      <div className="col border rounded p-4">
        <h3 className="text-center mb-4">Вход</h3>
        <form style={{margin: "10px", padding: "10px"}} onChange={handleForm}>
          <input
          style={{margin: "10px"}}
          placeholder="Login" 
          name="Login" 
          autoComplete="username" 
          required id="username" 
          className="form-control" 
          onChange={handleLogin}
          />
        
          <input
          style={{margin: "10px"}} 
          placeholder="Password"
          name="Password"
          autoComplete="current-password"
          required id="password"
          className="form-control"
          type="password"
          onChange={handlePassword}
          />
          <button 
          style={{margin: "0px 10px"}}
          type="button" 
          className="btn btn-outline-primary" 
          onClick={handleClick}>
          Login
          </button>
        </form>
      </div>
    </div>
  </div>

  )
}

export default LoginPage;