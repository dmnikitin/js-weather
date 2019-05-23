const weatherWidget = (function() {
    const mainbox = document.getElementById('mainbox');
    const dailyViewButton = document.getElementById('dailyViewButton');
    const themeButton = document.getElementById('themeButton');
    const dailyViewBox = document.querySelector('.dailyViewBox');
    const skycons = new Skycons({ color: 'white' });
    let requestedData; // api.daily.data will be stored here
    let dailyView = false; // appearance of dailyViewBox
    let theme = true; // toggle used theme

    const htmlElementCreator = (...args) => args.map(e => document.createElement(e));
    const setAttributes = (el, attrs) => {
        for (let key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                el.setAttribute(key, attrs[key]);
            }
        }
    };
    const toCelcius = val => (val - 32) * 5 / 9;
    const formatDate = t => {
        const dt = new Date(t * 1000);
        const day = dt.getDate();
        const month = dt.getMonth();
        const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${monthArray[month]}, ${day}`;
    }

    const enabledPosition = position => {
        dailyViewButton.addEventListener('click', () => {
            dailyView = !dailyView;
            dailyViewBox.classList.toggle('dailyViewBox-opened');
            if (dailyView) {
                for (let i = 2; i < 7; i++) {
                    const e = requestedData[i] || {};
                    const [newDiv, canv, canvTxt, canvTemp] = htmlElementCreator('div', 'canvas', 'h6', 'h6') || [];
                    newDiv.classList.add('weekly');
                    setAttributes(canv, { id: `icon${i}`, height: 50, width: 50 });
                    setTimeout(() => skycons.add(`icon${i}`, e.icon), 1000);
                    canvTxt.textContent = `${formatDate(e.time)}`;
                    canvTemp.textContent = `${toCelcius(e.temperatureHigh).toFixed(0)} °C`;
                    newDiv.append(canv, canvTxt, canvTemp);
                    dailyViewBox.appendChild(newDiv);
                }
            } else {
                dailyViewBox.innerHTML = '';
            }
        });

        themeButton.addEventListener('click', () => {
            theme ? document.body.style.backgroundColor = '#3F4551' : document.body.style.backgroundColor = '#878D8B';
            theme ? skycons.color = 'black' : skycons.color = 'white';
            theme ? mainbox.style.backgroundColor = '#878D8B' : mainbox.style.backgroundColor = '#3F4551';
            theme ? dailyViewBox.style.backgroundColor = '#CAC8BB' : dailyViewBox.style.backgroundColor = '#363636';
            theme ? mainbox.style.color = 'black' : mainbox.style.color = 'white'
            theme ? dailyViewBox.style.color = 'black' : dailyViewBox.style.color = 'white'
            theme = !theme;
        });
        const helper = jsonResponse => {
            const { timezone, daily: { data }, currently: { time, summary, temperature, icon } } = jsonResponse;
            requestedData = data; // to have access to api.daily.data outside of helper function
            setTimeout(() => {
                const [canv, newDiv, timezoneHTML, currentTimeHTML, summaryHTML] = htmlElementCreator('canvas', 'div', 'h3', 'h3', 'h3');
                setAttributes(canv, { id: 'mainWeatherIcon', height: 300, width: 300 });
                newDiv.setAttribute('id', 'mainbox-txt');
                timezoneHTML.textContent = timezone;
                currentTimeHTML.textContent = formatDate(time);
                summaryHTML.textContent = `${summary}, ${toCelcius(temperature).toFixed(0)} °C `;
                newDiv.append(timezoneHTML, currentTimeHTML, summaryHTML);
                mainbox.innerHTML = '';
                mainbox.append(canv, newDiv);
                skycons.add('mainWeatherIcon', icon);
                skycons.play();
            }, 500);
        };

        const myInit = {
            method: 'POST',
            body: `latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
            },
        };
        fetch('/', myInit)
            .then((response) => {
                if (response.ok) {
                    return response.clone().json();
                }
                throw new Error('failed');
            }, networkError => console.log(networkError.message))
            .then((jsonResponse) => {
                helper(jsonResponse);
            });
    };
    const disabledPosition = err => console.warn(`ERROR(${err.code}): ${err.message}`);
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(enabledPosition, disabledPosition, options);
})();
