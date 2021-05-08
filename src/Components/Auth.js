import React, { useContext} from 'react';
import { Context } from './Store';
import LoginPage from './LoginPage';
import AdminPanel from './AdminPanel.jsx';

const Auth = () => {
  const [inState] = useContext(Context);
  // console.log(inState)
  const { validation } = inState;
  return (
    <>
      {validation === false ? <LoginPage /> : <AdminPanel />}
      {/* {validation === true ? <AdminPanel /> : null} */}
    </>
  )
  // 
}
export default Auth;