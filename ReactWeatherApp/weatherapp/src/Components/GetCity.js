import React, {useRef} from 'react'
import Select from 'react-select'

const getCityAPIKEY= process.env.REACT_APP_GETCITY_APIKEY
const getCity = (props) => {
    let cities = [];
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
        payload.map(object => {
            cities.push({label:object.LocalizedName+", "+object.Country.ID, value: object.LocalizedName+", "+object.Country.ID})
        })
        console.log(cities);
    }
    
    const selectCity = (e) => {
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

export default getCity;