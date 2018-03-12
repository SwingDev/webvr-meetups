import React from 'react';
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-vr';

import store from './store';

import App from './components/App';

export default class VRVideoPlayer extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('VRVideoPlayer', () => VRVideoPlayer);
