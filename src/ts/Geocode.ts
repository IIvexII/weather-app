import request from 'request';
import dotenv from 'dotenv';
import { CoordinatesInterface } from './interfaces/Coords';

// Configuring variables from .env file
dotenv.config();

export class GeoCode {
  private _api: string | undefined = process.env.GEOCODE_API;
  private _baseUrl: string = `https://api.mapbox.com/geocoding/v5/mapbox.places/`;
  private _url!: string;
  private _city: string;
  private _coords!: CoordinatesInterface;

  constructor(city?: string) {
    if (city) {
      this._city = encodeURIComponent(city);
    } else {
      this._city = '';
    }
  }

  fetch() {
    request({ url: this._url, json: true }, this.setCoords.bind(this));
  }

  private buildUrl() {
    // Making URL For the request, sent to API.
    this._url = `${this._baseUrl}${this._city}.json?access_token=${this._api}`;
  }

  // callback function that will be passed to request to set the coords.
  private setCoords(error: any, response: any) {
    const feature = response.body.features[0];
    if (feature) {
      const coordinations: number[] = feature.geometry.coordinates!;

      // Setting up the coords according to interface
      const coords = {
        lon: coordinations[0],
        lat: coordinations[1],
      };
      this._coords = coords;
    } else {
      throw new Error('Sorry Could not found the city on map.');
    }
  }
}
