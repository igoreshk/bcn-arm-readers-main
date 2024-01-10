import React from 'react';
import { shallow } from 'enzyme/build/index';

import RemoveLevelDialog from './index';

const props = {
  levelId: '123',
  levelName: '4A',
  translate: jest.fn()
};

const wrapper = shallow(<RemoveLevelDialog {...props} />);

describe('RemoveLevelDialog', () => {
  it('Check matching snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
