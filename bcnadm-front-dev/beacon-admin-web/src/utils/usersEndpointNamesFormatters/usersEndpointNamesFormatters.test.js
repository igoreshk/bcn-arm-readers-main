import { formatUserValuesFromGetRequest, formatUserValuesForPostRequest } from './index';

const userBackendFormat = {
  entityId: '610cfe23253c1321a5e722f9',
  login: 'john@smith.com',
  name: 'John__Smith',
  email: 'ff@mm.com',
  locale: 'en',
  lastEntry: null,
  lastLogout: null,
  lastSessionInterval: null,
  password: null,
  role: 'ADMINISTRATOR',
  status: 'ACTIVE'
};

const userFrontendFormat = {
  entityId: '610cfe23253c1321a5e722f9',
  login: 'john@smith.com',
  firstName: 'John',
  lastName: 'Smith',
  email: 'ff@mm.com',
  locale: 'en',
  lastEntry: null,
  lastLogout: null,
  lastSessionInterval: null,
  password: null,
  role: 'ADMINISTRATOR',
  status: 'ACTIVE'
};

const mockFormState = {
  form: {
    UserForm: {
      values: {
        firstName: 'Ivan',
        lastName: 'Petrov',
        email: 'ivan@petrov.com',
        isCorrectEmail: true,
        role: 'USER',
        lastSessionInterval: null,
        lastEntry: null,
        lastLogout: null,
        entityId: '610cfe23253c1321a5e722f9',
        status: 'ACTIVE',
        login: 'ivan@petrov.com',
        availableBuildings: ['610d01b8ab2974707dab63c0']
      }
    }
  }
};

const expectedFormValues = {
  name: 'Ivan__Petrov',
  login: 'Ivan__Petrov',
  email: 'ivan@petrov.com',
  isCorrectEmail: true,
  role: 'USER',
  status: 'ACTIVE',
  availableBuildings: ['610d01b8ab2974707dab63c0']
};

describe('formatUserValuesFromGetRequest test', () => {
  it('should return an object formatted for frontend', () => {
    expect(formatUserValuesFromGetRequest(userBackendFormat)).toEqual(userFrontendFormat);
  });
});

describe('formatUserValuesForPostRequest test', () => {
  it('should return formatted form state values', () => {
    expect(formatUserValuesForPostRequest(mockFormState)).toEqual(expectedFormValues);
  });
});
