import React from 'react';
import { useFluroContext } from './fluroapi/context';
import { EventDetail, Track } from './fluroapi/eventDetails';


export const Roster = () => {
  const fluro = useFluroContext();
  const events = fluro.eventDetails?.data ?? [];

  const tracks = useTrackFilter(events)

  const visibleEvents = events.filter(e => e.track?.status === 'active' && !tracks.hidden.includes(e.track._id)) ?? [];

  return (
    <>
      {tracks && 
        <div style={{overflowX: 'auto'}}>
          {tracks.tracks.map(t => (
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id={`roster-event-track-visible-${t._id}`} checked={t.visible} onChange={e => tracks.setTrack(t._id, e.target.checked)}/>
              <label className="form-check-label" htmlFor={`roster-event-track-visible-${t._id}`}>
                {t.title}
              </label>
            </div>
          
          ))}
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th></th>
                {visibleEvents.map(e => (
                  <th key={e._id}>{e.title}</th>
                ))}
              </tr>
              <tr>
                <th></th>
                {visibleEvents.map(e => (
                  <th key={e._id}>{e.startDate.substring(0, 10)}</th>
                ))}
              </tr>
              {/* <tr>
                <th></th>
                {api.events?.map(e => (
                  <th key={e._id}>{e.title}</th>
                ))}
              </tr> */}
            </thead>
          </table>
        </div>
      }
    </>
  )
}

const useTrackFilter = (events: EventDetail[]) => {
  const [hidden, setHidden] = React.useState<string[]>([]);

  const tracksById = events?.filter(e => e.track?.status === 'active')
                                .reduce<{[id: string]: Track}>((p,c) => ({
                                  ...p, 
                                  [c.track?._id ?? '-']: c.track as Track,
                                }), {}) ?? {}
  
  const tracks = events ? Object.values(tracksById).sort((a,b) => a.title.localeCompare(b.title)) : [];

  const hideTrack = (id: string) => setHidden([...hidden, id]);
  const showTrack = (id: string) => setHidden(hidden.filter(h => h !== id));
  return {
    tracks: tracks.map(t => ({...t, visible: !hidden.includes(t._id)})),
    hidden,
    setHidden,
    hideTrack,
    showTrack,
    setTrack: (id: string, visible: boolean) => {
      if (visible) {
        showTrack(id);
      }
      else {
        hideTrack(id);
      }
    },
    isVisible: (id: string) => !hidden.includes(id),
  }
}