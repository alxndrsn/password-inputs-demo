import React from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet } from 'react-helmet';

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

import App from './App';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import roboto400 from '@fontsource/roboto/files/roboto-latin-400-normal.woff2';
import roboto500 from '@fontsource/roboto/files/roboto-latin-500-normal.woff2';

const sentryDsn = '';
if(sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: 'TODO',
    release: 'TODO',
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const root = createRoot(document.getElementById('root'));
root.render(
  // N.B. StrictMode will make all components render twice
  // see: https://stackoverflow.com/questions/61254372/my-react-component-is-rendering-twice-because-of-strict-mode/61897567#61897567
  <React.StrictMode>
    <Helmet>
      <link rel="preload" as="font" href={roboto400} type="font/woff2"/>
      <link rel="preload" as="font" href={roboto500} type="font/woff2"/>
    </Helmet>
    <App/>
  </React.StrictMode>
);
