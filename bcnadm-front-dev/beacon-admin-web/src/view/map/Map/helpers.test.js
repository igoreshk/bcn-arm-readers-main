import { isScaleEdgeChanged } from './helpers';

const level = {
  scaleDistance: 10,
  scaleEndLatitude: 50.0006172205162,
  scaleEndLongitude: 50.00089585781095,
  scaleStartLatitude: 50.00011551393959,
  scaleStartLongitude: 50.000852942466715
};

describe('isScaleEdgeChanged function', () => {
  it('should return false if scale edge properties have not changed', () => {
    expect(isScaleEdgeChanged(level, level)).toEqual(false);
  });

  it('should return true if scale edge properties have changed', () => {
    expect(isScaleEdgeChanged(level, { ...level, scaleDistance: 9 })).toEqual(true);
    expect(isScaleEdgeChanged(level, { ...level, scaleEndLatitude: 50.0006172205161 })).toEqual(true);
    expect(isScaleEdgeChanged(level, { ...level, scaleEndLongitude: 30.00089585781095 })).toEqual(true);
    expect(isScaleEdgeChanged(level, { ...level, scaleDistance: 10.00089585781095 })).toEqual(true);
    expect(isScaleEdgeChanged(level, { ...level, scaleDistance: 50.00089585781095 })).toEqual(true);
  });
});
