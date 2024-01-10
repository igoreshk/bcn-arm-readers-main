import { calculatePixelsPerMeter } from './helpers';

describe('OSMap helpers tests', () => {
  const map = {
    latLngToLayerPoint: jest
      .fn()
      .mockReturnValueOnce({ x: 716, y: 210 })
      .mockReturnValueOnce({ x: 1125, y: 127 })
  };
  const currentLevel = {
    scaleStartLatitude: 59.888661046666236,
    scaleStartLongitude: 30.326315760612488,
    scaleEndLatitude: 59.88888651067054,
    scaleEndLongitude: 30.328509944346113,
    scaleDistance: 0
  };
  const distance = { scaleDistance: 50 };

  it('should return 10 pixels per meter if distance is not set', () => {
    expect(calculatePixelsPerMeter(map, currentLevel)).toEqual(10);
  });

  it('should return 8.346735888956832 pixels per meter', () => {
    expect(calculatePixelsPerMeter(map, { ...currentLevel, ...distance })).toEqual(8.346735888956832);
  });
});
