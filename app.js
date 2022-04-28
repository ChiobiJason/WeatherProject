const { constants } = require("buffer");
const { query } = require("express");
const express = require("express");
const { request } = require("http");
const bodyParser = require("body-parser");

const https = require("https");
const req = require("express/lib/request");

const app = express();

app.use(express.static(__dirname + "/"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html")
});

app.post("/", (request, response) => {
  const query = request.body.cityName
  const apiKey = "7a3717a5956a0d588e9030ef339afb99"
  const unit = "metric"
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  https.get(url, (res) => {
    console.log(res.statusCode);

    res.on("data", (data) => {

      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description
      const icon = weatherData.weather[0].icon
      const iconLink = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

      console.log(description);
      console.log(temp);
      response.write("<p>The weather is currently " + description + " in " + query + "</p>");
      response.write("<h1>The temperature in " + query + " is " + temp + " degrees celsius.</h1>");
      response.write("<img src=" + iconLink + ">");
      response.send();
    });

  });
})



app.listen(3000, (request, response) => {
  console.log("Server running on port 3000");
})