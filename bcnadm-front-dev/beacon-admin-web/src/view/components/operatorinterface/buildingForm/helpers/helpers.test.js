import { getSortedObjectsbyProperty } from './index';

describe('getSortedObjectsbyProperty', () => {
  it('should return a sorted array of objects by the given property', () => {
    const array = [
      { year: 2020, name: 'Rocky' },
      { year: 1993, name: 'mike' },
      { year: 2000, name: 'Piter', age: 15 },
      { year: 1800, name: 'Mary' }
    ];

    const resultByName = [
      { year: 1800, name: 'Mary' },
      { year: 2000, name: 'Piter', age: 15 },
      { year: 2020, name: 'Rocky' },
      { year: 1993, name: 'mike' }
    ];

    const resultByYear = [
      { year: 1800, name: 'Mary' },
      { year: 1993, name: 'mike' },
      { year: 2000, name: 'Piter', age: 15 },
      { year: 2020, name: 'Rocky' }
    ];

    expect(getSortedObjectsbyProperty(array, 'name')).toEqual(resultByName);
    expect(getSortedObjectsbyProperty(array, 'year')).toEqual(resultByYear);
  });
});
