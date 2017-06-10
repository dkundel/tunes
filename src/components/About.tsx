import * as React from 'react';
import styled from 'styled-components';
import {  } from 'polished';
import { remote } from 'electron';

import { H1, P } from '../styles/components';
import ExternalLink from './ExternalLink';
import MaterialIcon from './MaterialIcon';

const Container = styled.div`
  text-align: center;
  padding: 40px;
`;

const Logo = styled(H1)`
  font-size: 50px;
  margin-bottom: 0;
  margin-top: 0;
`;

const AppDescription = styled(P)`
  text-align: justify;
`;

const InfoTable = styled.div`
  text-align: left;
`;

const InfoTableRow = styled.div`
  display: flex;
`;

const InfoTableEntry = styled.div`
  flex: 1;
`;

const InfoTableLabel = styled(InfoTableEntry)`
  font-weight: 600;
  flex: initial;
  margin-right: 20px;
`;

const CloseButton = styled.button`
  margin: 20px;
  padding: 10px;
  background: none;
  cursor: pointer;
  border: none;
  outline: none;

  &:hover, &:focus {
    color: var(--colorPrimary);
  }
`

export default class About extends React.Component<any, any> {
  closeDialog() {
    remote.getCurrentWindow().close();
  }

  render() {
    return (
      <Container>
        <Logo>🎵</Logo>
        <H1>About Tunes</H1>
        <AppDescription>
          This application allows you to play YouTube playlists in a small
          player right in your menubar. It is powered by the YouTube iFrame API
          and therefore might have limitations on which songs can be played. It
          will automatically skip blocked videos.
        </AppDescription>
        <AppDescription>
          The application is developed open-source. You can inspect the source
          on its GitHub repository below.
        </AppDescription>
        <InfoTable>
          <InfoTableRow>
            <InfoTableLabel>Version</InfoTableLabel>
            <InfoTableEntry>{remote.app.getVersion()}</InfoTableEntry>
          </InfoTableRow>
          <InfoTableRow>
            <InfoTableLabel>Developer</InfoTableLabel>
            <InfoTableEntry>Dominik Kundel</InfoTableEntry>
          </InfoTableRow>
          <InfoTableRow>
            <InfoTableLabel>Source Code</InfoTableLabel>
            <InfoTableEntry>
              <ExternalLink
                href="https://github.com/dkundel/tunes"
                target="_blank"
              >
                https://github.com/dkundel/tunes
              </ExternalLink>
            </InfoTableEntry>
          </InfoTableRow>
        </InfoTable>
        <CloseButton onClick={() => this.closeDialog()}>
          <MaterialIcon icon="close"/>
        </CloseButton>
      </Container>
    );
  }
}
