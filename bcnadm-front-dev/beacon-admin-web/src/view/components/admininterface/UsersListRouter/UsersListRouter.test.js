import UsersListRouter from 'src/view/components/admininterface/UsersListRouter/index';
import React from 'react';
import { shallow } from 'enzyme/build/index';

const wrapper = shallow(<UsersListRouter />);

describe('UsersListRouter', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
  it('Component has been rendered', () => expect(wrapper.length).toEqual(1));
});
