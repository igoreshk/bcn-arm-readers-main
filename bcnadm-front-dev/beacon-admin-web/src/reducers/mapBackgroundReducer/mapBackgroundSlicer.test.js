import mapBackground, { toggleBackground } from './mapBackgroundSlice';

const defaultInitialState = {
  showMapBackground: true
};

describe('mapBackground slice', () => {
  it('should return default state', () => {
    expect(mapBackground(defaultInitialState, {})).toEqual(defaultInitialState);
  });

  const toggleBackgroundAction = {
    type: toggleBackground.type
  };
  it('should return showMapBackground equals to false', () => {
    expect(mapBackground(defaultInitialState, toggleBackgroundAction)).toEqual({ showMapBackground: false });
  });
});
