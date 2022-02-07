var cityFormEl = document.querySelector("#city-form");
var nameInputEl = document.querySelector("#cityname");
var cityButtonsEl = document.querySelector(".city-buttons");
var cityname = "";
const m = moment();
var countBtn = 0;

// today's date 
todayDate = (m.format('MM/DD/YYYY'));

var city = [];


var createCityBtn = function() {

  var cityBtn= $("<button>").addClass("btn btn"+countBtn).text(cityname);

  // append button to parent city-buttons
  $(".city-buttons").append(cityBtn);

  
  city[countBtn] = cityname;
  countBtn ++;
  localStorage.setItem("cities", JSON.stringify(city));
}

var cities = JSON.parse(localStorage.getItem("cities"));

// if nothing in localStorage, or tasks in localStorage from a diferent day
//create a new object to track all task status arrays

if (cities) {
  // if cities in localStorage create city buttons
  var i =0;
  
  // then loop over array to load tasks
  $.each(cities, function() {
          // asign values from local storage to task array
          city[i] = cities[i];
          cityname = city[i];
          createCityBtn();
          i++;
      });

  };


var displayWeather = function(weather) {

  var j =0;
  
  var currentTemp = weather.current.temp;
  var currentWind = weather.current.wind_speed;
  var currentHumid = weather.current.humidity;
  var currentUv = weather.current.uvi;
  var iconcode = weather.current.weather[0].icon;
  var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";

  
  $(".cityWeather").remove();
  $(".currentWIcon").remove();
  $(".row-weather").remove();
  var cityh3= $("<h3>").addClass("cityWeather").text(cityname+" ("+todayDate+") ");
  var cityicon = $("<img src="+iconurl+" width='70' height='70'>").addClass("currentWIcon");

  // append h3 and img to parent cityinfo
  $(".city-info").append(cityh3,cityicon);

  var citytempp = $("<p>").addClass("row-weather").text("Temp: "+currentTemp+"°F");
  var citywindp = $("<p>").addClass("row-weather").text("Wind: "+currentWind+" MPH");
  var cityhumidp = $("<p>").addClass("row-weather").text("Humidity: "+currentHumid+"%");
  var cityuvp = $("<p>").addClass("row-weather").text("UV Index: "+currentUv);

  


  // append h3 and p's to parent current
  $(".current").append(citytempp, citywindp,cityhumidp,cityuvp);


  // show 5 day forecast

  for (var i=1; i<6; i++) {
    dailyTemp = weather.daily[i].temp.day;
    dailyWind = weather.daily[i].wind_speed;
    dailyHumid = weather.daily[i].humidity;
    iconcode = weather.daily[i].weather[0].icon;
    iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";

    if (i==1) {
      $(".dailyWeather").remove();
    };

  
    cityh3= $("<div>").addClass("day"+i+" dailyWeather").text(moment().add(i, 'd').format("MM/DD/YYYY"));
    $(".daily").append(cityh3);
    cityicon = $("<img src="+iconurl+" width='70' height='70'>").addClass("dailyWIcon");
    citytempp = $("<p>").addClass("row").text("Temp: "+dailyTemp+"°F");
    citywindp = $("<p>").addClass("row").text("Wind: "+dailyWind+" MPH");
    cityhumidp = $("<p>").addClass("row").text("Humidity: "+dailyHumid+"%");
    
    // append h3 and p's to parent current
    $(".day"+i).append(cityicon,citytempp,citywindp,cityhumidp);
  }

};

var getWeather = function(cityName) {

  console.log(cityName)
  var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=1&appid=6d3a04658a097afe203f686c93219289" 

  fetch(apiUrl).then(function(response) {
    // request was successful
    if (response.ok) {
        response.json().then(function(data) {
            // pass response data to dom function

          if (data.length === 0) {
           // issueContainerEl.textContent = "This repo has no open issues!";
            return;
          } else {
            var i =0;
            var latitude = data[i].lat;
            var longitude = data[i].lon;

            var apiUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&exclude=minutely,hourly,alerts&units=imperial&appid=6d3a04658a097afe203f686c93219289"

            fetch(apiUrl2).then(function(response) {
              // request was successful
              if (response.ok) {
                 response.json().then(function(data1) {

                  if (data1.length === 0) {
                    // issueContainerEl.textContent = "This repo has no open issues!";
                     return;
                  } else 
                  {
                     displayWeather(data1);
                     
                  }

                });
              };
            });
          }
        });
    };
  });
 
};

$(".city-buttons").on("click", "button", function() {
  cityname = $(this)
  .text()
  .trim();
  console.log(cityname);
  getWeather(cityname);

});

var checkCityBtn = function(cityName) {

  var existBtn = false;
  const cityBtnEl = document.querySelectorAll(".city-buttons button");

  for (i=0; i < cityBtnEl.length; i++) {
    if (cityBtnEl[i].outerText == cityName) {
      existBtn = true;
    };
  };

  if (!existBtn) {
    createCityBtn();
  };
}

var formSubmitHandler = function(event) {
  event.preventDefault();
  // get value from input element
  cityname = nameInputEl.value.trim();

  if (cityname) {

    
    getWeather(cityname);
    // check if button with city name exists already or else create it
    checkCityBtn(cityname);

    nameInputEl.value = "";
  } else {
    alert("Please enter a city for search");
  }

};


cityFormEl.addEventListener("submit", formSubmitHandler);
//cityButtonsEl.addEventListener("click", buttonClickHandler);


