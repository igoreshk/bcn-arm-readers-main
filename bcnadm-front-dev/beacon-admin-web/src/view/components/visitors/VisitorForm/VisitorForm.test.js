import React from 'react';
import { shallow } from 'enzyme';

import { VisitorForm } from './index';

const props = {
  currentVisitor: {},
  handleSubmit: jest.fn(),
  history: {},
  translate: jest.fn(),
  valid: true
};

const wrapper = shallow(<VisitorForm {...props} />);

describe('VisitorForm', () => {
  it('Check matching snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('Check component has rendered', () => {
    expect(wrapper.length).toEqual(1);
  });
});
