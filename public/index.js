const weatherWidget = (function() {
    const body = document.getElementsByTagName("BODY")[0];
    const navbar = document.getElementById('navbar');
    const canvas = document.getElementById('iconZ');
    const mainbox = document.getElementById('mainbox');
    const button = document.getElementById("navbtn");
    const themeButton = document.getElementById("theme");
    const dailyView = document.getElementById("dailyView");
    const skycons = new Skycons({ "color": "white" });
    let requestedData;
    let daily = false;
    let theme = true;

    const enabledPosition = position => {

        button.addEventListener("click", () => {

            daily = !daily;
            if (daily) {
                dailyView.classList.remove("dailyView-closed");
                dailyView.classList.add("dailyView-opened");
                for (let i = 2; i < 7; i++) {
                    let e = requestedData[i]
                    let dailyTemp = (e.temperatureHigh - 32) * 5 / 9;
                    let newDiv = document.createElement("div");
                    newDiv.classList.add('weekly');
                    let canv = document.createElement("canvas");
                    canv.setAttribute("id", `icon${i}`);
                    canv.setAttribute("height", 50);
                    canv.setAttribute("width", 50);
                    setTimeout(() => skycons.add(`icon${i}`, e.icon), 1000)
                    let canvtxt = document.createElement("h6");
                    canvtxt.innerHTML = `${formatDate(e.time)}`;
                    let canvTemp = document.createElement("h6");
                    canvTemp.innerHTML = `${dailyTemp.toFixed(0)} °C`;
                    newDiv.appendChild(canv);
                    newDiv.appendChild(canvtxt);
                    newDiv.appendChild(canvTemp);
                    dailyView.appendChild(newDiv);
                }
            } else {
                dailyView.classList.remove("dailyView-opened");
                dailyView.classList.add("dailyView-closed");
                dailyView.innerHTML = "";
            }
        })

        themeButton.addEventListener("click", () => {
            
            font color
            theme ? body.style.backgroundColor= "#3F4551" : body.style.backgroundColor= "#878D8B"; 
            theme ? skycons.color= "black" : skycons.color= "white"; 
            theme ? mainbox.style.backgroundColor = "#878D8B" : mainbox.style.backgroundColor = "#3F4551"
            theme = !theme;            
        })


        const formatDate = t => {
            const dt = new Date(t * 1000);
            const day = dt.getDate();
            const month = dt.getMonth();
            const monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return monthArray[month] + ", " + day
        }

        const helper = jsonResponse => {

            requestedData = jsonResponse.daily.data;
            const celcius = (jsonResponse.currently.temperature - 32) * 5 / 9;
            setTimeout(() => {
                mainbox.innerHTML = `
                   <canvas id='iconZ'  width='300' height='300'></canvas>
                   <div id='mainbox-txt'> 
                    <h3> ${jsonResponse.timezone}</h3> 
                    <h3> ${formatDate(jsonResponse.currently.time)}</h3>
                    <h3> ${jsonResponse.currently.summary}, ${celcius.toFixed(0)} °C </h3>
                   </div>`;
                let icon = jsonResponse.currently.icon;
                skycons.add("iconZ", icon);
                skycons.play()
            }, 500);
        } 
                
        const myInit = {  method: "POST",
                          body: `latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`,
                          headers: {
                            "Content-Type": 'application/x-www-form-urlencoded',
                            'X-Requested-With': 'XMLHttpRequest'
                          }
                      };          
       
        fetch("/", myInit)
                .then(response => {
                    if (response.ok) {   
                      // console.log(response.text())                     
                        return response.clone().json();
                    }
                    throw new Error('failed')
                }, networkError => console.log(networkError.message))
                .then(jsonResponse => {
                    helper(jsonResponse)
                })
    }

    const disabledPosition = err => console.warn(`ERROR(${err.code}): ${err.message}`)

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(enabledPosition, disabledPosition, options);

})()

