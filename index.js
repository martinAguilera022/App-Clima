
const APP_ID = '4090239d69cdb3874de692fd18539299';


window.addEventListener('load',()=>{
    let long;
    let lat;

    let ubicacion = document.getElementById('ubicacion');
    let grados = document.getElementById('grados');
    let iconoAnimado  = document.getElementById('icon-animado')
    let temperaturaDescrip = document.getElementById('temperatura-descrip') 
    let sensacionTermica = document.getElementById('sensacion-termica')
    let tempMax = document.getElementById('temp-max')
    let tempMin= document.getElementById('temp-min')
    let vientos = document.getElementById('vientos')
    let humedad = document.getElementById('humedad')
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition( position =>{
            long = position.coords.longitude;
            lat = position.coords.latitude;
        

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&lang=es&units=metric&appid=${APP_ID}`

            fetch(url)
                .then ( response => { return response.json () })
                .then ( data => {
                    console.log (data)

                   
                    // let iconCode = data.weather[0].icon
    	            // let urlIcon = `https://openweathermap.org/img/wn/${iconCode}.png`
                    // console.log(urlIcon)
                    let pais = (data.sys.country)
                    let ciudad = (data.name)

                    
                    ubicacion.textContent = (`${ciudad} , ${pais}`)
                  
                    let temp = Math.round(data.main.temp)
                    grados.textContent = `${temp} °C`
                    sensacionTermica.textContent = Math.round(data.main.feels_like)+" °C "
                    temperaturaDescrip.textContent =(data.weather[0].description).toUpperCase()
                    
                    tempMin.textContent = `${Math.round(data.main.temp_min)} °C`
                    
                    tempMax.textContent =`${Math.round(data.main.temp_max)} °C`
                   
                    vientos.textContent = `${(data.wind.speed)} m/s`
                    humedad.textContent = `${(data.main.humidity)}%`

                    // iconos 

                    console.log(data.weather[0].main)
                    switch (data.weather[0].main) {
                        case 'Thunderstorm':
                          iconoAnimado.src='animated/thunder.svg'
                          console.log('TORMENTA');
                          break;
                        case 'Drizzle':
                          iconoAnimado.src='animated/rainy-2.svg'
                          console.log('LLOVIZNA');
                          break;
                        case 'Rain':
                          iconoAnimado.src='animated/rainy-7.svg'
                          console.log('LLUVIA');
                          break;
                        case 'Snow':
                          iconoAnimado.src='animated/snowy-6.svg'
                            console.log('NIEVE');
                          break;                        
                        case 'Clear':
                            iconoAnimado.src='animated/day.svg'
                            console.log('LIMPIO');
                          break;
                        case 'Atmosphere':
                            iconoAnimado.src='animated/weather.svg'
                            console.log('ATMOSFERA');
                            break;  
                        case 'Clouds':
                            iconoAnimado.src='animated/cloudy.svg'
                            console.log('NUBES');
                            break;  
                        default:
                          iconoAnimado.src='animated/cloudy-day-1.svg'
                          console.log('por defecto');
                      }
                })
                .catch ( error =>{
                    console.log(error)
                })
        
        })
    }
})