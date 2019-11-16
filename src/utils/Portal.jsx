import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Close from '../images/Close';

const portalRoot = document.getElementById('portal');

export default class Portal extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {};

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
      >
        <article className=" w-50 center pa3 tc br2 bg-white ma3 flex flex-column justify-center">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="fr bn link bg-transparent pointer self-end"
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
