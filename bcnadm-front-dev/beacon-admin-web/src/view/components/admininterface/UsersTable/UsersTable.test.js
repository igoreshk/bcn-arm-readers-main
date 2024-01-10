import React from 'react';
import { shallow } from 'enzyme';

import { UsersTable } from './index';

const props = {
  translate: jest.fn(),
  showLoadingScreen: jest.fn(),
  hideLoadingScreen: jest.fn(),
  history: {},
  updated: false
};

const filteredUsers = [
  { entityId: 3, name: 'test3' }
];

const wrapper = shallow(<UsersTable {...props} />);

describe('UserTable', () => {
  const loadData = jest.spyOn(UsersTable.prototype, 'loadData');
  const showLoadingScreen = jest.spyOn(wrapper.instance().props, 'showLoadingScreen');

  it('Checks that props are passed properly', () => expect(wrapper.instance().props).toEqual(props));

  it('Check showLoadingScreen was called from componentWillMount and componentDidUpdate life hooks', () => {
    wrapper.setProps({ updated: true });
    expect(showLoadingScreen).toHaveBeenCalledTimes(2);
  });

  it('Check loadData was called from componentDidUpdate life hook', () => expect(loadData).toHaveBeenCalled());

  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());

  it('Checks if history is called with correct arguments', () => {
    wrapper.setState({
      filteredUsers
    });
    wrapper.find('.user').forEach((node) => {
      node.simulate('click');
      expect(wrapper.instance().props.history.push).toHaveBeenCalledWith(filteredUsers[0].entityId);
    });
  });
});
