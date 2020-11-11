import './App.css';
import {useState, useEffect, useRef} from 'react'
import fetchWeatherData from './Components/fetchWeatherData'
import GetCity from './Components/GetCity'

function App() {
  let localstor = localStorage.getItem("prevSession");
  let currentSes=[];
  if(localStorage.getItem("prevSession")){
    currentSes= localstor.split(";").map(str => {return JSON.parse(str)});
  }

  const [weatherDetails, setWeatherDetails] = useState({
    array:currentSes
  })
  let disableButton = useRef(true);
  const [cityList, setCityList] = useState();
  useEffect( () => {
    setCityList(prevState => {return weatherDetails.array.map(item => {
        if(item.weather){
          return(
            <div className='City'>
              <p>City: {item.city}</p>
              <p>Date: {item.weather.date}</p>
              <p>Temperature: {Math.round(item.weather.temp)}C</p>
              <p>Humidity: {item.weather.humidity}%</p>
            </div>)
        }
        else{
          return(
          <div className='City'>
            <p>City: {item.city}</p>
          </div>
          )
        }
      })
    })
      }, [weatherDetails])
  
  const handleSubmit = async (e) =>{
    e.preventDefault();
    e.stopPropagation();
    if(currentSes!==undefined){
      try {
      for( const element of currentSes){
        let res = await fetchWeatherData(element.city);
        element.weather = {temp:res.main.temp, humidity:res.main.humidity,name: res.name, Country:res.sys.country, date:new Date(new Date().getTime() + res.timezone * 1000).toUTCString()};
      }
      setWeatherDetails({...weatherDetails, array:currentSes});
    } catch (err) { console.log(err)}
    }
  }
  const handleInputChange = (e) => {
    setWeatherDetails({...weatherDetails, cityName:e.target.value})
    disableButton.current = false
  }
  
  const selectCity = (e) => {
    currentSes= weatherDetails.array;
    currentSes.push({city: e.value});
    setWeatherDetails({...weatherDetails, array:currentSes})
  }

  return (
    <div className="App">
      <header className="App-header">
        <GetCity handleInputChange={handleInputChange} cityName={weatherDetails.cityName} selectCity={selectCity} disableButton={disableButton.current}/>
         <button onClick={handleSubmit}>Get weather and date</button>
        <div>
          {cityList}
        </div>
      </header>
    </div>
  );
}

export default App;
