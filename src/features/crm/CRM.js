import React from 'react';
import PropTypes from 'prop-types';

const crmPropTypes = {
  welcomeMessage: PropTypes.string.isRequired,
};
const crmDefaultProps = {};
export function CRM({ welcomeMessage }) {
  return (
    <div>
      <h1 className="mt0 tc">{welcomeMessage.header}</h1>
      <h3 className="mt0 tc gray">{welcomeMessage.byline}</h3>
      <ul className="list pl0">
        <li className="pa3 pa4-ns bb b--black-10">
          <b className="db f3 mb1">People Interested In Your Work</b>
          <img
            alt="client face "
            src="https://pbs.twimg.com/profile_images/673422102767251456/HYiR6yIE_400x400.jpg"
            className="dib ba b--black-10 db br-100 w2 w3-ns h2 h3-ns mv3 mr3 pointer"
          />
        </li>
        <li className="pa3 pa4-ns bb b--black-10">
          <b className="db f3 mb1">Contacted</b>
          <small className="f5 db lh-copy measure o-50">
            Ipsum lorem, perhaps put an optional little description here, thingy
            thingy, maybe, not sure yet...
          </small>
        </li>
        <li className="pa3 pa4-ns bb b--black-10">
          <b className="db f3 mb1">Brief Established</b>
          <small className="f5 db lh-copy measure o-50">
            Ipsum lorem, perhaps put an optional little description here, thingy
            thingy, maybe, not sure yet...
          </small>
        </li>
        <li className="pa3 pa4-ns bb b--black-10">
          <b className="db f3 mb1">Invoice Sent</b>
          <small className="f5 db lh-copy measure o-50">
            Ipsum lorem, perhaps put an optional little description here, thingy
            thingy, maybe, not sure yet...
          </small>
        </li>
        <li className="pa3 pa4-ns bb b--black-10">
          <b className="db f3 mb1">Proposal Sent</b>
          <small className="f5 db lh-copy measure o-50">
            Ipsum lorem, perhaps put an optional little description here, thingy
            thingy, maybe, not sure yet...
          </small>
        </li>
        <li className="pa3 pa4-ns bb b--black-10">
          <b className="db f3 mb1">Project Started</b>
          <small className="f5 db lh-copy measure o-50">
            Ipsum lorem, perhaps put an optional little description here, thingy
            thingy, maybe, not sure yet...
          </small>
        </li>
        <li className="pa3 pa4-ns bb b--black-10">
          <b className="db f3 mb1">Handover Complete</b>
          <small className="f5 db lh-copy measure o-50">
            Ipsum lorem, perhaps put an optional little description here, thingy
            thingy, maybe, not sure yet...
          </small>
        </li>
        <li className="pa3 pa4-ns">
          <b className="db f3 mb1">Testimonial Received</b>
          <small className="f5 db lh-copy measure o-50">
            Ipsum lorem, perhaps put an optional little description here, thingy
            thingy, maybe, not sure yet...
          </small>
        </li>
      </ul>
    </div>
  );
}
CRM.propTypes = crmPropTypes;
CRM.defaultProps = crmDefaultProps;
