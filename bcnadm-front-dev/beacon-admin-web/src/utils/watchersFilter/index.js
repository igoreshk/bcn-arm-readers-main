const filterVisitorGroupName = (filter, watcherAggregate) => {
  if (filter.name) {
    return watcherAggregate.name && watcherAggregate.name.toLowerCase().includes(filter.name);
  }
  return true;
};

const getFilteredVisitorsArray = (visitorsArray, visitorName) => {
  return visitorsArray.filter((visitor) => visitor.name.toLowerCase().includes(visitorName));
};

const checkIdInFilteredVisitors = (visitorIdFromWatcherAggregate, filteredVisitors) => {
  for (let i = 0; i < filteredVisitors.length; i += 1) {
    if (visitorIdFromWatcherAggregate === filteredVisitors[i].entityId) {
      return true;
    }
  }
  return false;
};

const filterVisitorNames = (filter, watcherAggregate, visitorsArray) => {
  if (filter.visitorNames) {
    return watcherAggregate.visitorIds.some((em) => {
      return checkIdInFilteredVisitors(em.toLowerCase(), getFilteredVisitorsArray(visitorsArray, filter.visitorNames));
    });
  }
  return true;
};

export const filterWatchers = (filter, watchersArray, visitorsArray) => {
  return watchersArray
    .filter((watcherAggregate) => filterVisitorGroupName(filter, watcherAggregate))
    .filter((watcherAggregate) => filterVisitorNames(filter, watcherAggregate, visitorsArray));
};
