import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import ConnectedFloorChooser from './index';

describe('mock', () => {
  const initialState = {
    loadMap: {
      curLevelsArray: [1, 2, 3],
      curBuilding: 'curBuilding',
      curLevel: 5
    },
    googleMap: {
      map: {}
    }
  };
  const mockStore = configureStore();
  let store;
  let container;

  beforeEach(() => {
    store = mockStore(initialState);
    container = shallow(<ConnectedFloorChooser store={store} />);
  });

  it('render connected(SMART) component', () => {
    expect(container.length).toEqual(1);
  });

  // it('check props matches initialState', () => {
  //     expect(container.prop('level')).toEqual(initialState.loadMap.curLevel);
  //     expect(container.prop('buildingId')).toEqual(initialState.loadMap.curBuilding);
  //     expect(container.prop('levelsArray')).toEqual(initialState.loadMap.curLevelsArray);
  // });
});
