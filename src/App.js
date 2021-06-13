import React, { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ProgressBar } from 'react-bootstrap';
import axios from 'axios';


function App() {

  const [bars, setBars] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [limit, setLimit] = useState();
  const [currentBar, setCurrentBar] = useState();

  useEffect(() => {
    console.log('Generate Progress Bar.');
    getProgressBarData();
  }, []);

  const getProgressBarData = async () => {
    const apiUrl = "http://pb-api.herokuapp.com/bars";
    await axios.get(apiUrl)
      .then(function (response) {
        const bars = [];
        const buttons = [];
        console.log(response.data);
        response.data.bars.map((percent, i) => {
          bars.push(
            {
              key: i,
              name: 'Progress Bar ' + (i + 1),
              percent: percent,
              active: i === 0 ? true : false
            }
          )
        })
        response.data.buttons.map((value, i) => {
          buttons.push(
            {
              key: i,
              value
            }
          )
        })
        setBars(bars);
        setCurrentBar(bars[0]);
        setButtons(buttons);
        setLimit(response.data.limit);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        //Always Executed
      });
  }

  return (
    <div className="App">
      {console.log(bars)}
      <h1>Hello From Dynamic Progress Bar {bars.length}</h1>
      {bars.map((bar) => {
        return <ProgressBar key={bar.key}
          className={
            `mt-4 ${bar.active ? "progress-bar-active" : "progress-bar-deactive"}
                   ${bar.percent > 100 ? "progress-bar-active-red" : ""}
                 `}
          striped
          variant={bar.percent > 100 ? "danger" : "primary"}
          now={bar.percent < 0 ? 0 : bar.percent}
          label={`${bar.percent < 0 ? 0 : bar.percent}%`} />
      })}
    </div>
  );
}

export default App;
