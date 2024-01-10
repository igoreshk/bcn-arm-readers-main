import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withLocalize } from 'react-localize-redux';

import { UserProfileForm } from './UserProfileForm';

const mapStateToProps = (state, props) => {
  const { userProfile } = props;
  return {
    initialValues: {
      image: userProfile.image,
      name: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      login: userProfile.login,
      isLoginChanging: userProfile.isLoginChanging,
      isEmailChanging: userProfile.isEmailChanging,
      isPasswordChanging: userProfile.isPasswordChanging,
      locale: userProfile.locale,
      availableBuildings: userProfile.availableBuildings,
      lastEntry: userProfile.lastEntry
    },
    enableReinitialize: true
  };
};

export default connect(mapStateToProps)(
  reduxForm({
    form: 'UserProfileForm'
  })(withLocalize(UserProfileForm))
);
