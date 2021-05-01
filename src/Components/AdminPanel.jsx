import React, { useContext} from 'react';
import { Context } from './Store'

const AdminPanel = () => {
  const [inState, inSetState] = useContext(Context);
  
  const handleCheck = () => {
    const newDate = new Date(2021, 3, 15, 18, 43, 59)
    const newDate2 = new Date(2021, 4, 15, 18, 43, 59)

    console.log(newDate.toLocaleString())
  }

  const handleExit = (e) => {
    e.preventDefault()
    const validation = false;
    const SessionID = null;
    inSetState({validation, SessionID})
  }

  const handleResponseData = async() => {
    // /api/exportreport
    let urle = 'https://va.fpst.ru/api/exportreport';
    const connectId = inState.SessionID
    console.log(connectId, 'SessionID')
    const newDate = new Date(2020, 3, 15, 18, 43, 59)
    const newDate2 = new Date(2020, 4, 15, 18, 43, 59) 
    let data = {
      SessionID: connectId,
      From: newDate.toLocaleString(),
      To: newDate2.toLocaleString(), //(дата и время от), To (дата и время до)
      Limit: 20, //(максимальное число записей в ответе)
      Offset: 0, //(смещение от нуля по числу записей)
    }
    console.log(JSON.stringify(data), 'data.json')
    const myHeaders = new Headers();

    
    myHeaders.append('SessionID', connectId);
    await fetch(urle, {
      method: 'POST',
      headers: myHeaders,
      //body: JSON.stringify(data)
    }).then(function(response) {
      return response.text();
    }).then(function(data) {
      console.log(data, 'data');
    }).then(err => console.log(err, 'err'))
  }

  return (
    <>
    <h1>Admin Panel</h1>
    <button onClick={handleCheck}>check</button>
    <button onClick={handleExit}>Выход</button>
    <button onClick={handleResponseData}>Запрос на сервер</button>
    </>
  );
}

export default AdminPanel;