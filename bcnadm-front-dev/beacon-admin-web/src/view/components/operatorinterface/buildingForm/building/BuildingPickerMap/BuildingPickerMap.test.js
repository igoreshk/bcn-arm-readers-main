import React from 'react';
import { shallow } from 'enzyme';
import { BuildingPickerMap } from './BuildingPickerMap';

const MARKER_DEFAULT_LATITUDE = 59.887973;
const MARKER_DEFAULT_LONGITUDE = 30.32818;

const props = {
  setBuildingFormField: jest.fn(),
  buildingFormProps: {
    BuildingForm: {
      values: {
        latitude: MARKER_DEFAULT_LATITUDE,
        longitude: MARKER_DEFAULT_LONGITUDE
      }
    }
  }
};

const coords = {
  latLng: {
    lat: jest.fn(),
    lng: jest.fn()
  }
};

const wrapper = shallow(<BuildingPickerMap {...props} />);

describe('BuildingPickerMap', () => {
  const onMapClick = jest.spyOn(wrapper.instance(), 'onMapClick');

  it('Check onMapClick was called', () => {
    wrapper.find('.building-picker-map').simulate('click', null, null, coords);

    expect(onMapClick).toHaveBeenCalled();
  });

  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
