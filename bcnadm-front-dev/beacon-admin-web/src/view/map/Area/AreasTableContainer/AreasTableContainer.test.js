import React from 'react';
import { shallow } from 'enzyme';
import { AreasTableContainer } from './index';

const props = {
  close: jest.fn(),
  isAreasLoading: false,
  history: {
    push: jest.fn()
  },
  levelNumber: 2,
  match: {
    params: {
      building: 'BUILDING_ID',
      level: 'LEVEL_ID'
    }
  },
  areas: [
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
      coordinate: {
        latitude: 0.07707593500532493,
        longitude: -0.0185394287109375
      },
      description: 'THIRD DESCRIPTION',
      entityId: '5beea89b0bd42e1fb05bc0ef',
      image: 'blob:http://example.com/3',
      levelId: '5beea5a30bd42e1fb05bc0ea',
      name: 'THIRD NAME'
    }
  ],
  translate: jest.fn()
};

const field = 'name';
const desc = 'BY_NAME_ASC';
const entityId = '5beea89b0bd42e1fb05bc0ef';
const wrapper = shallow(<AreasTableContainer {...props} />);
const toggleSortAreasByField = jest.spyOn(wrapper.instance(), 'toggleSortAreasByField');

describe('AreasTableContainer', () => {
  it('Should check that props are passed properly', () => expect(wrapper.instance().props).toEqual(props));

  it('Should call toggleSortAreasByField and check sorted data', () => {
    wrapper.instance().toggleSortAreasByField(field);
    expect(toggleSortAreasByField).toHaveBeenCalled();
    expect(wrapper.instance().state.sortedData).toEqual(props.areas);
    expect(wrapper.instance().state.sortedBy).toEqual(desc);
  });

  it('Should call editArea', () => {
    const editArea = jest.spyOn(wrapper.instance(), 'editArea');
    wrapper.instance().editArea(entityId)();
    expect(editArea).toHaveBeenCalled();
  });

  it('Should match snapshot', () => expect(wrapper).toMatchSnapshot());
});
