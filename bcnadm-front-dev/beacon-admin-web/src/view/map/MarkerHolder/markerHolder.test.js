import React from 'react';
import { shallow } from 'enzyme';
import { MarkerHolder } from './index';

const props = {
  markerHandler: {},
  vertexDtoToMarker: jest.fn(),
  getDtos: jest.fn(),
  setMarkerListeners: jest.fn(),
  onMarkerCreate: jest.fn(),
  onRemoveAllMarkers: jest.fn(),
  changeEditMode: jest.fn(),
  levelNumber: 1,
  selectedMapProviderName: 'Google',
  selectedMapProvider: {},
  selectedMap: {},
  match: {
    params: { level: '60952c00d9fc0118256dc408', layer: 'scaling' }
  }
};

const wrapper = shallow(<MarkerHolder {...props} />);

describe('MarkerHolder', () => {
  it('should match snapshot', () => expect(wrapper).toMatchSnapshot());
});
