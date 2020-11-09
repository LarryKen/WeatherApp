const API_key = process.env.REACT_APP_APIKEY
const fetchWeatherData = async (cityName) =>{
    try {
    const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}&units=metric`)
    return res.json()
    } catch (err) { console.log(err)}
}

export default fetchWeatherData