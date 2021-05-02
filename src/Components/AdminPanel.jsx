import React, { useContext} from 'react';
import { Context } from './Store'
var convert = require('xml-js');
var _ = require('lodash')

const AdminPanel = () => {
  const [inState, inSetState] = useContext(Context);
  
  const handleCheck = () => {
    console.log(inState, 'AdminPanel check state')
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
    // const newDate = new Date(2020, 3, 15, 18, 43, 59)
    // const newDate2 = new Date(2020, 4, 15, 18, 43, 59) 
    // let data = {
    //   SessionID: connectId,
    //   From: newDate.toLocaleString(),
    //   To: newDate2.toLocaleString(), //(дата и время от), To (дата и время до)
    //   Limit: 20, //(максимальное число записей в ответе)
    //   Offset: 0, //(смещение от нуля по числу записей)
    // }
    const form = new FormData()
    form.set('SessionID', connectId)
    form.set('Analytics', 'FaceRecognition')
    form.set('From', '2021-04-30 00:00:00')
    form.set('To', '2021-05-01 00:00:00')
    form.set('Offset', 0)
    form.set('Limit', 10)
    await fetch(urle, {
      method: 'POST',
      body: form
    }).then(function(response) {
      return response.text();
    }).then(function(data) {
      let result = convert.xml2json(data, {compact: false, spaces: 4});
      //console.log(JSON.parse(result), 'data');
      return result;
    }).then(function(pars) {
      const dataResonse = JSON.parse(pars);
      return dataResonse
    }).then(function(dataResonse) {
      inSetState({...inState, dataResonse})
    }).then(err => console.log(err, 'err'))
  }
  const { dataResonse } = inState;
  return (
    <>
    <h1>Admin Panel</h1>
    <button onClick={handleCheck}>check</button>
    <button onClick={handleExit}>Выход</button>
    <button onClick={handleResponseData}>Запрос на сервер</button>
    {dataResonse === null ? null : dataResonse.elements.map((item) => {
      if (item.type === 'elements') {
        
      }
      return <h1 key={_.uniqueId()}>{item.type}</h1>
      })}
    </>
  );
}

export default AdminPanel;