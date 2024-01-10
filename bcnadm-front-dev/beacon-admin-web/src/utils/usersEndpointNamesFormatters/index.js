import { USER_DIALOG_FORM } from 'src/consts/FormsNames';
import { formValueSelector } from 'redux-form';

const selector = formValueSelector(USER_DIALOG_FORM);

export const formatUserValuesFromGetRequest = (user) => {
  const [firstName, lastName] = user.name.split('__');
  const shallowCopyUser = { ...user, firstName, lastName };
  delete shallowCopyUser.name;
  return shallowCopyUser;
};

export const formatUserValuesForPostRequest = (state) => {
  return {
    name: `${selector(state, 'firstName')}__${selector(state, 'lastName')}`,
    email: selector(state, 'email'),
    login: `${selector(state, 'firstName')}__${selector(state, 'lastName')}`,
    isCorrectEmail: selector(state, 'isCorrectEmail'),
    role: selector(state, 'role'),
    status: selector(state, 'status'),
    availableBuildings: selector(state, 'availableBuildings')
  };
};
