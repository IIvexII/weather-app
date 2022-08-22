import request from 'request';
import dotenv from 'dotenv';

// Importing interfaces
import { CoordinatesInterface } from '../interfaces/Coords';
import { WeatherData } from '../interfaces/Weather';
import { rejects } from 'assert';

// Configuring variables from .env file
dotenv.config();

export class Weather {
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5/weather?';
  private url!: string;
  private _weather!: WeatherData;

  async fetch(coords: CoordinatesInterface) {
    this.buildUrl(coords);
    const res = await this.request();

    // set the weather accrding to the response
    this.setWeather(res);

    return this._weather;
  }
  request() {
    return new Promise((resolve: any, reject: any) => {
      request({ url: this.url, json: true }, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          resolve(body);
        } else {
          reject(error);
        }
      });
    });
  }

  private buildUrl(coords: CoordinatesInterface) {
    this.url = `${this.baseUrl}lat=${coords.lat}&lon=${coords.lon}&appid=${process.env.WEATHER_API}&units=metric`;
  }
  // Callback function that will be passed to request function.
  private setWeather(response: any) {
    // Extracting weather data from response body
    const weather = response;

    if (weather.message) {
      this._weather = {
        error: weather.message,
      };
    } else {
      this._weather = {
        country_tag: weather.sys.country,
        area: weather.name,
        status: weather.weather[0].description,
        temprature: weather.main.temp,
        humidity: weather.main.humidity,
        visibility: +weather.visibility / 1000,
      };
    }
  }
}