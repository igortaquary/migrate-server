import { Location } from '../../database/entities/location.entity';
import { getCoordinates, getCoordinatesOSM } from '.';
import { Client } from '@googlemaps/google-maps-services-js';
import axios from 'axios';

jest.mock('@googlemaps/google-maps-services-js');
jest.mock('axios');

const locationMock: Omit<Location, 'latitude' | 'longitude'> = {
  address: 'address',
  city: 'city',
  country: 'country',
  district: 'district',
  state: 'state',
  id: '123',
  zipCode: 'zipCode',
};

const mockGeocodeResult = {
  data: {
    results: [
      {
        geometry: {
          location: {
            lat: 123,
            lng: 456,
          },
        },
      },
    ],
  },
};

describe('getCoordinates', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('if not location should return undefined', async () => {
    expect(await getCoordinates(null)).toBeUndefined();
  });

  it('should return latitude and longitude from google geocode', async () => {
    (Client as jest.Mock).mockImplementation(() => ({
      geocode: () => mockGeocodeResult,
    }));

    expect(await getCoordinates(locationMock)).toEqual({
      latitude: '123',
      longitude: '456',
    });
  });

  it('should return {} if error', async () => {
    (Client as jest.Mock).mockImplementation(() => ({
      geocode: () => {
        throw new Error();
      },
    }));
    expect(await getCoordinates(locationMock)).toEqual({});
  });
});

const OSMResultMock = {
  data: [
    {
      lat: 123,
      lon: 456,
    },
  ],
};

describe('getCoordinatesOSM', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('return {} if error', async () => {
    expect(await getCoordinatesOSM(null)).toEqual({});
  });

  it('should return latitude and longitude from nominatim openstreetmap', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue(OSMResultMock);
    expect(await getCoordinatesOSM(locationMock)).toEqual({
      latitude: '123',
      longitude: '456',
    });
  });
});
