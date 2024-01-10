import { UsersList } from 'src/view/components/admininterface/UsersList/index';
import React from 'react';
import { shallow } from 'enzyme/build/index';

const props = {
  isLoading: false,
  location: {
    updated: false
  }
};

const wrapper = shallow(<UsersList {...props} />);

describe('UserList', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
