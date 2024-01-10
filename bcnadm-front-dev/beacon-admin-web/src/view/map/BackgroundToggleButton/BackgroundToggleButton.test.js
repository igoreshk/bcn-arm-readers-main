import React from 'react';
import { shallow } from 'enzyme';

import BackgroundToggleButton from 'src/view/map/BackgroundToggleButton/index';

const props = {
  showMapBackground: true,
  toggleBackground: jest.fn()
};

const wrapper = shallow(<BackgroundToggleButton {...props} />);

describe('mock', () => {
  it('render component', () => expect(wrapper.length).toEqual(1));
  it('snapshot for BackgroundToggleButton', () => expect(wrapper).toMatchSnapshot());
});
