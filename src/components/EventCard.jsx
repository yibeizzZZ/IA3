// Part 7: the overlay link is a React Router Link to this event's own page.
// Link changes the address without reloading the page.

import { Link } from "react-router-dom";

export default function EventCard(props) {
  // Pull each prop out of the props object so the JSX below can use short names.
  const { id, title, host, hostAvatar, location, time, dateTime, image, imageAlt, status, attendees, goingCount, onStatusChange } = props;

  const statusClass = "invitation-status is-" + status.toLowerCase();

  // Clicking the pill asks App to change this event's status. The card does not change itself.
  function handleStatusClick() {
    onStatusChange(id, status === "Going" ? "Invited" : "Going");
  }

  return (
    <article className="timeline-event-card" id={"event-" + id}>
      <Link className="timeline-event-link" to={"/events/" + id} aria-labelledby={"event-" + id + "-title"}></Link>
      <div className="timeline-event-copy">
        <time dateTime={dateTime}>{time}</time>
        <h3 id={"event-" + id + "-title"}>{title}</h3>
        <p className="event-host">
          <span className="host-avatar"><img src={hostAvatar} alt="" /></span>
          By {host}
        </p>
        <p className="event-place">
          <img src="https://raw.githubusercontent.com/silka-co/ui-design-course-assets/main/icons/map-pin.svg" alt="" />
          {location}
        </p>
        <div className="status-and-attendees">
          <button type="button" className={statusClass} onClick={handleStatusClick}>
            {status}
          </button>
          <span className="attendee-stack" aria-label={"More than " + goingCount + " attendees"}>
            <img src={attendees[0]} alt="" />
            <img src={attendees[1]} alt="" />
            <img src={attendees[2]} alt="" />
            <span>+{goingCount}</span>
          </span>
        </div>
      </div>
      <img className="timeline-event-image" src={image} alt={imageAlt} />
    </article>
  );
}
