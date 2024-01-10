import { filterVisitors } from './index';

describe('visitorsFilter', () => {
  const visitor1 = {
    name: 'Test'
  };
  const visitor2 = {
    name: 'Vis'
  };

  const visitorsTestData = [visitor1, visitor2];

  it('Should check firstname filtering', () => {
    const NAME_TEST = 'v';
    const FILTER_NAME = {
      name: NAME_TEST
    };
    const VISITORS_FIRST_NAME_FILTER = [visitor2];
    const firstnameFiltering = filterVisitors(FILTER_NAME, visitorsTestData);

    expect(firstnameFiltering).toEqual(VISITORS_FIRST_NAME_FILTER);
  });
});
