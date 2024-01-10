import React from 'react';
import { shallow } from 'enzyme';

import ActionButtonsGroup from './index';

const props = {
  translate: jest.fn(),
  clear: jest.fn()
};

const wrapper = shallow(<ActionButtonsGroup {...props} />);

describe('mock', () => {
  it('render component', () => expect(wrapper.length).toEqual(1));
  it('snapshot for ActionButtonsGroup', () => expect(wrapper).toMatchSnapshot());
});
