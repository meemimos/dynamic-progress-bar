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

  //Using Effect to track data update

  //This effect will fetch all the data from endpoint
  useEffect(() => {
    console.log('Getting Data from endpoint');
    getProgressBarData();
  }, []);

  //This effect will be triggred when any bar value gets value update
  useEffect(() => {
    console.log("Info: " + (currentBar ? currentBar.name : "Progress Bar") + " value updated!")
  }, [bars, currentBar])


  //Async Function to get all the data from endpoint provided
  const getProgressBarData = async () => {
    const apiUrl = "http://pb-api.herokuapp.com/bars";
    await axios.get(apiUrl)
      .then(function (response) {
        const bars = [];
        const buttons = [];
        console.log(response.data);
        // eslint-disable-next-line array-callback-return
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
        // eslint-disable-next-line array-callback-return
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

  //Function to create dynamic dropdown option
  const makeDropDownOption = () => {
    return bars.map((option) =>
      <option key={option.key} value={option.value}>
        {option.name}
      </option>
    );
  }

  //Function to update current Bar when user select from dropdown option
  const handleChange = (e) => {
    const key = e.target.selectedIndex;
    var currentBar = {};
    let newBars = Object.assign([], bars);
    newBars.map((bar) => {
      if (bar.key === key) {
        bar.active = true
        currentBar = {
          key: bar.key,
          name: bar.name,
          percent: bar.percent,
          active: true
        }
      } else {
        bar.active = false
      }
    });
    setCurrentBar(currentBar);
    setBars(newBars);
  }

  //Function to handle Increment/Decrement button clicked
  const handleButton = (e) => {
    let newBars = Object.assign([], bars)

    const oldValue = parseInt(currentBar.percent);
    var newValue = parseInt(e.target.innerHTML);

    newValue = oldValue + newValue;

    if (newValue <= 0) {
      newValue = 0
    }

    currentBar.percent = newValue;
    newBars[currentBar.key].percent = newValue;
    setCurrentBar(currentBar);
    setBars(newBars);
    console.log(currentBar);
  }

  return (
    <div className="custom-card">
      {bars.length < 1 ?
        <div className="text-center">
          Loading..
        </div>
        :
        <div className="page-header">
          <h1>Progress Bar <small>Demo</small></h1>

          {/* Dropdown Option */}
          <select id="select-dropdown" className="form-select" onChange={handleChange}>
            {makeDropDownOption()}
          </select>

          {/* Progress Bar */}
          <div>
            {bars.map((bar) => {
              return <ProgressBar key={bar.key}
                className={
                  `mt-4 ${bar.active ? "progress-bar-active" : "progress-bar-deactive"}
                   ${bar.percent >= limit ? "progress-bar-active-red" : ""}
                 `}
                striped
                variant={bar.percent >= limit ? "danger" : "primary"}
                now={bar.percent < 0 ? 0 : (bar.percent * 100) / limit}
                label={`${bar.percent < 0 ? 0 : bar.percent}%`} />
            })}
          </div>
          <div className="mt-4 text-center">
            <h3>Controllers</h3>
            <div className="btn-group btn-group-justified" role="group" aria-label="...">
              <ul className="list-button">
                {
                  buttons.map(btn =>
                    <li key={btn.key} style={{ marginLeft: "2px" }}>
                      <div className="btn-group" role="group">
                        <button className={`btn ${btn.value > 0 ? "btn-success" : "btn-danger"}`}
                          onClick={handleButton}>{btn.value}
                        </button>
                      </div>
                    </li>
                  )
                }
              </ul>
            </div>
          </div>
          <div className="text-center">
            Progress bar limit: <small>{limit}</small>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
