# Dispatch Desk — shipping calculator

A tiny web app that quotes a shipping **cost** and an **estimated delivery time**
based on the parcel's weight, distance, destination, and chosen service level.

This is a **deliberately un-refactored** codebase. Your job over the next few
exercises is to *extend* it and pay close attention to what feels repetitive,
fragile, or awkward. That friction is the whole point — keep notes as you go.

---

## Running it

The app uses ES modules (`import` / `export`), which browsers only load over
`http://`. Opening `index.html` by double-clicking it (`file://`) **will not
work** — run it through a local server instead. The easiest way is VS Code's
**Live Server** extension.

1. **Install the extension.** In VS Code, open the Extensions panel
   (`Ctrl/Cmd + Shift + X`), search for **Live Server** (by Ritwick Dey), and
   click **Install**.
2. **Open the project folder.** `File → Open Folder…` and select the
   `dispatch-desk` folder (the one containing `index.html`).
3. **Go live.** Either:
   - right-click `index.html` in the Explorer and choose **Open with Live
     Server**, or
   - open `index.html` and click **Go Live** in the bottom-right status bar.
4. Your browser opens at something like `http://127.0.0.1:5500/index.html`.
   Every time you save a file, the page reloads automatically.
5. **To stop:** click **Port: 5500** in the status bar, or right-click and
   choose **Stop Live Server**.

---

## What's in the box

| File | What it is |
|------|-----------|
| `index.html` | The page markup. Loads the stylesheet and the app. |
| `styles.css` | All the styling. You won't need to touch this. |
| `shipping-calculator.js` | **The code to study.** The quoting logic lives here. |
| `app.js` | UI wiring — reads the controls, calls the calculator, paints the readout. |

Start by reading `shipping-calculator.js`. It's short. Notice how the service
level is a plain string, and how that string is inspected in **two** separate
methods.

> One rule for these exercises: extend the code in the most direct way the
> current structure suggests. **Don't redesign it yet.** Feeling the friction
> of the current design is exactly what we're after.

---

## Exercises

Treat each of these as a ticket handed to you by the Dispatch Desk product team.

### Ticket 1 — Two new service levels

Operations wants to offer two more options. Wire them up so both the **cost**
and the **estimated delivery** work when selected:

| Level | Base | Per kg | Per km | Est. delivery |
|-------|-----:|-------:|-------:|--------------:|
| `same_day` | 20.00 | 1.00 | 0.10 | 1 day |
| `drone`    |  8.00 | 2.00 | 0.03 | 1 day |

To add one level you'll need to: add a radio button in `index.html`, and add a
branch in the calculator. Add **`same_day`** first, select it in the browser,
and see what happens.

> **Feel it:** You just made *one* conceptual change — "add a service level."
> How many files did you edit? How many separate places? What did the app do
> if you updated one branch but forgot the other? Now add `drone` and count
> the same edits again.

*Stretch:* drones can only fly short distances — reject `drone` when distance
is over 30 km. Where does that rule end up living?

### Ticket 2 — Compare every level at once

Sales wants a **comparison view**: show the cost of *every* service level side
by side for the current parcel, so the customer can pick. Add a small panel
that lists each level and its cost, without changing the selected radio.

> **Feel it:** To loop over "every service level," you need a list of them —
> where does that list actually live right now? How many copies of it exist by
> the time you're done? Could you run *just* the express calculation from your
> new panel without dragging the rest of the app along?

### Ticket 3 — Scheduled delivery

Add a **`scheduled`** level: the customer chooses how many days out they're
willing to wait, and the price drops the longer they wait
(`cost = 15.00 − 0.50 × days_chosen`, never below 5.00). The days they pick is
also the delivery estimate. This needs a new input that only appears for this
one level.

> **Feel it:** This level carries its own piece of data — the chosen number of
> days. Where does that data naturally belong? Does a `switch` case give it a
> home? What happened to the calculator's method signatures once one branch
> needed an extra value the others don't?

### Bonus — Test one algorithm in isolation

Write a quick test (or just a scratch script) that checks the **express** cost
for a known parcel — *without* opening the page or touching the UI.

> **Feel it:** How much of the app did you have to reach into to test one
> pricing rule? Could you hand someone just the express logic to verify?

---

## Before the next session

Keep a running list of every moment something felt repetitive, fragile, or
awkward — every place you had to change in lockstep, every list you had to
duplicate, every method signature that grew to serve a single branch, every
rule that had no obvious home.

Bring that list with you. Next time we'll introduce an idea whose entire job is
to erase those specific pains — and your list is how you'll judge whether it
actually does.
