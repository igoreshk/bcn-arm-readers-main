import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';

import Application from './Application';

function mapStateToProps(state) {
  return {
    locale: state.userSettings.settings.locale
  };
}

export const Setup = connect(mapStateToProps, null)(withLocalize(Application));
