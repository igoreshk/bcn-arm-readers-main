import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import UserFormContainer from './index';

const initialState = {
  getRoles: {
    roles: 'roles',
    isFetching: true,
    wasError: true,
    didInvalidate: true
  },
  user: {
    currentUser: {
      firstName: '',
      lastName: '',
      email: '',
      roles: [],
      id: null
    }
  }
};

const mockStore = configureStore();

const wrapper = shallow(<UserFormContainer store={mockStore(initialState)} />);

describe('UserFormContainer', () => {
  it('check that container has child component', () => expect(wrapper.length).toEqual(1));
});
