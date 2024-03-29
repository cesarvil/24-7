import { createGlobalStyle } from "styled-components";

export const breakpoints = {
  xs: "600px",
  s: "768px",
  l: "1024px",
  xl: "1600px",
}; //@media only screen and (min-device-width : 768px)

export const employeeColors = {
  navy: "#036494",
  blue: "#21a1fc",
  teal: "#21e2fc",
  yellow: "#aba72c",
  green: "#40bd57",
  purple: "#e6a8ff",
  maroon: "#ffa8b8",
  silver: "#DDDDDD",
  red: "#FF4136",
  orange: "#FF851B",
  white: "#ffffff",
  black: "#000000",
  tealGreen: "#00B27F",
};

export default createGlobalStyle`
    :root {
      --primary-background-color: ${(props) =>
        props.darkMode ? "black" : "#fff5ff"};
      --primary-color: ${(props) => (props.darkMode ? "white" : "black")};
      --secondary-color-blue: #21a1fc;
    }

    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        vertical-align: baseline;
        box-sizing: border-box;
        font-family: "Lato", sans-serif;
        font-family: "Poppins", sans-serif;
        max-width: 1600px;
        
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
      background:var(--primary-background-color);
      color: var(--primary-color);
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    h1, h2, h3 {
      /* color: var(--primary-color); */
      font-family: var(--heading-font-family);
    }
    h2 {
      font-size: 28px;
    }
   
`;
