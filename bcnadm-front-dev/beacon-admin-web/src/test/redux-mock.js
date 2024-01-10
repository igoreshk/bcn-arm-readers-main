import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

export const createStubComponent = () =>
  function ComponentName() {
    return <div />;
  };

export const mountComponent = (WrappedComponent, { reducer, actions } = {}) => {
  let reducers = {};
  if (reducer) {
    reducers = Object.assign({}, reducers, reducer);
  }
  // eslint-disable-next-line
  const store = configureStore({ reducer: reducers, middleware: [...getDefaultMiddleware(), inMiddleware] });

  if (actions) {
    actions.forEach((action) => store.dispatch(action));
  }
  return mount(
    <Provider store={store}>
      <BrowserRouter>
        <WrappedComponent />
      </BrowserRouter>
    </Provider>
  );
};

export const connectComponent = (WrappedComponent, props, initialState = {}) => {
  const reducer = (state = initialState) => state;
  const store = configureStore({ reducer, middleware: [...getDefaultMiddleware()] });
  return mount(
    <Provider store={store}>
      <WrappedComponent {...props} />
    </Provider>
  );
};

export const connectComponentWithRouter = (WrappedComponent, props, initialState = {}) => {
  const reducer = (state = initialState) => state;
  const store = configureStore({ reducer, middleware: [...getDefaultMiddleware()] });
  return mount(
    <Provider store={store}>
      <BrowserRouter>
        <WrappedComponent {...props} />
      </BrowserRouter>
    </Provider>
  );
};
