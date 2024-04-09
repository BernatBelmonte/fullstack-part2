import axios from 'axios'
const countriesUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const countryUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name/'


const getCountries = () => {
    return axios.get(countriesUrl)
}
const getCountry = (country) => {
    return axios.get(countryUrl + country)
}
const getWeather = (location) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${location[0]}&lon=${location[1]}&appid={API (CURRENTLY HIDDEN)}`
  return axios.get(weatherUrl)
}
export default { 
  getCountries,
  getCountry,
  getWeather
}