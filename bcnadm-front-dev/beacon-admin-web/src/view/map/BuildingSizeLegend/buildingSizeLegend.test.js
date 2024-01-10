import React from 'react';
import { shallow } from 'enzyme';
import { BuildingSizeLegend } from './index';

const props = {
  width: 200,
  height: 150,
  translate: jest.fn()
};

const wrapper = shallow(<BuildingSizeLegend {...props} />);

describe('BuildingSizeLegend', () => {
  it('should match snapshot', () => expect(wrapper).toMatchSnapshot());
});
