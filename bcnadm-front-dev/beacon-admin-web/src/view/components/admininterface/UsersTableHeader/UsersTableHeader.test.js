import { UsersTableHeader } from 'src/view/components/admininterface/UsersTableHeader/index';
import React from 'react';
import { shallow } from 'enzyme/build/index';

const props = {
  translate: jest.fn(),
  toggleFilter: jest.fn(),
  toggleSortUsersByField: jest.fn()
};

const wrapper = shallow(<UsersTableHeader {...props} />);

describe('UsersTableHeader', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
