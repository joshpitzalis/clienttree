import React from 'react';
// import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import { useSelector } from 'react-redux';
import { Tooltip } from 'antd';

function percentage(value, total) {
  return Math.round((value / total) * 100);
}

export const findRecentlyContacted = (contacts, timePeriod) => {
  const recentlyContacted = (_lastContacted, _threshold) => {
    const now = +new Date();
    const timeDifference = now - _lastContacted;
    return timeDifference > 0 && timeDifference < _threshold;
  };

  return (
    contacts &&
    contacts.filter(item => {
      const lastContacted =
        item.lastContacted && recentlyContacted(item.lastContacted, timePeriod);

      if (lastContacted) {
        return true;
      }

      const lastNote =
        item &&
        item.notes &&
        Object.values(item.notes).some(
          note =>
            note &&
            note.lastUpdated &&
            recentlyContacted(note.lastUpdated, timePeriod)
        );

      return lastNote;
    }).length
  );
};

export function InsightsBox() {
  const sixMonthsAgo = 1.577e10;
  const sevenDaysAgo = 6.048e8;
  const people = useSelector(store => store.contacts && store.contacts.length);

  const inTouchWith = useSelector(store =>
    findRecentlyContacted(store.contacts, sixMonthsAgo)
  );

  const thisWeek = useSelector(store =>
    findRecentlyContacted(store.contacts, sevenDaysAgo)
  );

  return (
    <>
      <Counters people={people} inTouchWith={inTouchWith} thisWeek={thisWeek} />
    </>
  );
}

export const Counters = ({ people, inTouchWith, thisWeek }) =>
  !!people && (
    <div className="">
      <dl className="dib mr5 w4 pt5">
        <div>
          <Tooltip
            title={
              <p className="white">
                We recommend building a personal network of 150 people. Any more
                than this and it becomes too hard to maintain a genuine
                relationship with each person. For more on the evidence behind
                this{' '}
                <a href="https://www.youtube.com/watch?v=EidKI1Bdons&feature=youtu.be&t=354">
                  watch this youTube video
                </a>
                . There is also primary research in the video description.
              </p>
            }
          >
            <dd className="f6 f5-ns b ml0">People</dd>
            <dd className="f3 f2-ns b ml0">
              {people} <small className="text3 f6">/ 150</small>
            </dd>
          </Tooltip>
        </div>
        {/* <SparkLine data={[0, people]} /> */}
      </dl>

      <dl className="dib mr5 w4 pt5">
        <div>
          <Tooltip
            title={
              <p className="white">
                If you have added a note to a contact or completed a reminder
                connected to a contact in the last 6 months then it will count
                as being in touch with that contact. Gradually work toward
                staying in touch with more than 80% of your network at all
                times.
              </p>
            }
          >
            <dd className="f6 f5-ns b ml0">In Touch With</dd>
            <dd className="f3 f2-ns b ml0">
              <span data-testid="inTouchWith">{inTouchWith}</span>
              <small className="text3 f6 pl3">
                {percentage(inTouchWith, people)}%
              </small>
            </dd>
          </Tooltip>
        </div>
        {/* <SparkLine data={[13, 3, 5, 7, 3, 3, 5, 7, 3]} /> */}
        {/* <SparkLine data={[0, inTouchWith]} /> */}
      </dl>

      <dl className="dib mr5 w4 pt5">
        <div>
          <Tooltip
            title={
              <p className="white">
                Staying in touch with 150 in a year means reaching out to 3 new
                people each week. Reach out to more if you can but consistently
                reaching out to 3 new people a week is a good goal to start
                with.
              </p>
            }
          >
            <dd className="f6 f5-ns b ml0">Last 7 Days</dd>
            <dd className="f3 f2-ns b ml0">
              <span data-testid="contacted7Days"> {thisWeek}</span>
              <small className="text3 f6  pl3">/ 3</small>
            </dd>
          </Tooltip>
        </div>
        {/* <SparkLine data={[0, thisWeek]} /> */}
      </dl>
    </div>
  );

// const SparkLine = ({ data, fill = 'none' }) => (
//   <div className="h3 w4">
//     <Sparklines data={data}>
//       <SparklinesLine style={{ fill }} />
//       <SparklinesSpots />
//     </Sparklines>
//   </div>
// );
