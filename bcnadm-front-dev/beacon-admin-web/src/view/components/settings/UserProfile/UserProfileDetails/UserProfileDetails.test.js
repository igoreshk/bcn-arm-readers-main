import React from 'react';
import { shallow } from 'enzyme';

import UserProfileDetails from '../UserProfileAvatar';

const props = {
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'JohnDoe@apple.com',
    login: 'JohnDoe',
    userIcon: '/path',
    isLoginChanging: true,
    isEmailChanging: true,
    isPasswordChanging: true
  },
  translate: jest.fn()
};

const wrapper = shallow(<UserProfileDetails {...props} />);

describe('UserProfileDetails', () => {
  it('render component', () => expect(wrapper.length).toEqual(1));
  it('snapshot for UserProfileDetails', () => expect(wrapper).toMatchSnapshot());
});
