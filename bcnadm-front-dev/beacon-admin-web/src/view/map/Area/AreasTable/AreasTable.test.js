import React from 'react';
import { shallow } from 'enzyme';
import { AreasTable } from './index';

const props = {
  close: jest.fn(),
  data: [
    {
      description: 'FIRST DESCRIPTION',
      entityId: '5bf2afcc31d7221230a09ea4',
      image: 'blob:http://example.com/1',
      levelId: '5beea5a30bd42e1fb05bc0ea',
      name: 'FIRST NAME'
    },
    {
      description: 'SECOND DESCRIPTION',
      entityId: '5bf2afbc31d7221230a09ea3',
      image: 'blob:http://example.com/2',
      levelId: '5beea5a30bd42e1fb05bc0ea',
      name: 'SECOND NAME'
    },
    {
      description: 'THIRD DESCRIPTION',
      entityId: '5beea89b0bd42e1fb05bc0ef',
      image: 'blob:http://example.com/3',
      levelId: '5beea5a30bd42e1fb05bc0ea',
      name: 'THIRD NAME'
    }
  ],
  editArea: jest.fn(),
  filter: '',
  isAreasLoading: false,
  levelNumber: 1,
  setFilter: jest.fn(),
  toggleSortAreasByField: jest.fn(),
  translate: jest.fn()
};

const wrapper = shallow(<AreasTable {...props} />);

describe('AreasTable', () => {
  it('Should match snapshot', () => expect(wrapper).toMatchSnapshot());
});
