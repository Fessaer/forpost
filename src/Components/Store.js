import React, { useState } from 'react';

const initialState = {
  validation: false,
  SessionID: null,
  dataResonse: null,
}

export const Context = React.createContext();

const Store = ({children}) => {
  const [inState, inSetState] = useState(initialState);
  
  return (
    <Context.Provider value={[inState, inSetState]}>{children}</Context.Provider>
  )
}
export default Store;

