import React from 'react';
import { shallow } from 'enzyme/build';
import LevelsDropzones from './LevelsDropzones';

const props = {
  changeStatusOfSubmit: jest.fn(),
  translate: jest.fn(),
  updateLevels: jest.fn(),
  removeLevelField: jest.fn(),
  levels: [{ number: 1 }, { number: 2 }]
};

const wrapper = shallow(<LevelsDropzones {...props} />);

describe('Testing LevelsDropzone', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());

  it('checkValueForUnique will be call with correct arguments when call changeLevelNumber', () => {
    const checkValueForUnique = jest.spyOn(wrapper.instance(), 'checkValueForUnique');
    wrapper.instance().changeLevelNumber(1, 1);
    expect(checkValueForUnique).toHaveBeenCalledWith(1, 0);
  });

  it('changeStatusOfSubmit will be called when call changeLevelNumber', () => {
    const changeStatusOfSubmit = jest.spyOn(wrapper.instance().props, 'changeStatusOfSubmit');
    wrapper.instance().changeLevelNumber(1, 1);
    expect(changeStatusOfSubmit).toHaveBeenCalled();
  });

  it('checkValueForUnique will be called when rendering', () => {
    const checkValueForUnique = jest.spyOn(wrapper.instance(), 'checkValueForUnique');
    expect(checkValueForUnique).toHaveBeenCalled();
  });

  it('updateLevels will be called with correct argument', () => {
    const updateLevels = jest.spyOn(wrapper.instance().props, 'updateLevels');
    wrapper.instance().changeLevelNumber(1, 1);
    expect(updateLevels).toHaveBeenNthCalledWith(1, [{ number: 1 }, { number: 1 }]);
    expect(updateLevels).toHaveBeenNthCalledWith(2, [{ number: 1 }, { number: 1 }]);
  });
});
