const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.set("view engine","ejs");
app.use(express.static("Public"));
app.use(bodyParser.urlencoded({extended: true}));

let temp = 0;
let tempMax = 0;
let tempMin = 0;
let humidity = 0;
let windSpeed = 0;
let tempFeelsLike = 0;
let weatherDesc = "";
let iconUrl = "";
let city = "";
let degree = "";

app.get("/", function (req,res){

    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res){

    var query = req.body.city;
    if(req.body.temp == "celcius")
    {
        var unit = "metric";
        degree = "C";
    }
    else
    {
        var unit = "imperial";
        degree = "F";
    }

    const apiKey = "appid=a3ad1564f98f054cb67f05cb52f79a0a";
    const endPoint = "https://api.openweathermap.org/data/2.5/weather?";

    var url = endPoint + apiKey + "&" + "q=" + query + "&" + "units=" + unit;
    city = query.charAt(0).toUpperCase() + query.slice(1);

    https.get(url, function(response){
        console.log("statusCode:",response.statusCode);
        
        response.on("data", function(data){

            const weatherData = JSON.parse(data);

            iconUrl = "images/" + weatherData.weather[0].icon + "@2x.png";
            //iconUrl = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";

            weatherDesc = weatherData.weather[0].description;
            var words = weatherDesc.split(" ");
            weatherDesc = "";
            for(let i = 0; i < words.length; i++)
            {
                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
                weatherDesc += words[i] + " ";
            }

            temp = weatherData.main.temp;
            tempMax = weatherData.main.temp_max;
            tempMin = weatherData.main.temp_min;
            humidity = weatherData.main.humidity;                // percent
            windSpeed = weatherData.wind.speed;                  // meter/sec
            tempFeelsLike = weatherData.main.feels_like;
            
            res.redirect("/result");
        });
    });
});

app.get("/result", function(req,res){

    res.render("result.ejs", {

        temp: temp,
        tempMax: tempMax,
        tempMin: tempMin,
        humidity: humidity,
        windSpeed: windSpeed,
        tempFeelsLike: tempFeelsLike,
        weatherDesc: weatherDesc,
        iconUrl: iconUrl,
        city: city,
        degree: degree
    });
});

app.post("/result", function(req,res){

    res.redirect("/");
});

app.listen(3000, function (){
    console.log("Server Running on Server 3000");
});

// set NODE_TLS_REJECT_UNAUTHORIZED=0