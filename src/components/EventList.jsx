// Part 5: EventList draws whichever events App hands it, and passes the
// status handler through to every card.

import EventCard from "./EventCard.jsx";

export default function EventList(props) {
  const { events, view, onStatusChange } = props;

  return (
    <section className="event-timeline" id={view + "-events"} aria-label={view + " events"}>
      {events.map((event) => (
        <div className="event-day-group" key={event.id}>
          <header className="event-day-label">
            <h2 className={"event-day-heading event-day-heading--" + event.dayHeadingStyle}>{event.dayHeading}</h2>
            <p>{event.weekday}</p>
          </header>
          <span className="timeline-dot" aria-hidden="true"></span>
          <EventCard {...event} onStatusChange={onStatusChange} />
        </div>
      ))}
    </section>
  );
}
