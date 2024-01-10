export const getStringLastEntryDate = (string) => {
  return new Date(string).toLocaleString('en-US');
};

export const filterUsers = (filter, usersArray) => {
  return usersArray
    .filter((user) => user.firstName && user.firstName.toLowerCase().indexOf(filter.firstName) > -1)
    .filter((user) => user.lastName && user.lastName.toLowerCase().indexOf(filter.lastName) > -1)
    .filter((user) => user.email.toLowerCase().indexOf(filter.email) > -1)
    .filter((user) => {
      if (filter.status) {
        return user.status === filter.status;
      }
      return true;
    })
    .filter((user) => {
      if (filter.date) {
        return getStringLastEntryDate(user.lastEntry) === filter.date;
      }
      return true;
    })
    .filter((user) => {
      if (!filter.role || filter.role.length === 0) {
        return true;
      }
      if (!user.role) {
        return false;
      }
      return Array.from(filter.role).some((role) => user.role.indexOf(role) > -1);
    });
};
