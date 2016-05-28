/**
 * Created by NSO on 24.04.2016.
 */
var request = require("request"),
    cheerio = require("cheerio"),
    url = "http://www.wunderground.com/cgi-bin/findweather/getForecast?&query=" + 02888;


module.exports = request(url, function (error, response, body) {
    if (!error) {
        var $ = cheerio.load(body),
        temperature = $("[data-variable='temperature'] .wx-value").html();

        console.log("Температура " + temperature + " градусов по Фаренгейту.");
        return temperature;
    } else {
        console.log("Произошла ошибка: " + error);
    }
});

