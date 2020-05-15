import * as Sentry from '@sentry/browser'
import React from 'react'
import PropTypes from 'prop-types'

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError () {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch (error, errorInfo) {
    console.error(error)
    Sentry.captureMessage(error)
  }

  render () {
    const { hasError } = this.state
    const { fallback, children } = this.props
    if (hasError) {
      // You can render any custom fallback UI
      return <h1>{fallback}</h1>
    }

    return children
  }
}

ErrorBoundary.propTypes = {
  fallback: PropTypes.string,
  children: PropTypes.element.isRequired
}

ErrorBoundary.defaultProps = {
  fallback: 'Oh no! Something went wrong 🤕'
}

export default ErrorBoundary
