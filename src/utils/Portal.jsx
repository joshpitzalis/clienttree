import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Close from '../images/Close';

let portalRoot = document.getElementById('portal');

if (!portalRoot) {
  portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'portal');
  document.body.appendChild(portalRoot);
}

export default class Portal extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    onClose: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.el = document.createElement('div');
  }

  componentDidMount() {
    portalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    portalRoot.removeChild(this.el);
  }

  render() {
    const { children, onClose } = this.props;

    return ReactDOM.createPortal(
      <div
        className="fixed vh-100 w-100 bg-black-50 flex items-center justify-center"
        onClick={onClose}
        onKeyPress={onClose}
        role="button"
        tabIndex={-1}
        data-testid="close-button"
      >
        <article className="bg-base w-50 center pa3 tc br2 ma3 flex flex-column justify-center">
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
      </div>,
      this.el
    );
  }
}
