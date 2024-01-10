import React from 'react';
import { shallow } from 'enzyme/build/index';

import { BuildingsListRouter } from './index';

const wrapper = shallow(<BuildingsListRouter />);

describe('BuildingsListRouter', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
  it('Component has been rendered', () => expect(wrapper.length).toEqual(1));
});
