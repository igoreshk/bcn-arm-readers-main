import React from 'react';
import { shallow } from 'enzyme';

import { ModeButtonGroup } from './index';

const props = {
  scaleDistance: 10,
  translate: jest.fn(),
  match: {
    params: {
      layer: ''
    }
  }
};

const wrapper = shallow(<ModeButtonGroup {...props} />);

describe('mock', () => {
  it('render component', () => expect(wrapper.length).toEqual(1));
  it('snapshot for ModeButtonGroup', () => expect(wrapper).toMatchSnapshot());
});
