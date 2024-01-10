import {
  checkNumberVisitorsZero,
  checkNumberVisitorsOne,
  checkNumberMoreTwentyEndsOne,
  checkNumberEndsTwoThreeFour
} from './helpers';

const oneVisitor = [{ entityId: '61c6fc23d0786b15b4caff5b', name: 'George' }];
const zeroVisitors = [];
const fourVisitors = [];
fourVisitors.length = 4;
const twentyOneVisitors = [];
twentyOneVisitors.length = 21;

describe('calling checkNumberVisitorsZero', () => {
  it('should return true if value is empty array', () => {
    expect(checkNumberVisitorsZero(zeroVisitors)).toBeTruthy();
    expect(checkNumberVisitorsZero(oneVisitor)).toBeFalsy();
  });
});

describe('calling checkNumberVisitorsOne ', () => {
  it('should return true if value is array with one argument', () => {
    expect(checkNumberVisitorsOne(oneVisitor)).toBeTruthy();
    expect(checkNumberVisitorsOne(zeroVisitors)).toBeFalsy();
  });
});

describe('calling checkNumberMoreTwentyEndsOne ', () => {
  it('should return true if value is array with length more twenty and ends one', () => {
    expect(checkNumberMoreTwentyEndsOne(twentyOneVisitors)).toBeTruthy();
    expect(checkNumberMoreTwentyEndsOne(zeroVisitors)).toBeFalsy();
  });
});

describe('calling checkNumberEndsTwoThreeFour ', () => {
  it('should return true if value is array with length two to four', () => {
    expect(checkNumberEndsTwoThreeFour(fourVisitors)).toBeTruthy();
    expect(checkNumberEndsTwoThreeFour(zeroVisitors)).toBeFalsy();
  });
});
