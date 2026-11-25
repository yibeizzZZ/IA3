// Part 11 finished. Read and test.
// New in Part 11: the events are loaded, not imported. While they load, the page says so.
// If loading fails, the page says so and offers Try again.
// App owns the state and the header. Routes picks a page from the address:
// / is Events, /events/:id is one event, /my-events is My Events, anything else is Not Found.

import { Routes, Route, Link, NavLink } from "react-router-dom";
import EventsPage from "./pages/EventsPage.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import MyEvents from "./pages/MyEvents.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useEffect, useState } from "react";
import { loadEvents } from "./data/loadEvents.js";

function matchesSearch(event, query) {
  return event.title.toLowerCase().includes(query.trim().toLowerCase());
}

export default function App() {
  // The events start empty and arrive from loadEvents(). loadState says where we are:
  // "loading" | "ready" | "empty" | "error"
  const [events, setEvents] = useState([]);
  const [loadState, setLoadState] = useState("loading");

  // Ask for the events. Called once when the page first draws, and again on Try again.
  async function load() {
    setLoadState("loading");
    try {
      const data = await loadEvents();
      setEvents(data);
      setLoadState(data.length === 0 ? "empty" : "ready");
    } catch (error) {
      setLoadState("error");
    }
  }

  // useEffect runs its function after the render. The empty [] means: only after the first one.
  // Loading data is a side effect; it does not belong inside the render itself.
  useEffect(() => {
    load();
  }, []);
  const [view, setView] = useState("upcoming");
  const [query, setQuery] = useState("");
  const [announcement, setAnnouncement] = useState("");

  // Copy, then set. A new array, with a new object for the one event that changed.
  // The original array and object are never edited. The id never changes.
  function handleStatusChange(id, newStatus) {
    setEvents((currentEvents) => currentEvents.map((event) => {
      if (event.id !== id || event.status === newStatus) return event;
      let goingCount = event.goingCount;
      if (newStatus === "Going") goingCount += 1;
      if (event.status === "Going") goingCount -= 1;
      return { ...event, status: newStatus, goingCount };
    }));

    // Say what just happened, in words. The live region below reads this out.
    const changed = events.find((event) => event.id === id);
    const words = { Going: "you are going.", Declined: "you declined.", Invited: "back to invited." };
    setAnnouncement(changed.title + ": " + (words[newStatus] ?? newStatus));
  }

  // NavLink calls this with isActive, so the current page's link gets the is-current style from Class 2.
  function navClass({ isActive }) {
    return isActive ? "events-nav-link is-current" : "events-nav-link";
  }

  const shownEvents = events.filter((event) => {
    const inView = view === "past" ? event.isPast : !event.isPast;
    return inView && matchesSearch(event, query);
  });

  return (
    <>
      <a className="skip-link" href="#events-main">Skip to main content</a>

      {/* The live region. role="status" means: announce changes here, without interrupting. */}
      <p className="status-announcement" role="status" aria-live="polite">
        {announcement}
      </p>

      <header className="events-site-header">
        <Link className="events-home-mark" to="/" aria-label="Events home">
          <img src="https://raw.githubusercontent.com/silka-co/ui-design-course-assets/main/icons/star-four-fill.svg" alt="" />
        </Link>
        <nav className="events-primary-nav" aria-label="Primary navigation">
          <NavLink className={navClass} to="/" end>
            <img src="https://raw.githubusercontent.com/silka-co/ui-design-course-assets/main/icons/ticket.svg" width="18" height="18" alt="" aria-hidden="true" />
            <span>Events</span>
          </NavLink>
          <NavLink className={navClass} to="/my-events">
            <img src="https://raw.githubusercontent.com/silka-co/ui-design-course-assets/main/icons/calendar.svg" width="18" height="18" alt="" aria-hidden="true" />
            <span>My Events</span>
          </NavLink>
          <a className="events-nav-link" href="#discover">
            <img src="https://raw.githubusercontent.com/silka-co/ui-design-course-assets/main/icons/compass.svg" width="18" height="18" alt="" aria-hidden="true" />
            <span>Discover</span>
          </a>
        </nav>

        <nav className="events-account-nav" aria-label="Account navigation">
          <time dateTime="2026-08-12T14:34:00-04:00">2:34 PM EDT</time>
          <a href="#create-event">Create Event</a>
          <a className="icon-link has-notification" href="#notifications" aria-label="Notifications">
            <img src="https://raw.githubusercontent.com/silka-co/ui-design-course-assets/main/icons/bell.svg" alt="" />
          </a>
          <a className="profile-link" href="#profile" aria-label="Open profile">
            <img src="https://raw.githubusercontent.com/silka-co/ui-design-course-assets/main/images/steel-silicon.avif" alt="" />
          </a>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={
          <EventsPage
            events={shownEvents}
            view={view}
            onViewChange={setView}
            query={query}
            onQueryChange={setQuery}
            onStatusChange={handleStatusChange}
            loadState={loadState}
            onRetry={load}
          />
        } />
        <Route path="/events/:id" element={<EventDetails events={events} onStatusChange={handleStatusChange} loadState={loadState} />} />
        <Route path="/my-events" element={<MyEvents events={events} onStatusChange={handleStatusChange} loadState={loadState} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
