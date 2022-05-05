import { createGlobalStyle } from "styled-components";

export const breakpoints = { tablet: "768px" }; //@media only screen and (min-device-width : 768px)

export const employeeColors = {
  navy: "#001f3f",
  blue: "#0074D9",
  teal: "#22bab5",
  yellow: "#FFDC00",
  purple: "#B10DC9",
  maroon: "#85144b",
  silver: "#DDDDDD",
  red: "#FF4136",
  orange: "#FF851B",
};

export default createGlobalStyle`
    :root {
      --primary-color: #145173;
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
        font-family: 'Open Sans', sans-serif;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        /* line-height: 1;
        margin-right: 10vw;
        margin-left: 10vw; */
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
