import React from 'react';
import { mount } from 'enzyme/build';
import ErrorFallback from './ErrorFallback';

const props = {
  resetErrorBoundary: jest.fn(),
  translate: jest.fn()
};

const wrapper = mount(<ErrorFallback {...props} />);

describe('ErrorFallback', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());

  it('When the button is clicked, resetErrorBoundary is called', () => {
    wrapper.find('.repeatButton').simulate('click');
    expect(props.resetErrorBoundary).toHaveBeenCalled();
  });

  it('Translate was called twice when rendering', () => {
    expect(props.translate).toHaveBeenCalledTimes(2);
  });
});
