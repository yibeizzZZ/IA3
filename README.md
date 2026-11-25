# Part 8 — My Events

This folder is Part 7 finished. If you fell behind, drag in everything from this folder, the same way as in setup, and you are level with the class.

## Your next task — Part 8: My Events

Build the My Events page from the same `events` state the Events page uses. Three groups, Going, Invited and Declined, each a list of cards. A group with nothing in it shows a short message instead of an empty space. Add Decline, so there is something to put in the third group: the RSVP form's second button declines, and a declined event's page offers a way back.

Because both pages read the one `events` state in `App`, a status changed on either page is already right on the other. Nothing has to be kept in sync by hand.

**Done when:** `/my-events` shows the forum under Going and the other two upcoming events under Invited, with the Declined group showing its empty-state message. Pressing Decline on an event's page moves it to Declined on My Events. Flipping a pill on Events moves the card between groups here.

### Additional reading: think before coding

- The three groups are three different views of one list. Should each be its own `useState`, or worked out from `events` each time the page draws? Think about what happens when a status changes if the groups were separate state.
- `events.filter(...)` gives a smaller list. What does `EventList` need to draw one group, and does it have to change at all?
- An empty group is a real state of the page, not an error. What does a person need to read there to understand the page is working?
- Declined is a third status. Where in the code is "Going or not Going" assumed, and what breaks when a third value arrives?

**Read more:** [Conditional Rendering](https://react.dev/learn/conditional-rendering), in the official React guide.

### How to approach it

1. **The groups.** In `MyEvents.jsx`, take `events` and `onStatusChange` as props. Build an array of three objects, each with a `status` and the matching `events.filter(...)`. This is not state; it is computed from `events` every time.
2. **Draw them.** `groups.map(...)` returns a `<section>` per group with an `<h2>` and, inside, either an empty-state `<p>` when `group.events.length === 0`, or an `<EventList>` for the group. Use `group.status` as the `key` and as the `view` prop so each list's `id` is different.
3. **Pass the handler.** In `App.jsx`, give the My Events route `onStatusChange={handleStatusChange}` so the pills on this page work too.
4. **Decline.** In `EventDetails.jsx`, write `handleDecline()` that calls `onStatusChange(event.id, "Declined")`. Give `RsvpForm` an optional `cancelLabel` prop (default `"Cancel"`) and pass `cancelLabel="Decline"` with `onCancel={handleDecline}`.
5. **Three statuses on the page.** Replace the Going-or-form conditional with three: Going shows the sentence, Declined shows "You declined this invitation. Changed your mind?" with a Change your response button that sets the status back to Invited, Invited shows the form.
6. **Three statuses on the pill.** In `EventCard.jsx`, extend `statusClass` so Declined gets `invitation-status is-declined` (the class already exists in `styles.css`). The click handler can stay as it is: anything that is not Going becomes Going.
7. **Styles.** Paste the `/* Part 8 additions */` block from the Exact code box below onto the end of your `styles.css`.
8. Save. Open My Events, decline something from its page, come back.

<details>
<summary><strong>Exact code</strong> — open this only if you are still stuck after trying</summary>

`src/pages/MyEvents.jsx`, the whole file:

```jsx
import EventList from "../components/EventList.jsx";

export default function MyEvents(props) {
  const { events, onStatusChange } = props;

  const groups = [
    { status: "Going", events: events.filter((event) => event.status === "Going") },
    { status: "Invited", events: events.filter((event) => event.status === "Invited") },
    { status: "Declined", events: events.filter((event) => event.status === "Declined") },
  ];

  return (
    <main id="events-main" className="events-main">
      <div className="events-title-row">
        <h1>My Events</h1>
      </div>

      {groups.map((group) => (
        <section className="my-events-group" key={group.status} aria-labelledby={"group-" + group.status.toLowerCase()}>
          <h2 id={"group-" + group.status.toLowerCase()}>{group.status}</h2>
          {group.events.length === 0 ? (
            <p className="empty-state">Nothing here yet. Events you mark as {group.status.toLowerCase()} will show up here.</p>
          ) : (
            <EventList events={group.events} view={group.status.toLowerCase()} onStatusChange={onStatusChange} />
          )}
        </section>
      ))}
    </main>
  );
}
```

**What this code does.** `groups` is built from `events` on every render, so it can never be out of date. The outer `map()` draws one section per group; the inner `EventList` is the same component the Events page uses, given a shorter list. `condition ? a : b` picks the empty-state paragraph or the list. `aria-labelledby` ties each section to its heading so a screen reader announces "Going, region".

`src/App.jsx`, the one route that changes:

```jsx
        <Route path="/my-events" element={<MyEvents events={events} onStatusChange={handleStatusChange} />} />
```

`src/pages/EventDetails.jsx`, the lines that change:

```jsx
  function handleDecline() {
    onStatusChange(event.id, "Declined");
  }

  const statusClass =
    event.status === "Going" ? "invitation-status is-going" : event.status === "Declined" ? "invitation-status is-declined" : "invitation-status";
```

```jsx
        {event.status === "Going" && <p className="rsvp-card">You are going. See you there.</p>}
        {event.status === "Declined" && (
          <p className="rsvp-card">
            You declined this invitation. Changed your mind?{" "}
            <button type="button" className="secondary-button" onClick={() => onStatusChange(event.id, "Invited")}>
              Change your response
            </button>
          </p>
        )}
        {event.status === "Invited" && (
          <RsvpForm event={event} onSubmit={handleRsvpSubmit} onCancel={handleDecline} cancelLabel="Decline" />
        )}
```

**What this code does.** `condition && (…)` draws the JSX only when the condition is true, so exactly one of the three blocks appears. `{" "}` is a space; JSX drops the whitespace between a sentence and a tag on a new line, so it is put back on purpose.

`src/components/RsvpForm.jsx`, the two lines that change:

```jsx
  const { event, onSubmit, onCancel, cancelLabel = "Cancel" } = props;
```

```jsx
        <button type="button" className="secondary-button" onClick={onCancel}>{cancelLabel}</button>
```

**What this code does.** `cancelLabel = "Cancel"` in the destructuring is a default: the prop is used when it is passed and "Cancel" when it is not.

`src/components/EventCard.jsx`, the lines that change:

```jsx
  const statusClass =
    status === "Going" ? "invitation-status is-going" : status === "Declined" ? "invitation-status is-declined" : "invitation-status";
```

`src/styles.css`, added at the end (group spacing and the dashed empty state):

```css
/* Part 8 additions: My Events groups and the empty state. */
.my-events-group { margin-top: 28px; }
.my-events-group h2 { margin: 0 0 12px; font-size: 18px; font-weight: 600; }
.empty-state { margin: 0; padding: 16px 18px; border: 1px dashed var(--line); border-radius: 12px; color: var(--secondary); }
```

</details>

## Success check

My Events shows three headed groups. One is empty and says so. Decline an event from its page and it moves groups; press "Change your response" and it moves back. Change a pill on Events and My Events agrees without a refresh. Explain why the groups are not state. Take a screenshot now for your PDF: the whole StackBlitz window, with `MyEvents.jsx` open and My Events in the preview.
