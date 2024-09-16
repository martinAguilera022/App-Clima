const APP_ID = '4090239d69cdb3874de692fd18539299';

window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(posicion => {
            const { longitude: longitud, latitude: latitud } = posicion.coords;
            actualizarClimaPorCoordenadas(latitud, longitud);
        });
    }

    document.getElementById("searchButton").addEventListener("click", manejarBusqueda);
    document.getElementById("menuButton").addEventListener("click", alternarCampoBusqueda);
});

function manejarBusqueda() {
    const ciudad = document.getElementById("searchText").value;
    if (!ciudad) {
        alert('Por favor ingresa una ciudad');
        return;
    }
    actualizarClimaPorCiudad(ciudad);
}

function actualizarClimaPorCoordenadas(latitud, longitud) {
    const urlClima = obtenerUrlClimaPorCoordenadas(latitud, longitud);
    const urlPronostico = obtenerUrlPronosticoPorCoordenadas(latitud, longitud);
    const urlUV = obtenerUrlUVPorCoordenadas(latitud, longitud);

    obtenerDatosClima(urlClima);
    obtenerDatosPronostico(urlPronostico);
    obtenerDatosUV(urlUV);
    
}

function actualizarClimaPorCiudad(ciudad) {
    const urlClima = obtenerUrlClimaPorCiudad(ciudad);
    const urlPronostico = obtenerUrlPronosticoPorCiudad(ciudad);

    obtenerDatosClima(urlClima);
    obtenerDatosPronostico(urlPronostico);
}

function obtenerUrlClimaPorCoordenadas(latitud, longitud) {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&lang=es&units=metric&appid=${APP_ID}`;
}

function obtenerUrlPronosticoPorCoordenadas(latitud, longitud) {
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${latitud}&lon=${longitud}&lang=es&units=metric&appid=${APP_ID}`;
}

function obtenerUrlUVPorCoordenadas(latitud, longitud) {
    return `https://api.openweathermap.org/data/2.5/uvi?lat=${latitud}&lon=${longitud}&appid=${APP_ID}`;
}

function obtenerUrlClimaPorCiudad(ciudad) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&lang=es&units=metric&appid=${APP_ID}`;
}

function obtenerUrlPronosticoPorCiudad(ciudad) {
    return `https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&lang=es&units=metric&appid=${APP_ID}`;
}

function obtenerDatosClima(url) {
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(data => actualizarUIClima(data))
        .catch(error => console.log(error));
        
}

function obtenerDatosPronostico(url) {
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(data => actualizarUIPronostico(data))
            
        .catch(error => console.error('Error:', error));
}

function obtenerDatosUV(url) {
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(data => {
            document.getElementById('uv').textContent = `${data.value} UV `;
        })
        .catch(error => console.log(error));
}

function actualizarUIClima(data) {
    if (data.cod === "404") {
        alert('Ciudad no encontrada');
        return;
    }

    const { name: ciudad, sys: { country: pais ,sunrise : amanecer , sunset : atardecer}, main: { temp, humidity }, wind: { speed: velocidadViento }, weather } = data;
    const estadoClima = weather[0].main;
    
    document.getElementById('ubicacion').textContent = `${ciudad}, ${pais}`;
    document.getElementById('grados').textContent = `${Math.round(temp)} °C`;
    document.getElementById('vientos').textContent = `${velocidadViento} m/s`;
    document.getElementById('temperatura-descrip').textContent = weather[0].description.toUpperCase();
    document.getElementById('humedad').textContent = `${humidity} %`;
    console.log (data);
    const horaActual = new Date().getTime()/ 1000;
    const esNoche = (horaActual < amanecer || horaActual > atardecer);

    console.log (esNoche)
    console.log(horaActual)
    console.log("Actual")

    document.getElementById('icon-animado').src = obtenerIconoSegunClima(estadoClima,esNoche);



}

function actualizarUIPronostico(data) {
    const contenedorPronostico = document.querySelector('.hourly-forecast');
    contenedorPronostico.innerHTML = '';

   
    let amanecer = data.city.sunrise;
    let atardecer = data.city.sunset;
    let diaActual = new Date(data.list[0].dt * 1000).getDate(); 

    if (data.list && data.list.length > 0) {
        for (let i = 0; i < 8 && i < data.list.length; i++) {
            const entrada = data.list[i];
            const fechaPronostico = new Date(entrada.dt * 1000);
            const diaPronostico = fechaPronostico.getDate();

            
            if (diaPronostico !== diaActual) {
                diaActual = diaPronostico;
                amanecer += 86400; 
                atardecer += 86400; 
            }

            const hora = fechaPronostico.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: false  
            });

            const tempHora = Math.round(entrada.main.temp);
            const probLluvia = Math.round(entrada.pop * 100);
            const esNoche = (entrada.dt < amanecer || entrada.dt > atardecer);

          
            const iconoClima = obtenerIconoSegunClima(entrada.weather[0].main, esNoche);
            const tarjetaHora = crearTarjetaHora(hora, iconoClima, tempHora, probLluvia);
            contenedorPronostico.appendChild(tarjetaHora);
        }
    }
}


function crearTarjetaHora(hora, iconoClima, tempHora, probLluvia) {
    const tarjetaHora = document.createElement('div');
    tarjetaHora.classList.add('hour-card');
    tarjetaHora.innerHTML = `
        <p class="time">${hora}</p>
        <img src="${iconoClima}" alt="Ícono del clima">
        <p>${tempHora}°C</p>
        <div class="probLluviaHora"><img src="./img/umbrella.png" alt="Lluvia"><p>${probLluvia}%</p></div>
    `;
    return tarjetaHora;
}

function alternarCampoBusqueda() {
    document.getElementById("searchInput").classList.toggle("input-expanded");
}

function obtenerIconoSegunClima(estadoClima,esNoche) {
    if (esNoche){
        switch (estadoClima) {
            case 'Thunderstorm': return 'animated/thunder.svg';
            case 'Drizzle': return 'animated/rainy-2.svg';
            case 'Rain': return 'animated/rainy-7.svg';
            case 'Snow': return 'animated/snowy-6.svg';
            case 'Clear': return 'animated/night.svg';
            case 'Atmosphere': return 'animated/weather.svg';
            case 'Clouds': return 'animated/cloudy-night-1.svg';
            default: return 'animated/night.svg';
        }
    }
    else{
        switch (estadoClima) {
            case 'Thunderstorm': return 'animated/thunder.svg';
            case 'Drizzle': return 'animated/rainy-6.svg';
            case 'Rain': return 'animated/rainy-1.svg';
            case 'Snow': return 'animated/snowy-2.svg';
            case 'Clear': return 'animated/day.svg';
            case 'Atmosphere': return 'animated/weather.svg';
            case 'Clouds': return 'animated/cloudy-day-2.svg';
            default: return 'animated/day.svg';
        }
    }
}
