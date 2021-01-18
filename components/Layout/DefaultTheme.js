import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
html,
body {
  background-color: ${(props) =>
    props.theme.style === 'light' ? '#ffffff' : '#131217'};
  font-feature-settings: 'kern' 1;
  font-kerning: normal;
}

body {
  margin: 0;
}

body,
html,
p,
a,
button,
input,
time {
  color: ${(props) => (props.theme.style === 'light' ? '#333' : '#cbcbcc')};
  font-family: 'IBM Plex Serif', Georgia, 'Times New Roman', Times, serif;
  font-weight: 400;
  font-style: normal;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'IBM Plex Serif', Georgia, 'Times New Roman', Times, serif;
  font-weight: 600;
  font-style: normal;
}

pre,
code {
  font-family: 'Source Code Pro', 'Courier New', Courier, monospace;
  font-weight: 400;
  font-style: normal;
  margin: 1rem 0;
}

.remark-highlight {
  margin: 0 -80px;
}

@media (max-width: 1000px) {
  .remark-highlight {
    margin: 0 -1rem;
  }
}

img {
  margin: 1rem 0;
  width: 100%;
}

html {
  font-size: 16px;
}

h1 {
  font-size: 2.5rem;
  line-height: 1.2;
}

h2 {
  font-size: 2rem;
}

h3 {
  font-size: 1.75rem;
}

h4 {
  font-size: 1.5rem;
}

h5 {
  font-size: 1.25rem;
}

h6 {
  font-size: 1rem;
}

p {
  margin: 1.75rem 0;
}

p,
li,
a {
  color: ${(props) => (props.theme.style === 'light' ? '#333333' : '#cbcbcc')};
  line-height: 1.5;
  font-size: 1.25rem;
}

pre,
code,
code.language-text {
  font-size: 1rem;
}

li {
  margin-bottom: 0.75rem;
}

a {
  text-decoration-skip-ink: none;
  text-decoration: underline;
  color: ${(props) => (props.theme.style === 'light' ? '#326891' : '#b17acc')};
}

a:hover {
  text-decoration: none;
}

blockquote {
  margin: 1rem;
  padding-left: 1rem;
  border-left: 5px solid #828282;
}

blockquote > p {
  color: #828282;
}

@media (max-width: 600px) {
  p,
  a,
  li {
    font-size: 1.1rem;
  }

  pre,
  code,
  code.language-text {
    font-size: 0.85rem;
  }
}
`

const DefaultTheme = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      {children}
    </>
  )
}

export default DefaultTheme