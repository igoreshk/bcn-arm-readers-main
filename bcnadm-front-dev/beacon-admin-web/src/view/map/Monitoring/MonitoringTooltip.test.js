import React from 'react';
import { shallow } from 'enzyme';

import { MonitoringTooltip } from './MonitoringTooltip';

const props = {
  translate: jest.fn(),
  marker: {
    visitorId: 123,
    firstName: 'Mikle',
    lastName: 'Prog'
  }
};

describe('MonitoringTooltip', () => {
  const wrapper = shallow(<MonitoringTooltip {...props} />);

  it('renders', () => expect(wrapper.exists()).toBe(true));

  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
