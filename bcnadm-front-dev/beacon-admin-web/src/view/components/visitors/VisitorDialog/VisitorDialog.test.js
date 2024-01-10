import React from 'react';
import { shallow } from 'enzyme';
import { VisitorDialog } from './index';

describe('VisitorDialog', () => {
  const props = {
    translate: () => '',
    match: {
      params: {
        id: 1
      }
    },
    showLoadingScreen: () => {},
    hideLoadingScreen: () => {},
    values: {}
  };
  let container;

  beforeEach(() => {
    container = shallow(<VisitorDialog {...props} />);
  });

  it('Component has rendered', () => {
    expect(container.length).toEqual(1);
  });

  it('Check props', () => {
    expect(container.instance().props).toEqual(props);
  });
});
