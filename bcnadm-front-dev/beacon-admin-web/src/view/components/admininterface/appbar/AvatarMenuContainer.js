import { setLoggedOut } from 'src/actions/toggleLogin';
import { doLogout } from 'src/thunk/doLogout';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';

import AvatarMenu from './AvatarMenu';

export default connect(null, { doLogout, setLoggedOut })(withLocalize(AvatarMenu));
