import { filterWatchers } from './index';

const NAME = 'name';
const VISITOR_IDS = 'visitorIds';
const VISITOR_NAMES = 'visitorNames';
const ENTITY_ID = 'entityId';

describe('watchersFilter', () => {
  const watcher1 = {
    [NAME]: 'Test',
    [VISITOR_IDS]: ['5f71d561s38']
  };
  const watcher2 = {
    [NAME]: 'Watcher',
    [VISITOR_IDS]: ['5d71d598s38', '5gh1ddf5638']
  };

  const visitor1 = {
    [ENTITY_ID]: '5f71d561s38',
    [NAME]: 'Test Visitor'
  };

  const visitor2 = {
    [ENTITY_ID]: '5gh1ddf5638',
    [NAME]: 'New Example'
  };

  const watchersTestData = [watcher1, watcher2];
  const visitorsTestData = [visitor1, visitor2];

  it('Should check name filtering', () => {
    const VISITOR_NAME_TEST = 'w';
    const FILTER_NAME = {
      [NAME]: VISITOR_NAME_TEST,
      [VISITOR_NAMES]: ''
    };
    const WATCHERS_VISITOR_NAME_FILTER = [watcher2];
    const visitorNameFiltering = filterWatchers(FILTER_NAME, watchersTestData);

    expect(visitorNameFiltering).toEqual(WATCHERS_VISITOR_NAME_FILTER);
  });

  it('Should check visitorIds filtering', () => {
    const VISITOR_NAMES_TEST = 'new exa';
    const FILTER_VISITOR_NAMES = {
      [NAME]: '',
      [VISITOR_NAMES]: VISITOR_NAMES_TEST
    };
    const WATCHERS_VISITOR_IDS_FILTER = [watcher2];
    const visitorsIdsFiltering = filterWatchers(FILTER_VISITOR_NAMES, watchersTestData, visitorsTestData);

    expect(visitorsIdsFiltering).toEqual(WATCHERS_VISITOR_IDS_FILTER);
  });
});
