import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import BuildingFormContainer from './index';

const props = {
  onSubmit: jest.fn(),
  currentBuilding: {
    entityId: ''
  },
  levels: []
};

const state = {
  buildings: {
    currentStep: '',
    currentStepIndex: 0
  }
};

const mockStore = configureStore();
const wrapper = shallow(<BuildingFormContainer store={mockStore(state)} {...props} />);

describe('BuildingFormContainer', () => {
  it('check that container has child component', () => expect(wrapper.length).toEqual(1));
});
