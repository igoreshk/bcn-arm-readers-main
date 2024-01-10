import LevelsMaps from 'src/view/components/operatorinterface/buildingForm/levels/LevelsMaps/index';
import React from 'react';
import { shallow } from 'enzyme';

const props = {
  back: jest.fn(),
  closeDialog: jest.fn(),
  translate: jest.fn().mockReturnValue(''),
  allowedToProceed: true,
  handleSubmit: jest.fn(),
  isNew: true,
  levels: [],
  removeLevelField: jest.fn(),
  updateLevels: jest.fn()
};

const wrapper = shallow(<LevelsMaps {...props} />);

describe('LevelsMaps test', () => {
  it('check props matches', () => expect(wrapper.length).toEqual(1));
  it('snapshot for LevelsMaps', () => expect(wrapper).toMatchSnapshot());
  it('check if handleSubmit was called', () => {
    const handleSubmit = jest.spyOn(wrapper.instance().props, 'handleSubmit');
    wrapper.instance().handleOnSubmit();
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('State isSubmitInProgress is false when mount component', () => {
    expect(wrapper.state().isSubmitInProgress).toBeFalsy();
  });

  it('State isSubmitInProgress changes when call changeStatusOfSubmit', () => {
    wrapper.instance().changeStatusOfSubmit(true);
    expect(wrapper.state().isSubmitInProgress).toBeTruthy();
  });
});
