import React, { useContext} from 'react';
import { Context } from './Store'


let isValide;
export const token = (number = null) => number === true ? true : false;

const Auth = () => {
  const [inState, inSetState] = useContext(Context);
  const handlerInput = (e) => {
    const name = e.target.value;
    inSetState({...inState, name})
  }
  const handleLoginButton = () => {
    const name = inState.name
    if (name === 'Tim') {
      const validation = true
      inSetState({...inState, validation})
    }
    console.log(isValide)
  }
  return (
    <>
      
    </>
  )
  // 
}
export default Auth;