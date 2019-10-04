import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {};

const defaultProps = {};

export default function Referral() {
  return (
    <article className="pa3 pa5-ns">
      <h1 className="f3 f1-m f-headline-l">Josh Pitzalis</h1>

      <p className="measure lh-copy b">Freelance Web Developer</p>
      <p className="measure lh-copy  gray">Next Available February 2020</p>
      <p className="measure lh-copy">
        I specialise in building web apps that help people learn things. If you
        have an idea for a learning-oriented digital platform I can help you
        turn it into a simple, fast and reliable web application.
      </p>
      <button
        type="button"
        className="mb4 mt3 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
        onClick={() => {}}
      >
        Contact
      </button>
      <div className="pa4 pv5 pl0">
        <blockquote className="athelas ml0 mt0 pl4 black-90 bl bw2 b--blue">
          <p className="f5 f4-m f3-l lh-copy measure mt0">
            Discipline in typography is a prime virtue. Individuality must be
            secured by means that are rational. Distinction needs to be won by
            simplicity and restraint. It is equally true that these qualities
            need to be infused wiht a certain spirit and vitality, or they
            degenerate into dullness and mediocrity.
          </p>
          <cite className="f6 ttu tracked fs-normal flex items-center ">
            <img
              alt="someone face"
              src="http://mrmrs.github.io/photos/p/3.jpg"
              className=" ba b--black-10 db br-100 w2  h2 mr3 "
            />
            ―Stanley Morison
          </cite>
        </blockquote>
      </div>
      <Service />
      <Service />
      <Service />
      <Service />
      <Service />
    </article>
  );
}

function Service() {
  return (
    <div>
      <h3 className="f3 f2-m f1-l">Consultation</h3>
      <p className="measure lh-copy">
        Have an idea for a digital product but not sure how to bring it to life?
        Planning your next big startup idea and need technical advice? Don’t
        know how to approach adding a new feature to an existing app?
      </p>
      <p className="measure lh-copy">
        If you want someone to take a fresh look at your web app, determine
        potential flaws, and put together an actionable plan for improvement
        then I can help. I’ll review your current situation and figure out a
        brief roadmap for solving the problem.
      </p>

      <p className="measure lh-copy b mt5">Deliverables & Pricing</p>
      <p className="measure lh-copy ">
        A 60-Minute consultation call costs $250.
      </p>
      <p className="measure lh-copy">
        You’ll receive a video recording of the call and a brief written recap
        of key points.
      </p>

      <p className="measure lh-copy blue">Learn More...</p>
      <div className="pa4 pv5 pl0">
        <blockquote className="athelas ml0 mt0 pl4 black-90 bl bw2 b--blue">
          <p className="f5 f4-m f3-l lh-copy measure mt0">
            Discipline in typography is a prime virtue. Individuality must be
            secured by means that are rational. Distinction needs to be won by
            simplicity and restraint. It is equally true that these qualities
            need to be infused wiht a certain spirit and vitality, or they
            degenerate into dullness and mediocrity.
          </p>
          <cite className="f6 ttu tracked fs-normal flex items-center">
            <img
              alt="someone face"
              src="http://mrmrs.github.io/photos/p/3.jpg"
              className=" ba b--black-10 db br-100 w2  h2 mr3 "
            />
            ―Stanley Morison
          </cite>
        </blockquote>
      </div>
    </div>
  );
}
Referral.propTypes = propTypes;
Referral.defaultProps = defaultProps;
