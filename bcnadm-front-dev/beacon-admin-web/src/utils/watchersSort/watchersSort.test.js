import { SORTED, sortWatchers } from './index';

const WATCHER_NAME = 'name';
const VISITOR_IDS = 'visitorIds';
const VISITORS = 'visitors';

const SORTED_FIELDS = {
  WATCHER_NAME,
  VISITORS
};

describe('watchersSort', () => {
  const watcher1 = {
    [WATCHER_NAME]: 'abc',
    [VISITORS]: VISITORS,
    [VISITOR_IDS]: ['12345']
  };
  const watcher2 = {
    [WATCHER_NAME]: 'cba',
    [VISITORS]: VISITORS,
    [VISITOR_IDS]: ['1234', '5678']
  };
  const watcher3 = {
    [WATCHER_NAME]: 'cba',
    [VISITORS]: VISITORS,
    [VISITOR_IDS]: ['1234', '5678']
  };

  const watchersTestData = [watcher1, watcher2];
  const equalNameWatchersTestData = [watcher2, watcher3];

  it('Should check function with two equal fields', () => {
    const WATCHER_NAME_EQUAL_FIELDS_ASC = [watcher2, watcher3];
    const watcherNameSortingEqualFields = sortWatchers(
      SORTED_FIELDS.WATCHER_NAME,
      equalNameWatchersTestData,
      SORTED[SORTED_FIELDS.WATCHER_NAME].asc);
    expect(watcherNameSortingEqualFields).toEqual(WATCHER_NAME_EQUAL_FIELDS_ASC);
  });

  it('Should check name asc sorting', () => {
    const WATCHER_NAME_ASC = [watcher1, watcher2];
    const watcherNameSortingAsc = sortWatchers(
      SORTED_FIELDS.WATCHER_NAME,
      watchersTestData,
      SORTED[SORTED_FIELDS.WATCHER_NAME].desc);


    expect(watcherNameSortingAsc).toEqual(WATCHER_NAME_ASC);
  });

  it('Should check name desc sorting', () => {
    const WATCHER_NAME_DESC = [watcher2, watcher1];
    const watcherNameSortingDesc = sortWatchers(
      SORTED_FIELDS.WATCHER_NAME,
      watchersTestData,
      SORTED[SORTED_FIELDS.WATCHER_NAME].asc
    );

    expect(watcherNameSortingDesc).toEqual(WATCHER_NAME_DESC);
  });

  it('Should check visitors asc sorting', () => {
    const VISITORS_ASC = [watcher1, watcher2];
    const visitorsSortingAsc = sortWatchers(
      SORTED_FIELDS.VISITORS,
      watchersTestData,
      SORTED[SORTED_FIELDS.VISITORS].desc
    );

    expect(visitorsSortingAsc).toEqual(VISITORS_ASC);
  });

  it('Should check visitors desc sorting', () => {
    const VISITORS_DESC = [watcher2, watcher1];
    const visitorsSortingDesc = sortWatchers(
      SORTED_FIELDS.VISITORS,
      watchersTestData,
      SORTED[SORTED_FIELDS.VISITORS].asc
    );

    expect(visitorsSortingDesc).toEqual(VISITORS_DESC);
  });
});
