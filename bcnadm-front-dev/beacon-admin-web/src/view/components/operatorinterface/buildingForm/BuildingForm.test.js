import React from 'react';
import { shallow } from 'enzyme';
import { BuildingForm } from './BuildingForm';

describe('BuildingForm', () => {
  const props = {
    translate: jest.fn(),
    closeDialog: jest.fn(),
    currentBuilding: {},
    levels: [],
    name: undefined,
    address: undefined,
    width: 0,
    height: 0,
    longitude: undefined,
    latitude: undefined,
    workingHours: undefined,
    mapImage: undefined,
    imageLink: undefined
  };

  const wrapper = shallow(<BuildingForm {...props} />);

  it('check that the necessary steps are rendered when changing buildind info', () => {
    wrapper.setState({ currentStep: 'SET_BUILDING_INFO' });
    expect(wrapper).toMatchSnapshot();
  });

  it('check that the necessary steps are rendered when changing level maps', () => {
    wrapper.setState({
      currentStep: 'SET_LEVELS_MAPS',
      currentStepIndex: 1
    });
    expect(wrapper).toMatchSnapshot();
  });
});
