import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import HttpsRedirect from 'react-https-redirect';
// import { hydrate, render } from "react-dom";
// import { render } from 'react-snapshot';
 
// const app = (
// <BrowserRouter>
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <App />
//     </PersistGate>
//   </Provider>
// </BrowserRouter>
// );

// const rootElement = document.getElementById("root");
// if (rootElement.hasChildNodes()) {
//   hydrate(app , rootElement);
// } else {
//   hydrate(app , rootElement);
// }
ReactDOM.render(
  // render(
    <BrowserRouter>
    <Provider store={store}>
      <HttpsRedirect>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </HttpsRedirect>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
  // )
);
