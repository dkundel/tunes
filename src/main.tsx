import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(createLogger({ collapsed: true })))
);

let render = () => {
  const { App } = require('./app');
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContainer>,
    document.getElementById('App')
  );
};

window['onYouTubeIframeAPIReady'] = render;
//render();
if (module['hot']) {
  module['hot'].accept(render);
}
