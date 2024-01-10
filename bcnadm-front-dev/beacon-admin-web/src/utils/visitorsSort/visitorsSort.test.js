import { SORTED, sortVisitors } from './index';

const NAME = 'name';

const SORTED_FIELDS = {
  NAME
};

describe('visitorsSort', () => {
  const visitor1 = {
    name: 'name'
  };
  const visitor2 = {
    name: 'name'
  };

  const visitorsTestData = [visitor1, visitor2];

  it('Should check function with two equal fields', () => {
    const NAME_EQUAL_FIELDS_ASC = [visitor2, visitor1];
    const nameSortingEqualFields = sortVisitors(
      SORTED_FIELDS.NAME,
      visitorsTestData,
      SORTED[SORTED_FIELDS.NAME].asc);


    expect(nameSortingEqualFields).toEqual(NAME_EQUAL_FIELDS_ASC);
  });

  it('Should check name asc sorting', () => {
    const NAME_ASC = [visitor1, visitor2];
    const nameSortingAsc = sortVisitors(
      SORTED_FIELDS.NAME,
      visitorsTestData,
      SORTED[SORTED_FIELDS.NAME].desc);


    expect(nameSortingAsc).toEqual(NAME_ASC);
  });

  it('Should check name desc sorting', () => {
    const NAME_DESC = [visitor2, visitor1];
    const nameSortingDesc = sortVisitors(
      SORTED_FIELDS.NAME,
      visitorsTestData,
      SORTED[SORTED_FIELDS.NAME].asc
    );

    expect(nameSortingDesc).toEqual(NAME_DESC);
  });
});
