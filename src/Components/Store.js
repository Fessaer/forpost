import React, { useState } from 'react';

const initialState = {
  login: '',
  password: 'nwtimon@yandex.ru',
  validation: false,
  token: '',
};

export const Context = React.createContext();

const Store = ({children}) => {
  const [inState, inSetState] = useState(initialState);
  
  return (
    <Context.Provider value={[inState, inSetState]}>{children}</Context.Provider>
  )
}
export default Store;

