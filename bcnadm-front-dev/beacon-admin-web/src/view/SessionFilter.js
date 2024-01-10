import { WELCOME_PAGE, LOGIN } from 'src/consts/RouteConsts';
import { checkSession } from 'src/thunk/checkSession';
import { isCheckedSession } from 'src/actions/checkSessionActions';
import { setLoggedIn, setLoggedOut } from 'src/actions/toggleLogin';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// eslint-disable-next-line import/no-internal-modules
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Popup from './Popup';
import AppRouterRender from './AppRouterRender';
import LoadingScreenRender from './LoadingScreenRender';
import LoginPageRender from './LoginPageRender';

const PERIOD = 3599000;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#39C2D7',
      light: '#39C2D7',
      dark: '#39C2D7',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#A3C644',
      light: '#D7F975',
      dark: '#719508',
      contrastText: '#FFFFFF'
    }
  },
  typography: {
    useNextVariants: true
  }
});

class SessionFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastPage: null
    };
  }

  componentDidMount() {
    const { location, initialPage } = this.props;

    showLoadingScreen();

    checkSession()
      .then(
        () => {
          if (this.isWelcomePage() || this.isLoginPage()) {
            this.props.setLoggedIn();
            this.goTo(initialPage);
          } else {
            this.saveLastPage(location.pathname);
            this.props.setLoggedIn();
          }
          this.startSessionCheck();
        },
        () => {
          this.props.setLoggedOut();
        }
      )
      .finally(() => {
        this.props.isCheckedSession();
        setTimeout(() => this.props.hideLoadingScreen(), 0);
      })
      .catch((err) => {
        throw err;
      });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.isFetching === false;
  }

  componentDidUpdate(prevProps) {
    const { location, isLoggedIn, initialPage } = this.props;
    const { lastPage } = this.state;
    if (isLoggedIn !== prevProps.isLoggedIn) {
      if (isLoggedIn && lastPage) {
        this.goTo(lastPage);
      } else if (isLoggedIn && !lastPage) {
        this.goTo(initialPage);
      } else {
        this.goTo(WELCOME_PAGE);
        this.saveLastPage(location.pathname);
      }
    }
  }

  saveLastPage(path) {
    this.setState({ lastPage: path });
  }

  isWelcomePage() {
    return this.props.location.pathname === WELCOME_PAGE;
  }

  isLoginPage() {
    return this.props.location.pathname === LOGIN;
  }

  goTo(path) {
    this.props.history.push(path);
  }

  startSessionCheck() {
    const checker = setInterval(() => {
      checkSession().catch(() => {
        clearInterval(checker);
        this.props.setLoggedOut();
      });
    }, PERIOD);
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <>
          <LoadingScreenRender />
          {!this.props.isLoggedIn && <LoginPageRender />}
          <AppRouterRender />
          <Popup />
        </>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.userSettings.isLogged,
    initialPage: state.userSettings.initialPage,
    isFetching: state.loading.processesFetching
  };
};

const mapDispatchToProps = {
  isCheckedSession,
  setLoggedOut,
  setLoggedIn,
  showLoadingScreen,
  hideLoadingScreen
};

SessionFilter.propTypes = {
  setLoggedOut: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  hideLoadingScreen: PropTypes.func.isRequired,
  setLoggedIn: PropTypes.func.isRequired,
  isCheckedSession: PropTypes.func.isRequired,
  initialPage: PropTypes.string
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SessionFilter));
