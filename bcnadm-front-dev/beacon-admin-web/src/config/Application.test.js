import React from 'react';
import { shallow } from 'enzyme';
import UserProfileService from 'src/service/UserProfileService';
import Application from './Application';
import { localeValues } from './localeConsts';

const props = {
  locale: localeValues.EN,
  setActiveLanguage: jest.fn(),
  initialize: jest.fn()
};

const testCurrentUser = {
  login: 'johndoe',
  locale: localeValues.RU
};

describe('Application', () => {
  const wrapper = shallow(<Application {...props} />);

  it('should change default language if current user is provided', async () => {
    jest
      .spyOn(UserProfileService, 'getCurrentUserProfile')
      .mockImplementationOnce(jest.fn(() => Promise.resolve(testCurrentUser)));
    await wrapper.instance().componentDidMount();
    expect(props.setActiveLanguage).toHaveBeenCalledWith(testCurrentUser.locale);
  });
});
