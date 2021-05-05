import React from 'react';
import Store from './Components/Store'
import Auth from './Components/Auth'


const App = (props) => {

    console.log(props)
    return (
      <Store>
          <Auth />
      </Store>
    )
}

export default App;
