import React, { useContext, useState } from 'react';
import { Context } from './Store';
import Footer from './Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Recharts from './Recharts'
import validateXML from './validateXML'
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
    const footer = document.querySelector('.footer_abs')
    next.classList.remove('d-none')
    next.classList.add('visible')
    footer.classList.remove('position-absolute')
  }

const handleExit = () => {
    // e.preventDefault()
    const validation = false;
    const SessionID = null;
    const dataResponseState = [];
    const dataResponseStateRecharts = [];
    inSetState({validation, SessionID, dataResponseState, dataResponseStateRecharts})
  }

  // const handleDataPicker = () => {
  //   console.log(endDate.toISOString().substring(0, 10) + ' 00:00:00')
  // }
  
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
    if (startDate > endDate){
      // console.log('err date');
      return;
    } else {
      let urle = 'https://va.fpst.ru/api/exportreport';
      const connectId = inState.SessionID
      const changePassword = inState.ChangePasswordAtNextLogin
      // console.log(changePassword)
      // const { form } = inState;
      const responseForm = new FormData()
      responseForm.set('SessionID', connectId)
      responseForm.set('ChangePasswordAtNextLogin', changePassword)
      responseForm.set('Analytics', 'FaceRecognition')
      responseForm.set('From', `${startDate.toISOString().substring(0, 10) + ' 00:00:00'}`)
      responseForm.set('To', `${endDate.toISOString().substring(0, 10) + ' 23:30:10'}`)
      responseForm.set('Offset', offset)
      responseForm.set('Limit', 20)
    if (startDate > endDate) {
      console.log('err date');
    } else {
    await fetch(urle, {
      method: 'POST',
      body: responseForm
    }).then(function(response) {
      // console.log(response, 'response')
      return response.text();
    }).then(function(data) {
      if(!validateXML(data)) {
        let parseData = JSON.parse(data)
        if (Object.prototype.hasOwnProperty.call(parseData, 'Error') && parseData.Error === "Ошибка авторизации") {
          console.log(parseData.Error === "Ошибка авторизации")
          handleExit()
        }
      }
      // console.log(JSON.parse(data))
      // console.log(data, 'data')
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
          handleCheck()
        } else {
          const { dataResponseState } = inState
          inSetState({...inState, dataResponseState: [...dataResponseState, ...dataResponse]})
          // handleCheck()
        }
      }
    }).catch(err => handleExit())
    
    }
  }}

  const formatLocaleDate = (str) => {
    const g = str.substr(0, 4)
    const m = str.substr(5, 2)
    const d = str.substr(8, 5)
    return `${d}.${m}.${g}`
  }

  const { dataResponseState } = inState;
  
  return (
      <div className="container mb-0 p-0 h-100">
      <div className="p-0" style={{"backgroundColor": '#ddd', "height": "100vh", "position": "relative"}}>
      <nav className="navbar navbar-expand-lg navbar-light bg-light pt-0 pb-0 ">
        <div className="container-fluid p-2 border-bottom border-primary" style={{backgroundColor: 'rgba(177, 229, 239, 1)'}}>
          <a className="navbar-brand" href="#/">Forpost</a>
              <button className="btn btn-outline-primary" type="button" data-mdb-ripple-color="dark" onClick={handleExit}>
                Выход
              </button>
        </div>
      </nav>
        <div>
          <Recharts />
        </div>
        
        <div className="p-4 row d-flex align-items-end">
          <div className="m-1 col-md-auto">
            <p>выбрать дату от</p>
          <DatePicker
            key={_.uniqueId()}
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            dateFormat='dd/MM/yyyy'
            className="form-control border-primary"
            maxDate={new Date()}
        />
          </div>
          <div className="m-1 col-md-auto">
          <p>выбрать дату до</p>
          <DatePicker
            key={_.uniqueId()}
            selected={endDate} 
            onChange={date => setEndDate(date)}
            selectsEnd
            dateFormat='dd/MM/yyyy'
            className="form-control border-primary"
            maxDate={new Date()} 
        />
          </div>
          <div className="m-1 col-md-auto">
            <button className="btn btn-info btn-outline-primary" style={{"width": "205px"}} onClick={handleNewResponseData}><p className="p-0 m-0 text-light">Поиск</p></button>
          </div>
          
          </div>
          <div className="d-flex flex-wrap justify-content-center" style={{backgroundColor: '#ddd'}}>
            {dataResponseState.map((item) => {
              const date = item.elements[0].elements[0]
              const day = {...date}
              const time = {...date}
            return (
            <div key={_.uniqueId()}className="m-1 border border-primary rounded col-md-4 col-lg-4 p-2 d-flex"
              style={{"width": "280px",
              backgroundColor: 'rgba(177, 229, 239, 1)'}}>
                <div className="">
                      {'elements' in item.elements[3] ? 
                      <img src={`data:image/png;base64,${item.elements[3].elements[0].text}`} 
                      alt="altImage" /> : null}
                </div>
                <div className="col-md-5">
                  <div className="">
                    <p className="p-2" style={{"fontSize": "12px"}}>
                      Дата: {formatLocaleDate(day.text.substring(0, 10))}<br />
                      Время: {time.text.substr(10)}<br />
                      Камера {item.elements[1].elements[0].text}<br />
                      {item.elements[2].elements[0].text}
                    </p>
                    <p className="card-text">
                    <small className="text-muted">{'elements' in item.elements[4] ? item.elements[4].elements[0].text : null}</small>
                    </p>
                  </div>
                </div>
            </div>
              )
              })}
            </div>
            <div className="d-flex justify-content-around d-none next_btn pt-4 pb-4" style={{backgroundColor: '#ddd'}}>
              <button className="btn btn-info btn-outline-primary" style={{"width": "170px"}} id="next" onClick={handleResponseDataNext}><p className="p-0 m-0 text-light">Продолжить поиск</p></button>
            </div>
            <div className="w-100 p-0 m-0 footer_abs position-absolute" style={{bottom: '0', backgroundColor: '#ddd'}}>
              <Footer />
            </div>
        </div>
        
        </div>
        
  );
}

export default AdminPanel;