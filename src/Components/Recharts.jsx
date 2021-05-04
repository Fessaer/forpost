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
let convert = require('xml-js');
let _ = require('lodash');


const Recharts = () => {
  const [inState, inSetState] = useContext(Context);
  let d = new Date();
  const [startDate, setStartDate] = useState(new Date(d.setDate(d.getDate() - 0)));
  const [endDate, setEndDate] = useState(new Date());

  let dataRecharts = [
        
    ]
  
    const handleNewResponseData = async() => {
      let urle = 'https://va.fpst.ru/api/exportreport';
      const connectId = inState.SessionID
      const form = new FormData()
      form.set('SessionID', connectId)
      form.set('Analytics', 'FaceRecognition')
      form.set('From', `${startDate.toISOString().substring(0, 10) + ' 00:00:00'}`)
      form.set('To', `${endDate.toISOString().substring(0, 10) + ' 23:55:00'}`)
      form.set('Offset', 0)
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
        let resultArr = dataResponse.faces.face
        const arr = resultArr.map((item) => item.DateTime._text.substring(0, 10))
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
        dataRecharts = arrayRecharts
        inSetState({...inState, dataRecharts})
      }).catch(err => console.log(err, 'err'))
    }
  }
  


  
  return (
    <>
      <ResponsiveContainer width="100%" height={400}>
            <LineChart data={inState.dataRecharts}>
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" />
                <YAxis dataKey="count" />
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>
        <div>
        <DatePicker
            key={_.uniqueId()}
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            dateFormat='dd/MM/yyyy'
            maxDate={new Date()}
        />
        <DatePicker
            key={_.uniqueId()}
            selected={endDate} 
            onChange={date => setEndDate(date)}
            selectsEnd
            dateFormat='dd/MM/yyyy'
            maxDate={new Date()} 
        />
      </div>
      <button onClick={handleNewResponseData}>Получить данные</button>
    </>
  )
}
export default Recharts;
