import ImageDropzone from 'src/view/components/common/ImageDropzone/index';
import React from 'react';
import { shallow } from 'enzyme';

const props = {
  imageLink: '/building/1/image',
  input: {
    value: {
      image: ''
    }
  },
  maxSize: 100,
  translate: jest.fn()
};

const wrapper = shallow(<ImageDropzone {...props} />);

describe('ImageDropzone test', () => {
  it('check props matches', () => expect(wrapper.length).toEqual(1));
  it('snapshot for ImageDropzone', () => expect(wrapper).toMatchSnapshot());
});
