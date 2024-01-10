import UserProfileAvatar from 'src/view/components/settings/UserProfile/UserProfileAvatar/index';
import React from 'react';
import { shallow } from 'enzyme';

const props = {
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'JohnDoe@apple.com',
    login: 'JohnDoe'
  },
  translate: jest.fn()
};

const wrapper = shallow(<UserProfileAvatar {...props} />);

describe('UserProfileAvatar', () => {
  it('render connected(SMART) component', () => expect(wrapper.length).toEqual(1));
  it('snapshot for UserProfileAvatar', () => expect(wrapper).toMatchSnapshot());
});
