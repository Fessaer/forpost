import React from 'react';
import Store from './Components/Store'
import TestGlobalStore from './Components/TestGlobalStore';
import Auth from './Components/Auth'




const App = (props) => {

    console.log(props)
    return (
      <Store>
          <Auth />
          <TestGlobalStore />
      </Store>
    )
 
}

export default App;
