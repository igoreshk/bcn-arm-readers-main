import React from 'react';
import { shallow } from 'enzyme';

import { UserForm } from './index';

const props = {
  currentUser: {},
  handleSubmit: jest.fn(),
  history: {},
  rolesMap: new Map(),
  translate: jest.fn(),
  valid: true
};

const wrapper = shallow(<UserForm {...props} />);

describe('UserForm', () => {
  it('Check matching snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('Check component has rendered', () => {
    expect(wrapper.length).toEqual(1);
  });
});
