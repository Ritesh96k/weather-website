import express from "express";
import axios from "axios";
import path from "path";
import bodyParser from "body-parser";


const app = express();
const port = 3000;
app.set("view engine", "ejs");
const APIkey='5c7d72b3d84a90bfb47b527e0df5e97a';
const city = "tokyo";//this is for default city when u start the website

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
function getMonthName(monthNumber){
    const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
     return months[monthNumber];
}
function getWeatherIconName(weatherCondition) {
    const iconMap = {
        Clear: "wb_sunny",
        Clouds: "wb_cloudy",
        Rain: "umbrella",
        Thunderstorm: "flash_on",
        Drizzle: "grain",
        Snow: "ac_unit",
        Mist: "cloud",
        Smoke: "cloud",
        Haze: "cloud",
        Fog: "cloud",
    };

    return iconMap[weatherCondition] || "help";
}

const currentDate = new Date();
const formattedDate = `${getMonthName(currentDate.getMonth())} ${currentDate.getDate()}, ${currentDate.getFullYear()} `

app.get("/", async(req,res)=>{
     try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`);

        const result = response.data;
        const weatherIcon =getWeatherIconName(result.weather[0].main);
        console.log(weatherIcon);
        res.render("index.ejs", { result: result, currentDate:formattedDate, Cweathericon:weatherIcon });
        
      } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
          error: error.message,
        });
      }
    });

    app.post("/", async (req, res) => {
        try { 
        const city = req.body.cityName;
        const response = await axios.get(      
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`
        );

        const result = response.data;
        const temperature = Math.round(result.main.temp);
        const wind = result.wind.speed;
        const humidity = result.main.humidity;
        const visibility = (result.visibility)/1000;
        const weatherIcon =getWeatherIconName(result.weather[0].main);

        res.render("index.ejs",{result:result, currentDate:formattedDate,  Cweathericon:weatherIcon});

        console.log(result);
        console.log(`City Name is ${city}`);
        console.log(`Temprature is ${temperature}°C`);
        console.log(`wind Speed is ${wind}Km/hr`);
        console.log(`Humidity is ${humidity}%`);
        console.log(`Visibility is ${visibility} meter`);       
        console.log(`Weather is ${weatherIcon}`);
        
       } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs",{
          error:"No activities that match your criteria.",
        });
      }
      });


app.listen(port,(req,res)=>{
    console.log(`Listining on port ${port}`)
});
