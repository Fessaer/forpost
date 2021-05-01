import React, { useContext} from 'react';
import { Context } from './Store'


const TestGlobalStore = () => {
  const [inState, inSetState] = useContext(Context);
  let number = null
  const handleClick = (e) => {
    const { value } = inState
    number = value
    let { email } = inState
    email = value
     inSetState({...inState, number, email})
    console.log(inState)
  }
  const handleInput = (e) => {
    // e.preventDefault();
    let value = e.target.value;
     inSetState({...inState, value})
    
  }
  return (
   <>
    
   </>
 )
   
}

export default TestGlobalStore;