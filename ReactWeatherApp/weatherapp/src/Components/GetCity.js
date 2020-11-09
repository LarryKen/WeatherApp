import React, { useState} from 'react'
import Select from 'react-select'

const getCityAPIKEY= process.env.REACT_APP_GETCITY_APIKEY
const GetCity = (props) => {
    const [cities, setCities] = useState([]);
    const handleInputChange = (e) => {
        e.preventDefault();
        if(e.stopPropogation) e.stopPropogation();
        props.handleInputChange(e);
        };
    
    const fetchCities = async () => {
        if(props.cityName===undefined || props.cityName === "") return
        try {
            const res = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${getCityAPIKEY}&q=${props.cityName}`)
            return res.json()
        } catch (err) {
            console.log(err)
        }
    }
    const search = async () => {
        let payload = await fetchCities();
        payload.forEach(object => {
            setCities(prevState=> {
                let newArray = prevState
                newArray.push({label: object.LocalizedName+", "+object.Country.ID, value: object.LocalizedName+", "+object.Country.ID});
                return (newArray)})
        });
    }
    
    const selectCity = (e) => {
        let prevSession = localStorage.getItem("prevSession") ? localStorage.getItem("prevSession") : [];
        if(typeof prevSession=== 'string'){
            prevSession= prevSession.split(";");
        };
        prevSession.push(JSON.stringify({city: e.value}));
        localStorage.setItem("prevSession",prevSession.join(";"));
        props.selectCity(e);
    }
    return(
    <div>
        <p>Find your city</p>
        <input type='text' onChange={handleInputChange}></input>
        <button disabled={props.disableButton} onClick={search}>Search</button>
        <div>
            <Select onChange={selectCity} options={cities}/>
        </div>
    </div>
    )
}

export default GetCity;