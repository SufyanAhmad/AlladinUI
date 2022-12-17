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
import { HelmetProvider } from 'react-helmet-async';
import { hydrate, render } from "react-dom";
// import { render } from 'react-snapshot';
 
// const app = (
// <BrowserRouter>
//   <Provider store={store}>
      // <HttpsRedirect>
//    <HelmetProvider>
//     <PersistGate loading={null} persistor={persistor}>
//       <App />
//     </PersistGate>
//     </HelmetProvider>
      // </HttpsRedirect>
//   </Provider>
// </BrowserRouter>
// );

// const rootElement = document.getElementById("root");
// if (rootElement.hasChildNodes()) {
//   hydrate(app , rootElement);
// } else {
//   render(app , rootElement);
// }
ReactDOM.hydrate(
    <BrowserRouter>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HelmetProvider>
          <App />
          </HelmetProvider>
        </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
