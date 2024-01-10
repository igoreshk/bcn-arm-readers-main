import { UserForm } from 'src/view/components/admininterface/UserForm';
import { validate } from 'src/view/components/admininterface/validate';
import { USER_DIALOG_FORM } from 'src/consts/FormsNames';
import { connect } from 'react-redux';
import { formValueSelector, reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { withLocalize } from 'react-localize-redux';

const selector = formValueSelector(USER_DIALOG_FORM);

const mapStateToProps = (state, props) => {
  const currentUser = props.entity;
  return {
    initialValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      isCorrectEmail: false,
      role: props.entity.role,
      lastSessionInterval: currentUser.lastSessionInterval,
      lastEntry: currentUser.lastEntry,
      lastLogout: currentUser.lastLogout,
      entityId: currentUser.entityId,
      status: currentUser.status,
      login: currentUser.login
    },
    firstName: selector(state, 'firstName'),
    lastName: selector(state, 'lastName'),
    email: selector(state, 'email'),
    isCorrectEmail: selector(state, 'isCorrectEmail'),
    role: selector(state, 'role'),
    status: selector(state, 'status'),
    availableBuildings: selector(state, 'availableBuildings'),
    currentUser
  };
};

export default withRouter(
  withLocalize(
    connect(mapStateToProps)(
      reduxForm({
        form: USER_DIALOG_FORM,
        validate
      })(UserForm)
    )
  )
);
