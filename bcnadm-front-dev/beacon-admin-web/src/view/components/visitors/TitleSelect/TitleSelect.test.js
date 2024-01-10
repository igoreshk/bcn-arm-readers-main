import React from 'react';
import { shallow } from 'enzyme';
import TitleSelect from '../TitleSelect';

const translate = jest.fn((arg) => arg);

const propsZeroVisitors = {
  listOfVisitors: [],
  translate
};

const propsOneVisitor = {
  listOfVisitors: [
    {
      name: 'George'
    }
  ],
  translate
};

const propsTwoVisitors = {
  listOfVisitors: [
    {
      name: 'George'
    },
    {
      name: 'Alex'
    }
  ],
  translate
};

const propsFiveVisitors = {
  listOfVisitors: [],
  translate
};
propsFiveVisitors.listOfVisitors.length = 5;

const propsTwentyOneVisitors = {
  listOfVisitors: [],
  translate
};
propsTwentyOneVisitors.listOfVisitors.length = 21;

describe('TitleSelect', () => {
  it('should return initial title', () => {
    const wrapper = shallow(<TitleSelect {...propsZeroVisitors} />);
    const span = wrapper.find('.placeholder');
    expect(span.text()).toBe('monitoring.selectVisitors');
  });

  it('should return title with name of visitor', () => {
    const wrapper = shallow(<TitleSelect {...propsOneVisitor} />);
    const span = wrapper.find('.placeholder');
    expect(span.text()).toBe('George');
  });

  it('should return correct title with second variant of translate', () => {
    const wrapper = shallow(<TitleSelect {...propsTwoVisitors} />);
    const span = wrapper.find('.placeholder');
    expect(span.text()).toBe('monitoring.numberOfSelectedVisitorsSecondVariant');
  });

  it('should return correct title with first variant of translate', () => {
    const wrapper = shallow(<TitleSelect {...propsTwentyOneVisitors} />);
    const span = wrapper.find('.placeholder');
    expect(span.text()).toBe('monitoring.numberOfSelectedVisitorsFirstVariant');
  });

  it('should return correct title with third variant of translate', () => {
    const wrapper = shallow(<TitleSelect {...propsFiveVisitors} />);
    const span = wrapper.find('.placeholder');
    expect(span.text()).toBe('monitoring.numberOfSelectedVisitorsThirdVariant');
  });
});
