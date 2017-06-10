import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { injectGlobal } from 'styled-components';

import About from './components/About';
import { GLOBAL_STYLES } from './styles/consts';

injectGlobal`${GLOBAL_STYLES}`;

ReactDOM.render(
  <AppContainer><About /></AppContainer>,
  document.getElementById('App')
);
