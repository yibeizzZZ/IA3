import EventList from "../components/EventList.jsx";

const sections = [
  { status: "Going", emptyMessage: "Events you accept will appear here." },
  { status: "Invited", emptyMessage: "You have no invitations waiting for a response." },
  { status: "Declined", emptyMessage: "You haven't declined any invitations." },
];

export default function MyEvents({ events, onStatusChange, loadState }) {
  return (
    <main id="events-main" className="events-main">
      <div className="events-title-row">
        <h1>My Events</h1>
      </div>

      {loadState === "loading" && <p className="load-state" role="status">Loading…</p>}
      {loadState === "error" && <p className="load-error">We couldn’t load your events. Go back to Events and try again.</p>}
      {(loadState === "ready" || loadState === "empty") && sections.map(({ status, emptyMessage }) => {
        const matchingEvents = events.filter((event) => event.status === status);
        const groupName = status.toLowerCase();
        const headingId = groupName + "-heading";

        return (
          <section key={status} className="my-events-group" aria-labelledby={headingId}>
            <h2 id={headingId}>{status}</h2>
            {matchingEvents.length > 0 ? (
              <EventList events={matchingEvents} view={groupName} onStatusChange={onStatusChange} />
            ) : (
              <p className="empty-state">{emptyMessage}</p>
            )}
          </section>
        );
      })}
    </main>
  );
}
