import json from 'src/view/labelTranslations.json';
import React, { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Favicon from 'react-favicon';
import images from 'src/view/images';
import PropTypes from 'prop-types';

import UserProfileService from 'src/service/UserProfileService';
import { localeValues } from './localeConsts';

const languages = [
  { name: 'English', code: localeValues.EN },
  { name: 'Russian', code: localeValues.RU }
];

export default class Application extends Component {
  constructor(props) {
    super(props);

    props.initialize({
      languages,
      translation: json,
      options: { renderToStaticMarkup }
    });
  }

  componentDidMount() {
    const { setActiveLanguage } = this.props;
    UserProfileService.getCurrentUserProfile()
      .then((profile) => {
        if (profile.login) {
          setActiveLanguage(profile.locale);
        } else {
          setActiveLanguage(localeValues.EN);
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  componentDidUpdate(prevProps) {
    const { locale, setActiveLanguage } = this.props;
    if (locale && locale !== prevProps.locale) {
      setActiveLanguage(locale);
    }
  }

  render() {
    return <Favicon url={images.beaconIcon} />;
  }
}

Application.propTypes = {
  locale: PropTypes.string,
  setActiveLanguage: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired
};
