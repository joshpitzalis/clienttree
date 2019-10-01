import React from 'react';
import { Link } from 'react-router-dom';

// history: ReactRouterPropTypes.history.isRequired,
// location: ReactRouterPropTypes.location.isRequired,
// match: ReactRouterPropTypes.match.isRequired,
// route: ReactRouterPropTypes.route.isRequired,
export function Dashboard() {
  return (
    <div className="flex">
      <div className="w-25">
        <ul className="flex-col">
          <li className="list">
            <Link
              to="/dashboard/123"
              className="f6 link dim mr3 mr4-ns no-underline"
            >
              Profile
            </Link>
          </li>
          <li className="list mt3">
            <Link
              to="/dashboard/123"
              className="f6 link dim mr3 mr4-ns underline b"
            >
              Dashboard
            </Link>
          </li>
          <li className="list mt3">
            <Link to="/network" className="f6 link dim mr3 mr4-ns no-underline">
              Network
            </Link>
          </li>
        </ul>
      </div>

      <h3 className="w-50">
        <div>
          <h1 className="mt0 tc">Welcome!</h1>
          <ul className="list pl0">
            <li className="pa3 pa4-ns bb b--black-10">
              <b className="db f3 mb1">Interested</b>
              {/* <span className="f5 db lh-copy measure">
                The positioning of text within the page margins. Alignment can
                be flush left, flush right, justified, or centered. Flush left
                and flush right are sometimes referred to as left justified and
                right justified.
              </span> */}
              <img
                alt="client face"
                src="http://mrmrs.github.io/photos/p/2.jpg"
                className="dib ba b--black-10 db br-100 w2 w3-ns h2 h3-ns mv3 mr3 pointer "
              />
              <img
                alt="client face"
                src="http://mrmrs.github.io/photos/p/3.jpg"
                className="dib ba b--black-10 db br-100 w2 w3-ns h2 h3-ns mv3 mr3 pointer "
              />
              <img
                alt="client face"
                src="http://mrmrs.github.io/photos/p/1.jpg"
                className="dib ba b--black-10 db br-100 w2 w3-ns h2 h3-ns mv3 mr3 pointer "
              />
            </li>
            <li className="pa3 pa4-ns bb b--black-10">
              <b className="db f3 mb1">Contacted</b>
              <small className="f5 db lh-copy measure o-50">
                Ipsum lorem, perhaps put an optional little description here,
                thingy thingy, maybe, not sure yet...
              </small>

              <img
                alt="client face"
                src="http://mrmrs.github.io/photos/p/4.jpg"
                className="dib ba b--black-10 db br-100 w2 w3-ns h2 h3-ns mv3 mr3 pointer "
              />
            </li>
            <li className="pa3 pa4-ns bb b--black-10">
              <b className="db f3 mb1">Brief Established</b>
              <img
                alt="client face"
                src="http://mrmrs.github.io/photos/p/6.jpg"
                className="dib ba b--black-10 db br-100 w2 w3-ns h2 h3-ns mv3 mr3 pointer "
              />

              <img
                alt="client face"
                src="http://mrmrs.github.io/photos/p/5.jpg"
                className="dib ba b--black-10 db br-100 w2 w3-ns h2 h3-ns mv3 mr3 pointer "
              />
            </li>
            <li className="pa3 pa4-ns bb b--black-10">
              <b className="db f3 mb1">Invoice Sent</b>
              <span className="f5 db lh-copy measure">
                The paragraphs in a document that make up the bulk of its
                content. The body text should be set in an appropriate and
                easy-to-read face, typically at 10- or 12-point size.
              </span>
            </li>
            <li className="pa3 pa4-ns bb b--black-10">
              <b className="db f3 mb1">Proposal Sent</b>
              <span className="f5 db lh-copy measure">
                A typeface that has been enhanced by rendering it in darker,
                thicker strokes so that it will stand out on the page. Headlines
                that need emphasis should be boldface. Italics are preferable
                for emphasis in body text.
              </span>
            </li>
            <li className="pa3 pa4-ns bb b--black-10">
              <b className="db f3 mb1">Project Started</b>
              <span className="f5 db lh-copy measure">
                A dot or other special character placed at the left of items in
                a list to show that they are individual, but related, points.
              </span>
            </li>
            <li className="pa3 pa4-ns bb b--black-10">
              <b className="db f3 mb1">Handover Complete</b>
              <span className="f5 db lh-copy measure">
                The height from the baseline to the top of the uppercase letters
                in a font. This may or may not be the same as the height of
                ascenders. Cap height is used in some systems to measure the
                type size.
              </span>
            </li>
            <li className="pa3 pa4-ns">
              <b className="db f3 mb1">Testimonial Received</b>
              <span className="f5 db lh-copy measure">
                Text placed at an equal distance from the left and right
                margins. Headlines are often centered. It is generally not good
                to mix centered text with flush left or flush right text.
              </span>
            </li>
          </ul>
        </div>
      </h3>
      <div className="w-25">
        <form className="pa4">
          <fieldset id="favorite_movies" className="bn">
            <legend className="fw7 mb2">Getting Started</legend>
            <div className="flex items-center mb2">
              <label htmlFor="spacejam" className="lh-copy">
                <input
                  className="mr2"
                  type="checkbox"
                  id="spacejam"
                  value="spacejam"
                  checked
                />
                <span className="strike">Get on the waiting list</span>
              </label>
            </div>
            <div className="flex items-center mb2">
              <label htmlFor="spacejam" className="lh-copy">
                <input
                  className="mr2"
                  type="checkbox"
                  id="spacejam"
                  value="spacejam"
                  checked
                />
                <span className="strike">Create an email signature</span>
              </label>
            </div>
            <div className="flex items-center mb2">
              <label htmlFor="spacejam" className="lh-copy">
                <input
                  className="mr2"
                  type="checkbox"
                  id="spacejam"
                  value="spacejam"
                />
                <span className="">Add the signature to your email</span>
              </label>
            </div>
            <div className="flex items-center mb2">
              <label htmlFor="spacejam" className="lh-copy">
                <input
                  className="mr2"
                  type="checkbox"
                  id="spacejam"
                  value="spacejam"
                />
                <span className="">Create a referral page</span>
              </label>
            </div>
            <div className="flex items-center mb2">
              <label htmlFor="spacejam" className="lh-copy">
                <input
                  className="mr2"
                  type="checkbox"
                  id="spacejam"
                  value="spacejam"
                />
                <span className="">Add someone to your network</span>
              </label>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
