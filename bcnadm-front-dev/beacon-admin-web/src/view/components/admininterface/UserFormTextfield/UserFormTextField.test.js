import { UserFormTextfield } from 'src/view/components/admininterface/UserFormTextfield/index';
import React from 'react';
import { shallow } from 'enzyme/build';

const props = {
  label: 'label',
  meta: {
    touched: false,
    error: ''
  },
  style: ''
};

const wrapper = shallow(<UserFormTextfield {...props} />);

describe('UserFormTextfield', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
