import { BUILDINGS_LIST } from 'src/consts/RouteConsts';
import React from 'react';
import { shallow } from 'enzyme';
import { BuildingsTableContainer } from './index';

const props = {
  translate: jest.fn(),
  showLoadingScreen: jest.fn(),
  hideLoadingScreen: jest.fn(),
  history: {
    push: jest.fn()
  },
  updated: false
};

const filteredBuildings = [{ entityId: 1 }];

const wrapper = shallow(<BuildingsTableContainer {...props} />);
const loadData = jest.spyOn(BuildingsTableContainer.prototype, 'loadData');
const showLoadingScreen = jest.spyOn(wrapper.instance().props, 'showLoadingScreen');

describe('BuildingsTableContainer', () => {
  it('Should check that props are passed properly', () => expect(wrapper.instance().props).toEqual(props));

  it('Should call showLoadingScreen', () => {
    wrapper.setProps({ updated: true });
    expect(showLoadingScreen).toHaveBeenCalledTimes(2);
  });

  it('Checks if history is called with correct arguments', () => {
    const event = {
      stopPropagation: jest.fn()
    };
    wrapper.instance().onEditClick(filteredBuildings[0])(event);

    expect(wrapper.instance().props.history.push).toHaveBeenCalledWith(
      `${BUILDINGS_LIST}/${filteredBuildings[0].entityId}`
    );
  });

  it('Should call loadData', () => expect(loadData).toHaveBeenCalled());

  it('Should match snapshot', () => expect(wrapper).toMatchSnapshot());
});
