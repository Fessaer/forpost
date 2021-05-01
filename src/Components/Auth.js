import React, { useContext} from 'react';
import { Context } from './Store';
import LoginPage from './LoginPage';
import AdminPanel from './AdminPanel.jsx';

const Auth = () => {
  const [inState] = useContext(Context);
  
  const { validation } = inState;
  return (
    <>
      {validation === false ? <LoginPage /> : null}
      {validation === true ? <AdminPanel /> : null}
    </>
  )
  // 
}
export default Auth;