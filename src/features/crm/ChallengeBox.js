import React from 'react';
import PropTypes from 'prop-types';
import { setChallenge, removeChallenge } from './crmAPI';

const propTypes = {
  challenges: PropTypes.arrayOf({
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
    id: PropTypes.string.isRequired,
  }),
  userId: PropTypes.string.isRequired,
  stageId: PropTypes.string.isRequired,
};

const defaultProps = { challenges: [] };

export function ChallengeBox({ challenges, userId, stageId }) {
  const [editable, setEditable] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [link, setLink] = React.useState('');

  return (
    <article className="pa3 pa5-ns">
      <ul className="list pl0 ml0 center mw6 ba b--light-silver br2">
        {challenges &&
          challenges.map(({ title: name, link: ref, id }, index, array) => (
            <li
              key={id}
              className={`ph3 pv3 ${index !== array.length - 1 &&
                'bb b--light-silver'}`}
            >
              {ref ? (
                <a
                  href={ref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=""
                >
                  {name}
                </a>
              ) : (
                <span className="">{name}</span>
              )}
              {editable && (
                <button
                  type="button"
                  className="bn f6   black-70 pointer red "
                  onClick={() => {
                    removeChallenge({
                      title: name,
                      link: ref,
                      id,
                      userId,
                      stageId,
                    });
                    setEditable(false);
                  }}
                >
                  (Delete)
                </button>
              )}
            </li>
          ))}
      </ul>

      {editable ? (
        <form
          className="pa4 black-80"
          onSubmit={e => {
            e.preventDefault();
            setChallenge({ title, link, id: +new Date(), userId, stageId });
            setTitle('');
            setLink('');
            setEditable(false);
          }}
        >
          <div className="measure-narrow">
            <label htmlFor="title" className="f6 b db mb2">
              Title
              <input
                className="input-reset ba b--black-20 pa2 mb2 db w-100"
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />{' '}
            </label>
            <label htmlFor="link" className="f6 b db mb2">
              Link <small className="o-50">(Optional)</small>
              <input
                className="input-reset ba b--black-20 pa2 mb2 db w-100"
                type="text"
                id="link"
                value={link}
                onChange={e => setLink(e.target.value)}
              />{' '}
            </label>
            <input
              className="input-reset ba bg-black white pa2 mv3 db w-100"
              type="submit"
              value="Done"
            />
          </div>
        </form>
      ) : (
        <button
          type="button"
          className="bn f6 fr mv2 black-70 pointer"
          onClick={() => setEditable(true)}
        >
          Edit
        </button>
      )}
    </article>
  );
}

ChallengeBox.propTypes = propTypes;
ChallengeBox.defaultProps = defaultProps;
