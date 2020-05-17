import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Close from '../images/Close'

let portalRoot = document.getElementById('portal')

if (!portalRoot) {
  portalRoot = document.createElement('div')
  portalRoot.setAttribute('id', 'portal')
  document.body.appendChild(portalRoot)
}

class Portal extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.el = document.createElement('div')
  }

  componentDidMount () {
    portalRoot.appendChild(this.el)
  }

  componentWillUnmount () {
    portalRoot.removeChild(this.el)
  }

  render () {
    const { children, onClose, fullwidth } = this.props

    return ReactDOM.createPortal(
      <div
        className='fixed h-100 w-100 bg-black-50 flex items-center justify-center z-2'
        onClick={onClose}
        onKeyPress={onClose}
        role='button'
        tabIndex={-1}
        data-testid='close-button'
      >
        {fullwidth ? (
          <div>{children}</div>
        ) : (
          <article className="bg-base w-50-ns w-75 center pa3-ns tc ma3 flex flex-column justify-center br2 br--bottom bt-green">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="fr bn link bg-transparent pointer self-end pointer"
                data-testid="closeModal"
              >
                <Close />
              </button>
            )}

            <div
              role="button"
              className="center w-100"
              tabIndex={-1}
              onClick={e => e.stopPropagation()}
              onKeyPress={e => e.stopPropagation()}
            >
              {children}
            </div>
          </article>
        )}
      </div>,
      this.el
    )
  }
}

Portal.propTypes = {
  children: PropTypes.element.isRequired,
  onClose: PropTypes.func
}

Portal.defaultProps = {
  onClose: () => {}
}

export default Portal
