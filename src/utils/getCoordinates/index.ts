import axios from 'axios';
import { Location } from 'src/database/entities/location.entity';

export const getCoordinates = async (location: Partial<Location>) => {
  if (!location) return undefined;
  try {
    const complete_address =
      location.address +
      ' ' +
      location.district +
      ' ' +
      location.city +
      ' ' +
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
      return { latitude: coords.lat, longitude: coords.lon };
  } catch (err) {
    console.error(err);
  }
  return undefined;
};
