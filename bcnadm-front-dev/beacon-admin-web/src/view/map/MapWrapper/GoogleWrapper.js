import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import { LoadingScreen } from 'src/view/LoadingScreen';

export const GoogleWrapper = (Component) => {
  const Google = (props) => {
    return <Component mapProvider={props.google} {...props} />;
  };
  Google.displayName = 'GoogleWrapper';

  return GoogleApiWrapper({
    apiKey: process.env.GOOGLE_API_KEY,
    LoadingContainer: LoadingScreen
  })(Google);
};
