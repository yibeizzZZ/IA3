// Part 5: ViewSwitch no longer keeps the selected view itself.
// App tells it which view is selected and gives it a function to call on a click.

export default function ViewSwitch(props) {
  const { selected, onSelect } = props;

  return (
    <div className="event-view-switcher" role="group" aria-label="Event timeframe">
      <button
        type="button"
        className={selected === "upcoming" ? "is-selected" : ""}
        aria-pressed={selected === "upcoming"}
        onClick={() => onSelect("upcoming")}
      >
        Upcoming
      </button>
      <button
        type="button"
        className={selected === "past" ? "is-selected" : ""}
        aria-pressed={selected === "past"}
        onClick={() => onSelect("past")}
      >
        Past
      </button>
    </div>
  );
}
