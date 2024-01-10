import React from 'react';
import { shallow } from 'enzyme';
import { VisitorsList } from './index';

const props = {
  isLoading: false,
  location: {
    updated: false
  }
};

const wrapper = shallow(<VisitorsList {...props} />);

describe('VisitorsList', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
