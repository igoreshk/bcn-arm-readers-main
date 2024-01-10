import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';
import { ReaderDialog } from './index';

describe('ReaderDialog', () => {
  const props = {
    translate: jest.fn(),
    isValid: false,
    history: {},
    allReaders: ['firstTestName', 'secondTestName', 'thirdTestName', 'forthTestName'],
    location: {
      hash: '',
      key: 'dvix6f',
      pathname: '/buildings/60952c00d9fc0118256dc407/levels/60952c00d9fc0118256dc408/readers/edit/new',
      search: '',
      state: {
        latitude: 50.00010172124495,
        longitude: 50.000085830688455
      }
    },
    match: {
      isExact: true,
      params: {
        building: '60952c00d9fc0118256dc407',
        layer: 'readers',
        level: '60952c00d9fc0118256dc408',
        reader: 'some'
      }
    },
    fetchReaderNames: jest.fn()
  };

  const state = {
    reader: {
      entityId: null,
      latitude: 49.99963966368888,
      levelId: '60952c00d9fc0118256dc408',
      longitude: 50.00048279762266,
      uuid: null
    },
    level: {
      buildingId: '60952c00d9fc0118256dc407',
      entityId: '60952c00d9fc0118256dc408',
      northEastLatitude: 50.00125615406551,
      northEastLongitude: 50.00195425434061,
      number: 1,
      scaleDistance: 10,
      scaleEndLatitude: 50.0006172205162,
      scaleEndLongitude: 50.00089585781095,
      scaleStartLatitude: 50.00011551393959,
      scaleStartLongitude: 50.000852942466715,
      southWestLatitude: 49.99874381311278,
      southWestLongitude: 49.99804574565935
    }
  };

  const wrapper = shallow(<ReaderDialog {...props} />);

  wrapper.setState(state);

  it('Component has rendered', () => expect(wrapper.length).toEqual(1));

  it('Check props', () => expect(wrapper.instance().props).toEqual(props));

  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());

  describe('testSaveButton', () => {
    let saveButton = wrapper.find(Button).at(1);

    it('Check initial state of button is disabled', () => {
      expect(saveButton.prop('disabled')).toBeTruthy();
    });

    it('Check button disabled if reader name already exist', () => {
      wrapper.setState({
        reader: {
          entityId: null,
          latitude: 49.99963966368888,
          levelId: '60952c00d9fc0118256dc408',
          longitude: 50.00048279762266,
          uuid: 'firstTestName'
        }
      });
      wrapper.setProps({
        isValid: false
      });
      saveButton = wrapper.find(Button).at(1);
      expect(saveButton.prop('disabled')).toBeTruthy();
    });

    it('Check button active with new reader name', () => {
      wrapper.setState({
        reader: {
          entityId: null,
          latitude: 49.99963966368888,
          levelId: '60952c00d9fc0118256dc408',
          longitude: 50.00048279762266,
          uuid: 'someNewName'
        }
      });
      wrapper.setProps({
        isValid: true
      });
      saveButton = wrapper.find(Button).at(1);
      expect(saveButton.prop('disabled')).toBeFalsy();
    });
  });
});
