import React, { useContext, useState} from 'react';
import { Context } from './Store'
const axios = require('axios')
let base64 = require('base-64');

const LoginPage = () => {
  const [state, setState] = useState({});
  const [inState, inSetState] = useContext(Context);
  

  const handleClick = () => {
    let url = 'https://va.fpst.ru/api/login';
    const { login } = state;
    const { password } = state;
    const fn = async () => {
      const data = {
        Login: login,
        Password: password,
      };
      
      const response = await axios.post(url, {data});
      console.log(response)
    }
    fn()
    // inSetState({...inState, ...state})
  }

  const handleLogin = (e) => {
    const login = e.target.value
    setState({...state, login})
  }

  const handlePassword = (e) => {
    const password = e.target.value
    setState({...state, password})
  }

return (
  
  <div style={{margin: "10% 0px"}} className="container-fluid d-flex h-100 justify-content-center align-items-center p-0">
    <div className="row bg-white shadow-sm">
      <div className="col border rounded p-4">
        <h3 className="text-center mb-4">Вход</h3>
        <form style={{margin: "10px", padding: "10px"}}>
          <input
          style={{margin: "10px"}}
          placeholder="username" 
          name="username" 
          autoComplete="username" 
          required id="username" 
          className="form-control" 
          onChange={handleLogin}
          />
        
          <input
          style={{margin: "10px"}} 
          placeholder="password"
          name="password"
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