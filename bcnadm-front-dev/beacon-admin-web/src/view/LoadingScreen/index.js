import images from 'src/view/images';
import React from 'react';

import './loading.scss';

export const LoadingScreen = () => (
  <div className="loadingScreen">
    <img role="presentation" src={images.loadingScreenIcon} className="logo" />
    <img role="presentation" src={images.progressor} className="progressor" />
  </div>
);
