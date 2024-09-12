const APP_ID = '4090239d69cdb3874de692fd18539299';

window.addEventListener('load', () => {
    let long;
    let lat;

    let ubicacion = document.getElementById('ubicacion');
    let grados = document.getElementById('grados');
    let iconoAnimado  = document.getElementById('icon-animado');
    let temperaturaDescrip = document.getElementById('temperatura-descrip');
    let vientos = document.getElementById('vientos')    
    let humedad = document.getElementById('humedad')
    let uvIndice = document.getElementById('uv')
    
    const hourlyForecastContainer = document.querySelector('.hourly-forecast'); // Contenedor donde se agregarán las tarjetas


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            
            
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&lang=es&units=metric&appid=${APP_ID}`;
            const url2 =`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&lang=es&units=metric&appid=${APP_ID}`;
            const uv = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${long}&appid=${APP_ID}`

            fetch(uv)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                uvIndice.textContent =`${data.value} UV `

                
            })
            .catch(error => {
                console.log(error);
            });

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data);

                    let pais = data.sys.country;
                    let ciudad = data.name;

                    ubicacion.textContent = `${ciudad}, ${pais}`;
                    let temp = Math.round(data.main.temp);
                    grados.textContent = `${temp} °C`;
                    vientos.textContent = `${(data.wind.speed)} m/s`
                    temperaturaDescrip.textContent = (data.weather[0].description).toUpperCase();
                    humedad.textContent = `${(data.main.humidity)} %`
                    
                    console.log(data.weather[0].main)
                    
                    switch (data.weather[0].main) {
                        case 'Thunderstorm':
                            iconoAnimado.src = 'animated/thunder.svg';
                            break;
                        case 'Drizzle':
                            iconoAnimado.src = 'animated/rainy-2.svg';
                            break;
                        case 'Rain':
                            iconoAnimado.src = 'animated/rainy-7.svg';
                            break;
                        case 'Snow':
                            iconoAnimado.src = 'animated/snowy-6.svg';
                            break;
                        case 'Clear':
                            iconoAnimado.src = 'animated/day.svg';
                            break;
                        case 'Atmosphere':
                            iconoAnimado.src = 'animated/weather.svg';
                            break;
                        case 'Clouds':
                            iconoAnimado.src = 'animated/cloudy.svg';
                            break;
                        default:
                            iconoAnimado.src = 'animated/day.svg';
                    }
                })
                .catch(error => {
                    console.log(error);
                });

                fetch(url2)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);

                        if (data.list && data.list.length > 0) {
                            hourlyForecastContainer.innerHTML = '';
                
                            for (let i = 0; i < 8; i++) {
                                if (i < data.list.length) {
                                    const entry = data.list[i]; // El pronóstico cada 3 horas
                                    const time = new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Hora en formato legible
                                    const tempHora = Math.round(entry.main.temp); // Temperatura
                                    const iconSrc = getIconSrc(entry.weather[0].main); // Obtener ícono correspondiente
                                    const probLluvia =Math.round((entry.pop)*100) // Probabilidad de lluvia en porcentaje
                                    // Crear el nuevo elemento de tarjeta
                                    const hourCard = document.createElement('div');
                                    hourCard.classList.add('hour-card');
                                    hourCard.innerHTML = `
                                        <p class="time">${time}</p>
                                        <img src="${iconSrc}" alt="Ícono del clima">
                                        <p>${tempHora}°C</p>
                                        <div class= "probLluviaHora"><img src="./img/umbrella.png" alt="Lluvia"><p>${probLluvia}%</p></div>
                                    `;

                                    // Agregar la tarjeta al contenedor
                                    hourlyForecastContainer.appendChild(hourCard);
                            }
                        }
                    }
                })
                .catch(error => console.error('Error:', error));
          
        });
    }


    document.getElementById("searchButton").addEventListener("click", function() {
        // Obtiene el valor del input
       const cityName = document.getElementById("searchText").value;
   
        // Si no hay ciudad ingresada, no hacer nada
        if (!cityName) {
            alert('Por favor ingresa una ciudad');
            return;
        }
    
        // URLs para obtener el clima actual y el pronóstico
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=es&units=metric&appid=${APP_ID}`;
        const url2 = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&lang=es&units=metric&appid=${APP_ID}`;
    
        // Obtener clima actual
        fetch(url)
           .then(response => response.json())
           .then(data => {
               console.log(data);
   
               if (data.cod === "404") {
                   alert('Ciudad no encontrada');
                   return;
               }
    
               let pais = data.sys.country;
               let ciudad = data.name;
    
               document.getElementById('ubicacion').textContent = `${ciudad}, ${pais}`;
               let temp = Math.round(data.main.temp);
               document.getElementById('grados').textContent = `${temp} °C`;
               document.getElementById('vientos').textContent = `${(data.wind.speed)} m/s`;
               document.getElementById('temperatura-descrip').textContent = (data.weather[0].description).toUpperCase();
               document.getElementById('humedad').textContent = `${(data.main.humidity)} %`;
               
               iconoAnimado.src = getIconSrc(data.weather[0].main);
               console.log(iconoAnimado)
            })
            .catch(error => console.log(error));
            fetch(url2)
                .then(response => response.json())
            .   then(data => {
                console.log(data);
     
                const hourlyForecastContainer = document.querySelector('.hourly-forecast');
                hourlyForecastContainer.innerHTML = '';
     
                if (data.list && data.list.length > 0) {
                    for (let i = 0; i < 8; i++) {
                        if (i < data.list.length) {
                             const entry = data.list[i]; // Pronóstico cada 3 horas
                             const time = new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                             const tempHora = Math.round(entry.main.temp);
                             const iconSrc = getIconSrc(entry.weather[0].main);
                             const probLluvia = Math.round(entry.pop * 100);
     
                             // Crear tarjeta de pronóstico
                             const hourCard = document.createElement('div');
                             hourCard.classList.add('hour-card');
                             hourCard.innerHTML = `
                                 <p class="time">${time}</p>
                                 <img src="${iconSrc}" alt="Ícono del clima">
                                 <p>${tempHora}°C</p>
                                 <div class="probLluviaHora"><img src="./img/umbrella.png" alt="Lluvia"><p>${probLluvia}%</p></div>
                             `;
     
                             // Agregar tarjeta al contenedor
                             hourlyForecastContainer.appendChild(hourCard);
                         }
                     }
                 }
             })
             .catch(error => console.error('Error:', error));
     });
      

});

document.getElementById("menuButton").addEventListener("click", function() { 
    const inputField = document.getElementById("searchInput");
    inputField.classList.toggle("input-expanded");




});

 

function getIconSrc(weatherMain) {
  console.log(weatherMain)
  switch (weatherMain) {
      case 'Thunderstorm':
          return 'animated/thunder.svg';
      case 'Drizzle':
          return 'animated/rainy-2.svg';
      case 'Rain':
          return 'animated/rainy-7.svg';
      case 'Snow':
          return 'animated/snowy-6.svg';
      case 'Clear':
          return 'animated/day.svg';
      case 'Atmosphere':
          return 'animated/weather.svg';
      case 'Clouds':
          return 'animated/cloudy.svg';
      default:
          return 'animated/day.svg';
  }
}
