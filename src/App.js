import { Component } from 'react';

import * as Sentry from '@sentry/react';

import ChangePasswordPage from './pages/ChangePasswordPage';

class App extends Component {
  state = {};

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Unhandled error', { error, errorInfo }); // eslint-disable-line no-console
    Sentry.captureException(error);
    this.setState({ error:true });
  }

  render() {
    return <ChangePasswordPage/>;
  }
}
export default App;
