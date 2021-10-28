// API
class Forcast{
    constructor(){
        this.apiKey='dFJrcdmmL9mGCmqeIimEAYYe5uQvsH6v' // Get your API key at 'https://developer.accuweather.com/'
        this.weatherURI='https://dataservice.accuweather.com/currentconditions/v1/'
        this.cityURI='https://dataservice.accuweather.com/locations/v1/cities/search'
    }

    async updateCity(city){
        const cityData = await this.getCity(city)
        const weather = await this.getWeather(cityData.Key)
        return { cityData,weather }
    }

    async getCity(city){
        const query= `?apikey=${this.apiKey}&q=${city}`
        const response =await fetch(this.cityURI+query)
        const data = await response.json()
        return data[0]
    }

    async getWeather(key){
        const query =`${key}?apikey=${this.apiKey}`
        const response =await fetch(this.weatherURI+query)
        const data = await response.json()    
        return data[0]

    }
}

// DOM 
const input = document.querySelector('.weather .change-location')
const details =document.querySelector('.weather .details')
const forcast = new Forcast()


const updateUI=(data)=>{
    //destructure properties
    const {cityData,weather}=data;
    console.log(data)

    //update details template
    details.innerHTML=`
        <h2 class="my-3">
        ${cityData.EnglishName},${cityData.Country.EnglishName}
        </h2>
        <div class="my-3">${weather.WeatherText}</div>
        <div class="display-4 my-4">
            <span>${weather.Temperature.Metric.Value}</span>
            <span>&deg;C</span>
        </div>
    `
}

input.addEventListener('submit',(e)=>{
    
    e.preventDefault()
    const city=input.city.value.trim()
    localStorage.setItem('city',city)
    input.reset()
    input.city.blur()
    forcast.updateCity(city).then(data => updateUI(data))
                    .catch(err => console.log(err))
})

if(localStorage.getItem('city')) {
    forcast.updateCity(localStorage.getItem('city'))
        .then(data => updateUI(data))
        .catch(err => console.log(err))
}
