import * as Sentry from '@sentry/browser';
import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  static propTypes = {
    fallback: PropTypes.string,
    children: PropTypes.element.isRequired,
  };

  static defaultProps = {
    fallback: 'Oh no! Something went wrong 🤕',
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureMessage(error);
  }

  render() {
    const { hasError } = this.state;
    const { fallback, children } = this.props;
    if (hasError) {
      // You can render any custom fallback UI
      return <h1>{fallback}</h1>;
    }

    return children;
  }
}

export default ErrorBoundary;
