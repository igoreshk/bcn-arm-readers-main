import React from 'react';
import { shallow } from 'enzyme';

import LevelField from './index';

const props = {
  input: {
    image: 'image',
    mimeType: 'mimeType',
    entityId: 'entityId',
    value: {
      image: 'image',
      number: 1,
      imageLink: 'imageLink'
    },
    onChange: jest.fn()
  },
  params: {
    imageLink: 'imageLink',
    number: 0,
    image: undefined
  },
  translate: jest.fn(),
  onRemoveLevelClick: jest.fn(),
  changeLevelNumber: jest.fn(),
  changeLevelImage: jest.fn()
};

const wrapper = shallow(<LevelField {...props} />);

describe('LevelField test', () => {
  it('check props matches', () => expect(wrapper.length).toEqual(1));
  it('snapshot for LevelField', () => expect(wrapper).toMatchSnapshot());
});
