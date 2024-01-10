import React from 'react';
import { shallow } from 'enzyme';

import { VisitorsTable } from './index';

const props = {
  translate: jest.fn(),
  showLoadingScreen: jest.fn(),
  hideLoadingScreen: jest.fn(),
  history: {},
  updated: false
};

const wrapper = shallow(<VisitorsTable {...props} />);

describe('VisitorsTable', () => {
  const loadData = jest.spyOn(VisitorsTable.prototype, 'loadData');
  const showLoadingScreen = jest.spyOn(wrapper.instance().props, 'showLoadingScreen');

  it('Checks that props are passed properly', () => expect(wrapper.instance().props).toEqual(props));

  it('Check showLoadingScreen was called from componentWillMount and componentDidUpdate life hooks', () => {
    wrapper.setProps({ updated: true });
    expect(showLoadingScreen).toHaveBeenCalledTimes(2);
  });

  it('Check loadData was called from componentDidUpdate life hook', () => expect(loadData).toHaveBeenCalled());

  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
