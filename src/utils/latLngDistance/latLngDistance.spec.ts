import { getDistanceFromLatLonInKm } from './latLngDistance';

describe('getDistanceFromLatLonInKm', () => {
  it('distance between same point should be zero', () => {
    expect(getDistanceFromLatLonInKm(123, 456, 123, 456)).toEqual(0);
  });

  it('distance between different points should be greater than zero', () => {
    expect(getDistanceFromLatLonInKm(123, 456, 789, 0)).toBeGreaterThan(0);
  });
});
