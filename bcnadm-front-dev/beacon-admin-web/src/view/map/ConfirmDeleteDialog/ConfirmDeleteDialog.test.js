import React from 'react';
import { shallow } from 'enzyme';
import ConfirmDeleteDialog from './index';

describe('mock', () => {
  const container = shallow(<ConfirmDeleteDialog translate={(smth) => smth} />);

  it('render component', () => {
    expect(container.length).toEqual(1);
  });
});
