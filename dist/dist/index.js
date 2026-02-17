import React from '../_snowpack/pkg/react.js';
import ReactDOM from '../_snowpack/pkg/react-dom/client.js';
import App from './App.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(App, null)
  )
);

