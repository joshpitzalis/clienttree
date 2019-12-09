import React from 'react';
import PropTypes from 'prop-types';
import { toast$ } from '../notifications/toast';
import { fetchUserData } from './serviceAPI';

const propTypes = {
  userId: PropTypes.string.isRequired,
};

const defaultProps = {};

export default function Referral({ userId }) {
  const [profileData, setProfileData] = React.useState({});
  React.useEffect(() => {
    if (userId) {
      fetchUserData(userId)
        .then(data => setProfileData(data))
        .catch(error =>
          toast$.next({ type: 'ERROR', message: error.message || error })
        );
    }
  }, [userId]);

  return (
    <article className="pa3 pa5-ns">
      <h1 className="f3 f1-m f-headline-l" id="services">
        {profileData.name && profileData.name}
      </h1>

      <p className="measure lh-copy b i">
        {profileData.designation && profileData.designation}
      </p>
      {/* <p className="measure lh-copy  gray">Next Available February 2020</p> */}
      <p className="lh-copy measure">
        {`I specialise in helping
        ${profileData.clients && profileData.clients}
        with
        ${profileData.service && profileData.service}
        .`}
      </p>
      <a
        type="button"
        target="_blank"
        rel="noopener noreferrer"
        className="mb4 black link mt3 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
        href={profileData.website && profileData.website}
      >
        Contact
      </a>
      {/* <div className="pa4 pv5 pl0">
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
      </div> */}

      {profileData &&
        profileData.services &&
        Object.values(profileData.services).map(service => (
          <Service {...service} />
        ))}
    </article>
  );
}
Referral.propTypes = propTypes;
Referral.defaultProps = defaultProps;

const servicePropTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

const serviceDefaultProps = {};

function Service({ name, description, price, link }) {
  return (
    <div>
      <h3 className="f3 f2-m f1-l">{name}</h3>
      <p className="measure lh-copy">{description}</p>

      <p className="measure lh-copy ">{price}</p>

      <a href={link} className="measure lh-copy blue">
        Learn More...
      </a>
    </div>
  );
}

Service.propTypes = servicePropTypes;
Service.defaultProps = serviceDefaultProps;
