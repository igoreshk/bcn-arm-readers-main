import React from 'react';
import { shallow } from 'enzyme';

import BuildingInfoForm from './index';

const props = {
  translate: jest.fn().mockReturnValue(''),
  next: jest.fn(),
  allowedToProceed: true,
  goTo: jest.fn(),
  setBuildingToEdit: jest.fn(),
  closeDialogForm: jest.fn(),
  isBuildingInitialized: true,
  toggleEdited: jest.fn(),
  imageLink: 'imageLink',
  type: 'number',
  closeDialog: jest.fn()
};

const wrapper = shallow(<BuildingInfoForm {...props} />);

describe('BuildingInfoForm test', () => {
  it('check props matches', () => expect(wrapper.length).toEqual(1));
  it('snapshot for BuildingInfoForm', () => expect(wrapper).toMatchSnapshot());
});
