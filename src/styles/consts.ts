import { css } from 'styled-components';

export const COLOR_PRIMARY = '#C0392B';
export const COLOR_PRIMARY_HOVER = '#B62F21';
export const COLOR_SECONDARY = '#ECF0F1';
export const FONT_FAMILY = `'Roboto', sans-serif`;

export const GLOBAL_STYLES = css`
  :root {
    --colorPrimary: ${COLOR_PRIMARY};
    --colorPrimaryHover: ${COLOR_PRIMARY_HOVER};
    --colorSecondary: ${COLOR_SECONDARY};
  }

  html,
  body {
    margin: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    font-family: ${FONT_FAMILY};
    font-weight: 300;
  }
`;
