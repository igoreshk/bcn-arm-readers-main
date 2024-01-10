import React from 'react';
import { shallow } from 'enzyme/build/index';

import { RolesCheckBoxGroup } from './index';

const props = {
  roles: [],
  input: {
    value: [],
    onChange: jest.fn()
  }
};

const wrapper = shallow(<RolesCheckBoxGroup {...props} />);

describe('RolesCheckBoxGroup', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
