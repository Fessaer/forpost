import React, { useContext, useState } from 'react';
import { Context } from './Store';
import Footer from './Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Recharts from './Recharts'
import '../styles/admin.css'
var convert = require('xml-js');
var _ = require('lodash')

const AdminPanel = () => {
  
  const [offsetState, setOffsetState] = useState({offset: 0});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [inState, inSetState] = useContext(Context);

  let { offset } = offsetState
  
  const handleCheck = () => {
    const next = document.querySelector('.next_btn')
    next.classList.remove('d-none')
    next.classList.add('visible')
    console.log(inState, 'AdminPanel check state')
  }

  const handleExit = (e) => {
    e.preventDefault()
    const validation = false;
    const SessionID = null;
    const dataResponseState = [];
    const dataResponseStateRecharts = [];
    inSetState({validation, SessionID, dataResponseState, dataResponseStateRecharts})
  }

  const handleDataPicker = () => {
    console.log(endDate.toISOString().substring(0, 10) + ' 00:00:00')
  }
  
  const handleResponseDataNext = () => {
    offset = offset + 20
    setOffsetState({offset})
    handleResponseData()
  }

  const handleNewResponseData = () => {
    offset = 0;
    inSetState({...inState, dataResponseState: []})
    handleResponseData()
  }

  const handleResponseData = async() => {
    console.log(offset, 'handleResponseData')
    let urle = 'https://va.fpst.ru/api/exportreport';
    const connectId = inState.SessionID
    const form = new FormData()
    form.set('SessionID', connectId)
    form.set('Analytics', 'FaceRecognition')
    form.set('From', `${startDate.toISOString().substring(0, 10) + ' 00:00:00'}`)
    form.set('To', `${endDate.toISOString().substring(0, 10) + ' 23:30:10'}`)
    form.set('Offset', offset)
    form.set('Limit', 20)
    if (startDate > endDate){
      console.log('err date');
    } else {

    await fetch(urle, {
      method: 'POST',
      body: form
    }).then(function(response) {
      return response.text();
    }).then(function(data) {
      let result = convert.xml2json(data, {compact: false});
      return result;
    }).then(function(pars) {
      const dataResonse = JSON.parse(pars);
      return dataResonse
    }).then(function(dataResonse) {
      if ('elements' in dataResonse.elements[0]) {
        let dataResponse = dataResonse.elements[0].elements
        if (offset === 0) {
          let dataResponseState = dataResponse
          inSetState({...inState, dataResponseState})
        } else {
          const { dataResponseState } = inState
          inSetState({...inState, dataResponseState: [...dataResponseState, ...dataResponse]})
        }
      }
    }).then(err => console.log(err, 'err'))
    handleCheck()
  }
}

  const { dataResponseState } = inState;
  
  return (
      
      <div className="container cont_id">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Forpost</a>
              <button className="btn btn-outline-primary" type="button" data-mdb-ripple-color="dark" onClick={handleExit}>
                Выход
              </button>
          
        </div>
      </nav>
        <div className="row">
          <div className="col-xs-12">
            {/* <button className="btn btn-info btn_castom" onClick={handleCheck}>check</button> */}
            {/* <button className="btn btn-info btn_castom" onClick={handleExit}>Выход</button> */}
            {/* <button className="btn btn-info btn_castom" onClick={handleNewResponseData}>Запрос на сервер</button> */}
          </div>
        </div>
          <Recharts />
        <div className="d-flex flex-wrap-reverse">
          <div className="">
            <p>выбрать дату от</p>
          <DatePicker
            key={_.uniqueId()}
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            dateFormat='dd/MM/yyyy'
            className="form-control"
            maxDate={new Date()}
        />
          </div>
          
          <div className="">
          <p>выбрать дату до</p>
          <DatePicker
            key={_.uniqueId()}
            selected={endDate} 
            onChange={date => setEndDate(date)}
            selectsEnd
            dateFormat='dd/MM/yyyy'
            className="form-control"
            maxDate={new Date()} 
        />
          </div>
          <div className="">
            <p></p>  
            <button className="btn btn-info btn_castom" onClick={handleNewResponseData}>Поиск</button>
          </div>
          </div>
        <div className="row card_settings_old"> 
            {dataResponseState.map((item) => {
            return (
            <div className="col-md-6 col-lg-3 card_settings">
              <div className="row no-gutters">
                <div className="col-md-5">
                      {'elements' in item.elements[3] ? 
                      <img src={`data:image/png;base64,${item.elements[3].elements[0].text}`} 
                      alt="altImage" /> : null}
                </div>
                <div className="col-md-5">
                  <div className="">
                    <p className="card-text lines">
                      {item.elements[0].elements[0].text}
                    </p>
                    <p className="card-text lines">    
                          Камера {item.elements[1].elements[0].text}
                    </p>
                    <p className="card-text lines">   
                          {item.elements[2].elements[0].text}
                    </p>
                    <p className="card-text">
                    <small className="text-muted">{'elements' in item.elements[4] ? item.elements[4].elements[0].text : null}</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
              )
              })}
          
          
          
        </div>
        <button className="btn btn-info w-30 next_btn d-none" id="next" onClick={handleResponseDataNext}>Продолжить поиск</button>
        <Footer />
        </div>
        
  );
}

export default AdminPanel;