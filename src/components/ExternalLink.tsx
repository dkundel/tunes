import * as React from 'react';

import { shell } from 'electron';

export default class ExternalLink extends React.Component<any, any> {
  onClick(evt: Event) {
    evt.preventDefault();
    shell.openExternal(this.props.href);
  }

  render() {
    return (
      <a {...this.props} onClick={(evt: Event) => this.onClick(evt)}>
        {this.props.children}
      </a>
    );
  }
}
