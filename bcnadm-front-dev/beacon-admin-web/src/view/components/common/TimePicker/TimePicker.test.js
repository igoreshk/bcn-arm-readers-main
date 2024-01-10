import React from 'react';
import { shallow } from 'enzyme';
import TimePicker from 'view/components/common/TimePicker/index';


const props = {
    translate: jest.fn(),
    time: 71560,
    setTime: jest.fn(),
    getCurrentTimeInSeconds: jest.fn(),
    startDate: new Date('Sat Feb 05 2022 00:00:00 GMT+0300 (Moscow Standard Time)'),
    endDate: null,
    isTheSameDay: false,
    transformer: jest.fn(),
    selectedMapProvider: {},
    visitorIDs: ['61498bc6ba30275fdf772089', '61cd872b77df614e12448a7b']
};


const startDateOfSlider = 'Fri Feb 04 2022 20:04:00 GMT+0300 (Moscow Standard Time)';
const endDateOfSlider = null;
const slider = 71560;
const currentDateToMonitor = new Date('Sat Feb 05 2022 12:51:00 GMT+0300 (Moscow Standard Time)');
const numberOfVisitors = ['61498bc6ba30275fdf772089', '61cd872b77df614e12448a7b'];
const wrapper = shallow(<TimePicker {...props} />);
const onSubmitPrev = jest.spyOn(wrapper.instance(), 'onSubmitPrev');
wrapper.setState({ startDateOfSlider, endDateOfSlider, currentDateToMonitor, slider, numberOfVisitors });

describe('TimePicker', () => {
    it('renders', () => expect(wrapper.exists()).toBe(true));
    it('Should check that props are passed properly', () => expect(wrapper.instance().props).toEqual(props));
});

describe('Test onclick events', () => {
    it('simulates click events', () => {
        wrapper.find('.leftArrow').simulate('click');
        expect(onSubmitPrev).toHaveBeenCalled();
    });
});
