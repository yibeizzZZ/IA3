// Part 7: shown when the address does not match any event or any page.

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main id="events-main" className="events-main">
      <h1>We couldn’t find that</h1>
      <p>It may have been removed, or the link is out of date.</p>
      <p>
        <Link to="/" className="secondary-button">Back to Events</Link>
      </p>
    </main>
  );
}
