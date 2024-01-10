import { SORTED, sortUsers, getSortType } from './index';

const FIRST_NAME = 'firstName';
const LAST_NAME = 'lastName';
const EMAIL = 'email';

const SORTED_FIELDS = {
  FIRST_NAME,
  LAST_NAME,
  EMAIL
};

describe('usersSort', () => {
  const user1 = {
    role: 'ADMINISTRATOR',
    firstName: 'firstname',
    lastName: 'secondname',
    email: 'test@epam.com'
  };
  const user2 = {
    role: 'ADMINISTRATOR',
    firstName: 'Sevil',
    lastName: 'Seitablaeva',
    email: 'sevil_seitablaeva@epam.com'
  };
  const user3 = {
    role: 'ADMINISTRATOR',
    firstName: 'Kamil',
    lastName: 'Amirov',
    email: 'kamil_amirov@epam.com'
  };

  const usersTestData = [user1, user2, user3];

  it('Should check function with two equal fields', () => {
    const FIRST_NAME_EQUAL_FIELDS_ASC = [user2, user3, user1];
    const firstnameSortingEqualFields = sortUsers(
      SORTED_FIELDS.FIRST_NAME,
      usersTestData,
      SORTED[SORTED_FIELDS.FIRST_NAME].asc);


    expect(firstnameSortingEqualFields).toEqual(FIRST_NAME_EQUAL_FIELDS_ASC);
  });

  it('Should check firstname asc sorting', () => {
    const FIRST_NAME_ASC = [user1, user3, user2];
    const firstnameSortingAsc = sortUsers(
      SORTED_FIELDS.FIRST_NAME,
      usersTestData,
      SORTED[SORTED_FIELDS.FIRST_NAME].desc);


    expect(firstnameSortingAsc).toEqual(FIRST_NAME_ASC);
  });

  it('Should check firstname desc sorting', () => {
    const FIRST_NAME_DESC = [user2, user3, user1];
    const firstnameSortingDesc = sortUsers(
      SORTED_FIELDS.FIRST_NAME,
      usersTestData,
      SORTED[SORTED_FIELDS.FIRST_NAME].asc
    );

    expect(firstnameSortingDesc).toEqual(FIRST_NAME_DESC);
  });

  it('Should check lastname asc sorting', () => {
    const LAST_NAME_ASC = [user3, user1, user2];
    const lastnameSortingAsc = sortUsers(SORTED_FIELDS.LAST_NAME, usersTestData, SORTED[SORTED_FIELDS.LAST_NAME].desc);

    expect(lastnameSortingAsc).toEqual(LAST_NAME_ASC);
  });

  it('Should check lastname desc sorting', () => {
    const LAST_NAME_DESC = [user2, user1, user3];
    const lastnameSortingDesc = sortUsers(SORTED_FIELDS.LAST_NAME, usersTestData, SORTED[SORTED_FIELDS.LAST_NAME].asc);

    expect(lastnameSortingDesc).toEqual(LAST_NAME_DESC);
  });

  it('Should check email asc sorting', () => {
    const EMAIL_ASC = [user3, user2, user1];
    const emailSortingAsc = sortUsers(SORTED_FIELDS.EMAIL, usersTestData, SORTED[SORTED_FIELDS.EMAIL].desc);

    expect(emailSortingAsc).toEqual(EMAIL_ASC);
  });

  it('Should check email desc sorting', () => {
    const EMAIL_DESC = [user1, user2, user3];
    const emailSortingDesc = sortUsers(SORTED_FIELDS.EMAIL, usersTestData, SORTED[SORTED_FIELDS.EMAIL].asc);

    expect(emailSortingDesc).toEqual(EMAIL_DESC);
  });
});

describe('getSortType', () => {
  it('Should check returned sort type ASC', () => {
    const TYPE_EMAIL_DESC = SORTED[SORTED_FIELDS.EMAIL].desc;
    const returnedType = getSortType(SORTED_FIELDS.EMAIL, SORTED[SORTED_FIELDS.EMAIL].asc);

    expect(returnedType).toEqual(TYPE_EMAIL_DESC);
  });

  it('Should check returned sort type DESC', () => {
    const TYPE_EMAIL_ASC = SORTED[SORTED_FIELDS.EMAIL].asc;
    const returnedType = getSortType(SORTED_FIELDS.EMAIL, SORTED[SORTED_FIELDS.EMAIL].desc);

    expect(returnedType).toEqual(TYPE_EMAIL_ASC);
  });
});
