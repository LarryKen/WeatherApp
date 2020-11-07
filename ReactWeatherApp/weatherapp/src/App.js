import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useRef, useReducer} from 'react'
import fetchWeatherData from './Components/fetchWeatherData'
import GetCity from './Components/GetCity'

function App() {
  const [weatherDetails, setWeatherDetails] = useState({
    name: "",
    Country: "",
    temp: undefined,
    humidity: undefined,
    cityName: undefined,
    searchWeatherParam: undefined
  })
  let disableButton = useRef(true);
  let intialState = localStorage.getItem("prevSession") ? localStorage.getItem("prevSession") : [];
  const reducer = (currentSession, action) => {
    return currentSession += JSON.stringify(action.body);
  }
  const [currentSession, dispatch] = useReducer(reducer,intialState);

  const handleSubmit = async (e) =>{
    e.preventDefault();
    e.stopPropagation();
    try {
      if(weatherDetails.searchWeatherParam!=undefined){
      let res = await fetchWeatherData(weatherDetails.searchWeatherParam)
      setWeatherDetails(prevState => {return {...weatherDetails, name: res.name, Country:res.sys.country}})
      dispatch({body: weatherDetails})
      localStorage.setItem("prevSession", currentSession)
      }
    } catch (err){
      console.log(err)
    }
  }
  const handleInputChange = (e) => {
    setWeatherDetails({...weatherDetails, cityName:e.target.value})
    disableButton.current = false
  }
  
  const selectCity = (e) => {
    setWeatherDetails({...weatherDetails, searchWeatherParam:e.value})
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <GetCity handleInputChange={handleInputChange} cityName={weatherDetails.cityName} selectCity={selectCity} disableButton={disableButton.current}/> 
        <p>
          {currentSession}
        </p>
      
        <button onClick={handleSubmit}>Get Weather</button>
      </header>
    </div>
  );
}

export default App;
