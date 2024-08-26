import axios from 'axios';
import { Client } from '@googlemaps/google-maps-services-js';
import { Location } from '../../database/entities/location.entity';

export const getCoordinates = async (location: Partial<Location>) => {
  if (!location) return undefined;
  try {
    const complete_address =
      location.address +
      ', ' +
      location.district +
      ', ' +
      location.city +
      ', ' +
      location.state;

    const client = new Client({});
    const result = await client.geocode({
      params: {
        key: process.env.GOOGLE_MAPS_API_KEY,
        address: complete_address,
      },
    });

    const coords = result.data.results[0].geometry.location;

    if (coords && coords.lat && coords.lng)
      return {
        latitude: coords.lat.toString(),
        longitude: coords.lng.toString(),
      };
  } catch (err) {
    console.log(err);
  }
  return {};
};

export const getCoordinatesOSM = async (location: Partial<Location>) => {
  try {
    const complete_address =
      location.address +
      ', ' +
      location.district +
      ', ' +
      location.city +
      ', ' +
      location.state;

    const result = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          format: 'jsonv2',
          dedupe: 0,
          countrycodes: 'br',
          limit: 1,
          q: complete_address,
        },
      },
    );
    const coords = result.data[0];
    if (coords && coords.lat && coords.lon)
      return { latitude: `${coords.lat}`, longitude: `${coords.lon}` };
  } catch (err) {
    console.log(err);
  }
  return {};
};
