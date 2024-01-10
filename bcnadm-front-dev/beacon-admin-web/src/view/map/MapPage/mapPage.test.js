import React from 'react';
import { shallow } from 'enzyme';
import { MapPage } from './index';

const props = {
  selectedMapProviderName: 'Google',
  fetchLevel: jest.fn(),
  match: {
    params: { level: '5beea5a30bd42e1fb05bc0ea' }
  }
};

const wrapper = shallow(<MapPage {...props} />);

describe('Map', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
