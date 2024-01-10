import React from 'react';
import { mount, shallow } from 'enzyme';
import SearchPanel from './index';

const props = {
  onChange: jest.fn(),
  value: ''
};

const wrapper = mount(<SearchPanel {...props} />);
const shallowWrapper = shallow(<SearchPanel {...props}/>);
describe('WithSearch', () => {
  it('Should checks that props are passed properly', () =>
    expect(wrapper.props()).toEqual({
      ...props
    }));

  it('Should match snapshot', () => expect(shallowWrapper).toMatchSnapshot());
});
