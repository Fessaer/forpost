import React, { useContext, useState} from 'react';
import { CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
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

  let  { dataRecharts } = inState
  let offset = 0
  let { offsetStateTest } = inState;
  let dt = new Date(); //1 января 2017
  dt.setDate(d.getDate() - 10)

  const intervalResolve = () => {
    offset = 0
    let timerId = setInterval(() => {
      offset = offset + 1000
      return handleNewResponseData(offset)}, 3000);

    setTimeout(() => { clearInterval(timerId)}, 10000);
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
        // return 
        const array = dataResponse.faces.face
        offsetStateTest = [...offsetStateTest, ...array]
        
        // console.log(resultArr, 'resultArr')
        const arr = offsetStateTest.map((item) => item.DateTime._text.substring(0, 10))
        for (var len = arr.length, i = len; --i >= 0;) {
          if (arr[arr[i]]) {
            arr[arr[i]] += 1;
            arr.splice(i, 1);
          } else {
            arr[arr[i]] = 1;
          }
        }
        arr.sort(function(a, b) {
          return arr[b] - arr[a];
        });
        const arrayRecharts = arr.map((el, i, a) => ({
          ['date']:el, ['count']: a[el]
        })); 
        let { dataRecharts } = inState
        let arrs = [...dataRecharts, ...arrayRecharts]
        let arrSort = arrs.sort((prev, next) => new Date(prev.date) - new Date(next.date))
        console.log(arrSort, 'arrSort')
        offsetStateTest = arrSort
        inSetState({...inState, offsetStateTest})      
      } else {
        return console.log('в ответе серевера массива нет')
      }
      }).then((arrArray)=>{
        // let { offsetStateTest } = inState;
        offsetStateTest = [...offsetStateTest, ...arrArray]
        console.log(offsetStateTest, 'offsetStateTest')
        inSetState({...inState, offsetStateTest})
      }).catch(err => console.log(err, 'err'))
      
    }
  }
  
  return (
    <>
      <div className="row">
        <div  className="col-xs-12">
          <DatePicker
            key={_.uniqueId()}
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            dateFormat='dd/MM/yyyy'
            className="form-control datePiker_castom"
            maxDate={new Date()}
          />
          
          <DatePicker
            key={_.uniqueId()}
            selected={endDate} 
            onChange={date => setEndDate(date)}
            selectsEnd
            dateFormat='dd/MM/yyyy'
            className="form-control datePiker_castom"
            maxDate={new Date()} 
          />
          
              <button className="btn btn-info btn_castom_recharts" onClick={intervalResolve}>Поиск</button>
            </div>
          </div>
        
        <div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={inState.dataRecharts}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis dataKey="count" />
              <Tooltip />
            </LineChart>
        </ResponsiveContainer>
        </div>
        </>
    
  )
}
export default Recharts;
