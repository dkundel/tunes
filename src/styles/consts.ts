import { css } from 'styled-components';

export const colorMap = {
  colorPrimary: '#D84315',
  colorPrimaryHover: '#BF360C',
  colorSecondary: '#F5F5F5',
  colorBackground: '#F5F5F5',
  colorText: '#212121'
};
export type Colors = keyof (typeof colorMap);

const colorVariables = Object.keys(colorMap)
  .map(key => {
    return `--${key}: ${colorMap[key]};`;
  })
  .join('\n');

export const FONT_FAMILY_MAIN = `'Roboto', sans-serif`;
export const FONT_FAMILY_HEADLINE = `'Roboto', sans-serif`;
export const GLOBAL_STYLES = css`
  :root {
    ${colorVariables}
  }

  html,
  body {
    margin: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    font-family: ${FONT_FAMILY_MAIN};
    font-weight: 300;
    background: var(--colorBackground);
    color: var(--colorText);
  }
`;
