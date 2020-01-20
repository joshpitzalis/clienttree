import React from 'react';
import { Datepicker, DatepickerContainer } from '@duik/it';

import PropTypes from 'prop-types';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';

export const TimeUpdate = ({ lastUpdated }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div>
      {visible ? (
        <DatepickerContainer>
          <Datepicker
            value={new Date(lastUpdated)}
            onDateChange={() => setVisible(false)}
            maxDate={new Date()}
          />
        </DatepickerContainer>
      ) : (
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="bn text3 underline-hover pointer"
        >
          {lastUpdated &&
            formatDistanceToNow(new Date(lastUpdated), {
              addSuffix: true,
            })}
        </button>
      )}
    </div>
  );
};

TimeUpdate.propTypes = {
  lastUpdated: PropTypes.number.isRequired,
};

TimeUpdate.defaultProps = {};
