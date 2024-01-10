import { checkIsCurrentDay, changeDateView, getTranslate } from './helpers';

const props = {
    translate: () => 'No Visitors'
};

const date = new Date('Sat Feb 05 2022 12:51:00 GMT+0300 (Moscow Standard Time)');
const stringDate = 'Fri Feb 04 2022 20:04:00 GMT+0300 (Moscow Standard Time)';
const visitorsList = ['61498bc6ba30275fdf772089', '61cd872b77df614e12448a7b'];


describe('checkIsCurrentDay', () => {
    it('should check is present date', () => {
        expect(checkIsCurrentDay(date)).toEqual(false);
    });
});

describe('changeDateView', () => {
    it('should return date in expected format', () => {
        expect(changeDateView(stringDate)).toEqual('04 Feb');
    });
});

describe('getTranslate', () => {
    it('should return proper translate', () => {
        expect(getTranslate(visitorsList, props.translate)).toEqual('No Visitors');
    });
});

