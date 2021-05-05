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
import '../styles/admin.css';
let convert = require('xml-js');
let _ = require('lodash');


const Recharts = () => {
  const [inState, inSetState] = useContext(Context);
  let d = new Date();
  const [startDate, setStartDate] = useState(new Date(d.setDate(d.getDate() - 10)));
  const [endDate, setEndDate] = useState(new Date());

  const getIntroOfPage = (label) => {
    if (label.substring(0, 10) === '2021') {
      return "Распознано лиц за день ";
    }
    
    return '';
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-info opacity-(3-0) rounded">
          <p className="label">Дата: {`${label}`}</p>
          <p className="intro">{getIntroOfPage(label)}</p>
          <p className="desc">Посещений за день: {`${payload[0].value}`}</p>
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
    offsetStateTest = [];
    // dataRecharts = [];
    offset = 0
    let timerId = setInterval(() => {
      offset = offset + 1000
      return handleNewResponseData(offset)}, 3000);
      
    setTimeout(() => { clearInterval(timerId)}, 30000);
    setTimeout(() => { filterResponseResult(offsetStateTest)}, 40000);
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
            // console.log(arrFelter, 'no sorted')
            arrFelter.sort(function(a, b) {
              return arrFelter[b] - arrFelter[a];
            });
            const arrayRecharts = arrFelter.map((el, i, a) => ({
              ['date']:el, ['count']: a[el]
            })); 
            // let { dataRecharts } = inState
            // let arrs = arrayRecharts
            
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
            
              console.log(arrSort, inState , 'data')
              dataRechartsLocal = arrSort;
              console.log(dataRechartsLocal)
              inSetState({...inState, dataRecharts: [...arrSort]})
            
            
  }
  const check = () => {
    console.log(inState.dataRecharts)
  }


    const handleNewResponseData = async(offset = 0) => {
      let urle = 'https://va.fpst.ru/api/exportreport';
      console.log(offset, 'offset')
      const connectId = inState.SessionID
      const form = new FormData()
      form.set('SessionID', connectId)
      form.set('Analytics', 'FaceRecognition')
      form.set('From', `${startDate.toISOString().substring(0, 10) + ' 00:00:00'}`)
      form.set('To', `${endDate.toISOString().substring(0, 10) + ' 23:55:00'}`)
      form.set('Offset', offset)
      form.set('Limit', 1000)
      if (startDate > endDate){
        console.log('err date');
      } else {
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
          console.log(dataResponse)
          if ('face' in dataResponse.faces) {
            const array = dataResponse.faces.face
            offsetStateTest = [...offsetStateTest, ...array]
            // inSetState({...inState, offsetStateTest})
            } else {
              return console.log('в ответе серевера массива нет')
            }
      }).catch(err => console.log(err, 'err'))
    }
  }
  let dataRechartsLocal = []
  return (
    <>
      <div className="d-flex flex-wrap-reverse">
          <div className="">
            <p>выбрать дату от</p>
          <DatePicker
            key={_.uniqueId()}
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            dateFormat='dd/MM/yyyy'
            className="form-control datePiker_castom"
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
            className="form-control datePiker_castom"
            maxDate={new Date()} 
          />
          </div>
          <div className="">
          
            <button className="btn btn-info btn_castom_recharts" onClick={intervalResolve}>Получить данные</button>
          </div>
          <div>
            
          </div>
          </div>
        
        <div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={inState.dataRecharts}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
              <XAxis 
              dataKey="date"
              style={{
                fontSize: '0.7rem',
                fontFamily: 'Times New Roman',
              }}
              />
              <YAxis 
              dataKey="count"
              style={{
                fontSize: '1rem',
                fontFamily: 'Times New Roman',
            }}
              />
              {/* <Tooltip /> */}
              <Tooltip content={<CustomTooltip />}/>
            </LineChart>
        </ResponsiveContainer>
        </div>
        </>
    
  )
}
export default Recharts;
