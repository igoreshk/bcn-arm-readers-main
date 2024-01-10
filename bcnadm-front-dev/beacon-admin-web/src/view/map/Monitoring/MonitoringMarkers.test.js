import React from 'react';
import { shallow } from 'enzyme';

import { MonitoringMarkers } from './MonitoringMarkers';

const props = {
  translate: jest.fn()
};

describe('MonitoringMarkers', () => {
  const wrapper = shallow(<MonitoringMarkers {...props} />);

  it('renders', () => expect(wrapper.exists()).toBe(true));

  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
