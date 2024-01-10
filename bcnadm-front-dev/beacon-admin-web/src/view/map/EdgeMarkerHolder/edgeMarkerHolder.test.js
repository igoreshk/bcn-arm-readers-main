import React from 'react';
import { shallow } from 'enzyme';
import { EdgeMarkerHolder } from './index';

const props = {
  loadMarkers: jest.fn(),
  setMapListener: jest.fn(),
  setMarkerListeners: jest.fn(),
  markerHandler: {},
  onRemoveAllMarkers: jest.fn(),
  changeEditMode: jest.fn(),
  update: true,
  levelNumber: 1,
  selectedMapProviderName: 'Google',
  selectedMapProvider: {},
  selectedMap: {},
  match: {
    params: { level: '60952c00d9fc0118256dc408', layer: 'scaling' }
  }
};

const wrapper = shallow(<EdgeMarkerHolder {...props} />);

describe('EdgeMarkerHolder', () => {
  it('should match snapshot', () => expect(wrapper).toMatchSnapshot());
});
