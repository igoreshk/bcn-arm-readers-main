import React from 'react';
import { shallow } from 'enzyme';

import { ModeButton } from './index';

const props = {
  icon: <div />,
  link: 'link',
  onClick: jest.fn(),
  buttonId: 'buttonId',
  tooltip: 'tooltip',
  buttonType: 'buttonType',
  active: true
};

const wrapper = shallow(<ModeButton {...props} />);

describe('mock', () => {
  it('render component', () => expect(wrapper.length).toEqual(1));
  it('snapshot for ModeButton', () => expect(wrapper).toMatchSnapshot());
});
