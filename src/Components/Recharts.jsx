import React, { useContext, useState} from 'react';
import { CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line
} from 'recharts';
import { Context } from './Store';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
let convert = require('xml-js');
let _ = require('lodash');

const Recharts = () => {
  const [inState, inSetState] = useContext(Context);
  let d = new Date();
  const [startDate, setStartDate] = useState(new Date(d.setDate(d.getDate() - 10)));
  const [endDate, setEndDate] = useState(new Date());

  const getIntroOfPage = (label) => {
    if (label.substring(0, 10) === '2021') {
      return "Распознано лиц за день";
    }
    return;
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="lh-1 p-1 bg-info rounded"
        style={{'width': "auto"}}>
          <p className="text-wrap m-0" style={{"fontSize": "13px"}}>Дата: {`${label}`}<br />
          {getIntroOfPage(label)}
          Посещений за день: {`${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // let { dataRecharts } = inState
  let offset = 0
  let { offsetStateTest } = inState;
  let dt = new Date(); //1 января 2017
  dt.setDate(d.getDate() - 10)

  const intervalResolve = () => {
    if (startDate > endDate){
      console.log('err date');
    } else {
    inSetState({...inState, disabled: true})
    offsetStateTest = [];
    offset = 0
    let timerId = setInterval(() => {
      offset = offset + 1000
      return handleNewResponseData(offset)}, 3000);
    setTimeout(() => { clearInterval(timerId)}, 30000);
    setTimeout(() => { filterResponseResult(offsetStateTest)}, 40000);
    }
  }

  const filterResponseResult = (arr) => {
    let arrFelter = arr.map((item) => item.DateTime._text.substring(0, 10))
            for (var len = arrFelter.length, i = len; --i >= 0;) {
              if (arrFelter[arrFelter[i]]) {
                arrFelter[arrFelter[i]] += 1;
                arrFelter.splice(i, 1);
              } else {
                arrFelter[arrFelter[i]] = 1;
              }
            }
            arrFelter.sort(function(a, b) {
              return arrFelter[b] - arrFelter[a];
            });
            const arrayRecharts = arrFelter.map((el, i, a) => ({
              "date":el, "count": a[el]
            })); 
            var result = arrayRecharts.sort(function(a,b) {
              return Date.parse(a.date) - Date.parse(b.date);
              }).reduce(function(hash){
                  return function(p,c){
                  var missingDaysNo = (Date.parse(c.date) - hash.prev) / (1000 * 3600 * 24);
                  if(hash.prev && missingDaysNo > 1) {
                    for(var i=1;i<missingDaysNo;i++)
                  p.push(new Date(hash.prev+i*(1000 * 3600 * 24)));
                  }
                hash.prev = Date.parse(c.date);
              return p;
              };
            }(Object.create(null)),[]);
            const arrayNullDate = result.map((item) => {
              const d = new Date(item).toISOString().substring(0, 10)
              return ({ "date": d, "count": 0 })
            })
            const joinArrDate = [...arrayNullDate, ...arrayRecharts] 
            let arrSort = joinArrDate.sort((prev, next) => new Date(prev.date) - new Date(next.date))
            let arrLocaleDate = arrSort.map((item) => {
              const n = new Date(item.date)
              let dt = item.date
              const dateNew = `${n.getDate()}.${dt.substring(5, 7)}.${n.getFullYear()}`
              return {date: dateNew, count: item.count}
            })
              inSetState({...inState, dataRecharts: [...arrLocaleDate], disabled: false})
  }

  const handleExit = () => {
    const validation = false;
    const SessionID = null;
    const dataResponseState = [];
    const dataResponseStateRecharts = [];
    inSetState({validation, SessionID, dataResponseState, dataResponseStateRecharts})
  }

    const handleNewResponseData = async(offset = 0) => {
      let urle = 'https://va.fpst.ru/api/exportreport';
      const connectId = inState.SessionID
      const form = new FormData()
      form.set('SessionID', connectId)
      form.set('Analytics', 'FaceRecognition')
      form.set('From', `${startDate.toISOString().substring(0, 10) + ' 00:00:00'}`)
      form.set('To', `${endDate.toISOString().substring(0, 10) + ' 23:55:00'}`)
      form.set('Offset', offset)
      form.set('Limit', 1000)
        await fetch(urle, {
          method: 'POST',
          body: form
        }).then(function(response) {
        return response.text()
      }).then(function(data) {
        let result2 = convert.xml2json(data, {
          compact: true,
          object: true,
        });
        return result2;
      }).then(function(pars) {
        const dataResponse = JSON.parse(pars);
        if (Object.prototype.hasOwnProperty.call(dataResponse, 'Error') && dataResponse.Error === "Ошибка авторизации") {
          // console.log(dataResponse.Error === "Ошибка авторизации")
          handleExit()
        }
          if ('face' in dataResponse.faces) {
            const array = dataResponse.faces.face
            offsetStateTest = [...offsetStateTest, ...array]
            } else {
              //  console.log('в ответе серевера массива нет')
              return;
            }
      }).catch(err => handleExit())
    
  }
  let { disabled } = inState
  return (
    <>
      <div className="p-4 d-flex justify-content-start align-items-end row">
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
          <button className="btn btn-info btn-outline-primary" style={{"width": "205px"}} type="button" disabled={disabled} onClick={intervalResolve}>
          {disabled ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : null}
          {disabled ? <span className="text-dark"> Загрузка...</span> : <span className="p-0 m-0 text-light">Получить данные</span>}
            
          </button>
            {/* <button className="btn btn-info btn-outline-primary" style={{"width": "170px"}} onClick={intervalResolve}><p className="p-0 m-0 text-light">Получить данные</p></button> */}
          </div>
        </div>
        <div className="p-0">
        <ResponsiveContainer width="95.5%" height={400}>
          <LineChart data={inState.dataRecharts}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
              <XAxis 
              dataKey="date"
              style={{
                fontSize: '0.7rem',
                fontFamily: 'Times New Roman',
                margin: '0px',
                
              }}
              />
              <YAxis 
              dataKey="count"
              style={{
                fontSize: '1rem',
                fontFamily: 'Times New Roman',
            }}
              />
              <Tooltip content={<CustomTooltip />}/>
            </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
export default Recharts;
