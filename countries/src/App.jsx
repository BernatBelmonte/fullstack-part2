import { useState } from 'react'
import { useEffect } from 'react'
import countriesService from './services/countriesservice'
import './App.css'


const Filter = (props) => {
  const { filter, handleFilter} = props
  return (
    <form>
      <input type="text" onChange={handleFilter} value={filter} placeholder='Search for a Country...'/>
    </form>
  )
}

const Countries = (props) => {
  const { handleWeather, handleCountry, countries } = props
  if (countries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }
  else {
    return (
      <ul>
        {countries.map((country, i) => <li key={i}>{country.name}<button onClick={() => {handleCountry(country.name);handleWeather(country.location)}}>Select</button></li>)}
      </ul>
    )
  }
}

const Country = (props) => {
  const { countryWeather, country } = props
  if (country != null && countryWeather != null) {
    return (
      <div>
        <h2>{country.name}</h2>
        <p><b>Capital: </b>{country.capital}</p>
        <p><b>Area: </b>{country.area} m^2</p>
        <p><b>Languages:</b></p>
        <ul>
          {country.languages.map((language, i) => <li key={i}>{language}</li>)}
        </ul>
        <img src={country.flag.png} alt={country.flag.alt} />
        <h3>Weather in {country.capital}</h3>
        <p><b>Temperature: </b>{countryWeather.temp} Celcius</p>
        <img src={`https://openweathermap.org/img/wn/${countryWeather.icon}@2x.png`} alt="" />
        <p><b>Wind: </b>{countryWeather.wind} m/s</p>
      </div>
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [filter, setFilter] = useState('')
  const [countryWeather, setCountryWeather] = useState({})

  useEffect(() => {
    countriesService.getCountries().then( initialcountries => {
      const auxcountries = []
      initialcountries.data.forEach(country => {
        const aux = {
          name: country.name.common,
          location: country.capitalInfo.latlng
        }
        auxcountries.push(aux)
      });
      setCountries(auxcountries)
    })
  }, [])

  const handleCountry = (country) => {
    setFilteredCountries([])
    setFilter('')
    countriesService.getCountry(country).then(response => {
      const data = response.data
      const languages = []
      for (let language in data.languages) languages.push(data.languages[language])
      const auxcountry = {
        name: data.name.common,
        capital: data.capital,
        area: data.area,
        languages: languages,
        flag: data.flags,
        location: data.capitalInfo.latlng
      }
      setSelectedCountry(auxcountry)
    })
  }

  const handleWeather = (location) => {
    countriesService.getWeather(location).then(response => {
      const data = response.data.list
      const auxweather = {
        temp: data[0].main.temp,
        icon: data[0].weather[0].icon,
        wind: data[0].wind.speed
      }
      setCountryWeather(auxweather)
    })
  }

  const handleFilter = (event) => {
    setSelectedCountry(null)
    setCountryWeather(null)
    setFilter(event.target.value)
    const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredCountries(filteredCountries)
  }
  return ( 
    <div>
      <Filter filter={filter} handleFilter={handleFilter}></Filter>
      <Countries handleWeather={handleWeather} handleCountry={handleCountry} countries={filteredCountries}></Countries>
      <Country countryWeather={countryWeather} country={selectedCountry}></Country>
    </div>
  ) 
}

export default App
