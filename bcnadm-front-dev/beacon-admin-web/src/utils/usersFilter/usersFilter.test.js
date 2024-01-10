import { filterUsers, getStringLastEntryDate } from './index';

describe('getStringLastEntryDate', () => {
  it('Should check returned string date and time', () => {
    const STRING = '1995-12-17 03:24:00';
    const STRING_DATE_TIME = '12/17/1995, 3:24:00 AM';
    const stringDateTime = getStringLastEntryDate(STRING);

    expect(stringDateTime).toEqual(STRING_DATE_TIME);
  });
});


describe('usersFilter', () => {
  const user1 = {
    role: 'USER',
    firstName: 'firstname',
    lastName: 'secondname',
    email: 'test@epam.com',
    lastEntry: null
  };
  const user2 = {
    role: 'ADMINISTRATOR',
    firstName: 'Sevil',
    lastName: 'Seitablaeva',
    email: 'sevil_seitablaeva@epam.com',
    lastEntry: null
  };
  const user3 = {
    role: 'WATCHER',
    firstName: 'Kamil',
    lastName: 'Amirov',
    email: 'kamil_amirov@epam.com',
    lastEntry: null
  };
  const user4 = {
    role: 'ADMINISTRATOR',
    firstName: 'UserWithoutLastName',
    lastName: '',
    email: 'UserWithoutLastName@epam.com',
    lastEntry: null
  };
  const user5 = {
    role: 'WATCHER',
    firstName: '',
    lastName: 'UserWithoutFirstName',
    email: 'UserWithoutFirstName@epam.com',
    lastEntry: null
  };
  const user6 = {
    role: 'ADMINISTRATOR',
    firstName: 'UserWithoutLastName1',
    email: 'UserWithoutLastName1@epam.com',
    lastEntry: null
  };
  const user7 = {
    role: 'WATCHER',
    lastName: 'UserWithoutFirstName2',
    email: 'UserWithoutFirstName2@epam.com',
    lastEntry: null
  };

  const usersTestData = [user1, user2, user3, user4, user5, user6, user7];

  it('Should check firstname filtering', () => {
    const FIRST_NAME_TEST = 'k';
    const FILTER_FIRST_NAME = {
      firstName: FIRST_NAME_TEST,
      lastName: '',
      email: '',
      date: null,
      role: ''
    };
    const USERS_FIRST_NAME_FILTER = [user3];
    const firstnameFiltering = filterUsers(FILTER_FIRST_NAME, usersTestData);

    expect(firstnameFiltering).toEqual(USERS_FIRST_NAME_FILTER);
  });

  it('Should check lastname filtering', () => {
    const LAST_NAME_TEST = 's';
    const FILTER_LAST_NAME = {
      firstName: '',
      lastName: LAST_NAME_TEST,
      email: '',
      date: null,
      role: ''
    };
    const USERS_LAST_NAME_FILTER = [user1, user2];
    const lastnameFiltering = filterUsers(FILTER_LAST_NAME, usersTestData);

    expect(lastnameFiltering).toEqual(USERS_LAST_NAME_FILTER);
  });

  it('Should check email filtering', () => {
    const EMAIL_TEST = 'te';
    const FILTER_EMAIL = {
      firstName: '',
      lastName: '',
      email: EMAIL_TEST,
      date: null,
      role: ''
    };
    const USERS_EMAIL_FILTER = [user1];
    const emailFiltering = filterUsers(FILTER_EMAIL, usersTestData);

    expect(emailFiltering).toEqual(USERS_EMAIL_FILTER);
  });

  it('Should check date filtering', () => {
    const DATE_TEST = '1/27/2020';
    const FILTER_DATE = {
      firstName: '',
      lastName: '',
      email: '',
      date: DATE_TEST,
      role: ''
    };
    const USERS_DATE_FILTER = [];
    const dateFiltering = filterUsers(FILTER_DATE, usersTestData);

    expect(dateFiltering).toEqual(USERS_DATE_FILTER);
  });

  it('Should check role filtering', () => {
    const ROLE_TEST = ['ADMINISTRATOR', 'USER'];
    const FILTER_ROLE = {
      firstName: '',
      lastName: '',
      email: '',
      date: null,
      role: ROLE_TEST
    };
    const USERS_ROLE_FILTER = [user1, user2];
    const roleFiltering = filterUsers(FILTER_ROLE, usersTestData);

    expect(roleFiltering).toEqual(USERS_ROLE_FILTER);
  });
});
