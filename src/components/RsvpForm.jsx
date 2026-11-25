// Parts 9 and 10: validation, the RSVP states, and where focus goes. Read and test.
//
// The form can be in one of five states, kept in formState:
//   "selected"   the form is open for the selected event, nothing sent yet
//   "invalid"    the person pressed Accept Invite and at least one field has a problem
//   "submitting" the RSVP is on its way (simulated: it takes about a second)
//   "confirmed"  it worked (EventDetails then shows "You are going")
//   "failed"     it did not work, and the person can try again
// Every state is shown in words on the page, never by color alone.

import { useEffect, useRef, useState } from "react";

// Returns an object of error messages, one per field with a problem. Empty object = all good.
export function validate({ name, email, guests }) {
  const errors = {};
  if (name.trim() === "") {
    errors.name = "Enter your name so the host knows who is coming.";
  }
  if (email.trim() === "") {
    errors.email = "Enter an email address. The ticket goes there.";
  } else if (!email.includes("@")) {
    errors.email = "That email address is missing an @.";
  }
  const guestCount = Number(guests);
  if (Number.isNaN(guestCount) || guestCount < 0 || guestCount > 3) {
    errors.guests = "Choose between 0 and 3 guests.";
  }
  return errors;
}

// Simulates sending the RSVP to a server. Resolves after a short delay.
// To test the failed state, use an email ending in @fail.test.
function sendRsvp(rsvp) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (rsvp.email.endsWith("@fail.test")) {
        reject(new Error("The RSVP service did not respond."));
      } else {
        resolve();
      }
    }, 900);
  });
}

export default function RsvpForm(props) {
  const { event, onSubmit, onCancel, cancelLabel = "Cancel" } = props;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState("0");
  const [note, setNote] = useState("");

  const [formState, setFormState] = useState("selected");
  const [errors, setErrors] = useState({});

  // Part 10: handles on the three fields that can be invalid, and on the summary message.
  const fieldRefs = { name: useRef(null), email: useRef(null), guests: useRef(null) };
  const summaryRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const found = validate({ name, email, guests });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFormState("invalid");
      // After a validation failure: focus the first field with a problem, in page order.
      const firstInvalid = ["name", "email", "guests"].find((field) => found[field]);
      fieldRefs[firstInvalid].current.focus();
      return;
    }

    setFormState("submitting");
    const rsvp = { name, email, guests: Number(guests), note };
    try {
      await sendRsvp(rsvp);
      setFormState("confirmed");
      onSubmit(rsvp);
    } catch (error) {
      setFormState("failed");
    }
  }

  // After a failure: once the message is on the page, focus it so it is read and seen.
  useEffect(() => {
    if (formState === "failed") {
      summaryRef.current?.focus();
    }
  }, [formState]);

  const isSubmitting = formState === "submitting";

  return (
    <form className="rsvp-card rsvp-form" onSubmit={handleSubmit} aria-labelledby="rsvp-heading" noValidate>
      <div>
        <h2 id="rsvp-heading">RSVP to {event.title}</h2>
        <p className="rsvp-intro">
          {event.dateLabel ?? event.weekday}, {event.time}. {event.location}.
        </p>
      </div>

      {formState === "invalid" && (
        <p className="form-error" id="rsvp-summary">
          Please fix the {Object.keys(errors).length === 1 ? "field" : "fields"} marked below.
        </p>
      )}
      {formState === "failed" && (
        <p className="form-error" id="rsvp-summary" ref={summaryRef} tabIndex={-1}>
          We couldn’t send your RSVP. Nothing was lost. Press Try again.
        </p>
      )}

      <div className="field">
        <label htmlFor="rsvp-name">Your name</label>
        <input
          id="rsvp-name"
          ref={fieldRefs.name}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? "rsvp-name-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.name && <p className="form-error" id="rsvp-name-error">{errors.name}</p>}
      </div>

      <div className="field">
        <label htmlFor="rsvp-email">Email</label>
        <p className="hint" id="rsvp-email-hint">We only use it to send your ticket.</p>
        <input
          id="rsvp-email"
          ref={fieldRefs.email}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "rsvp-email-hint rsvp-email-error" : "rsvp-email-hint"}
          disabled={isSubmitting}
        />
        {errors.email && <p className="form-error" id="rsvp-email-error">{errors.email}</p>}
      </div>

      <div className="field">
        <label htmlFor="rsvp-guests">Guests</label>
        <p className="hint" id="rsvp-guests-hint">How many people you are bringing, not counting you. Up to 3.</p>
        <select
          id="rsvp-guests"
          ref={fieldRefs.guests}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          aria-invalid={errors.guests ? "true" : undefined}
          aria-describedby={errors.guests ? "rsvp-guests-hint rsvp-guests-error" : "rsvp-guests-hint"}
          disabled={isSubmitting}
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        {errors.guests && <p className="form-error" id="rsvp-guests-error">{errors.guests}</p>}
      </div>

      <div className="field">
        <label htmlFor="rsvp-note">Note to the host (optional)</label>
        <textarea id="rsvp-note" value={note} onChange={(e) => setNote(e.target.value)} disabled={isSubmitting} />
      </div>

      <div className="rsvp-actions">
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : formState === "failed" ? "Try again" : "Accept Invite"}
        </button>
        <button type="button" className="secondary-button" onClick={onCancel} disabled={isSubmitting}>
          {cancelLabel}
        </button>
      </div>
      <p className="form-state" aria-hidden="true">State: {formState}</p>
    </form>
  );
}
