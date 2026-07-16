/* =========================================================================
   app.js  —  UI wiring (not the point).

   Reads the controls into a plain `order` object, hands it to the
   ShippingCalculator, and paints the readout. The only interesting bit
   for the lesson: when a switch has no branch for the selected method,
   the calculator throws, and that error is shown on screen (in red)
   instead of failing silently.

   Imports the calculator as an ES module — the module graph guarantees
   shipping-calculator.js loads first, so no manual ordering is needed.
   ========================================================================= */

import { ShippingCalculator } from "./shipping-calculator.js";

const calc = new ShippingCalculator();

const el = {
  weight:   document.getElementById("weight"),
  distance: document.getElementById("distance"),
  intl:     document.getElementById("intl"),
  weightVal:   document.getElementById("weightVal"),
  distanceVal: document.getElementById("distanceVal"),
  costLed:  document.getElementById("costLed"),
  etaLed:   document.getElementById("etaLed"),
  status:   document.getElementById("status"),
  statusText: document.getElementById("statusText"),
  comparison: document.getElementById("comparison"),
  scheduledDays: document.getElementById("scheduledDays"),
  scheduledDaysWrap: document.getElementById("scheduledDaysWrap"),
};

function allMethods() {
  return Array.from(document.querySelectorAll('input[name="method"]'))
    .map(input => input.value);
}

function paintComparison() {
  const base = readOrder();
  const rows = allMethods().map(method => {
    try {
      const cost = calc.cost({ ...base, method });
      return `<div class="cmp-row"><span>${method}</span><span>$${cost.toFixed(2)}</span></div>`;
    } catch (err) {
      return `<div class="cmp-row cmp-error"><span>${method}</span><span>${err.message}</span></div>`;
    }
  }).join("");

  el.comparison.innerHTML = rows;
}

function readOrder() {
  return {
    weightKg:   parseFloat(el.weight.value),
    distanceKm: parseFloat(el.distance.value),
    international: el.intl.checked,
    method: document.querySelector('input[name="method"]:checked').value,
    daysChosen: parseFloat(el.scheduledDays.value),
  };
}

function paintSlider(input) {
  const min = +input.min, max = +input.max;
  const pct = ((input.value - min) / (max - min)) * 100;
  input.style.setProperty("--fill", pct + "%");
}

function flash(node) {
  node.classList.remove("settle");
  void node.offsetWidth;      // restart the animation
  node.classList.add("settle");
}

function recompute() {
  el.weightVal.textContent = parseFloat(el.weight.value).toFixed(1) + " kg";
  el.distanceVal.textContent = el.distance.value + " km";
  paintSlider(el.weight);
  paintSlider(el.distance);

  const isScheduled = document.querySelector('input[name="method"]:checked').value === "scheduled";
  el.scheduledDaysWrap.style.display = isScheduled ? "block" : "none";

  const order = readOrder();
  try {
    const cost = calc.cost(order);
    const days = calc.estimatedDays(order);

    el.costLed.textContent = "$" + cost.toFixed(2);
    el.etaLed.textContent  = days + (days === 1 ? " day" : " days");
    flash(el.costLed); flash(el.etaLed);

    el.status.classList.remove("error");
    el.statusText.textContent = "Quote ready · " + order.method;
  } catch (err) {
    // A missing switch branch lands here — loudly, on screen.
    el.costLed.textContent = "——";
    el.etaLed.textContent  = "——";
    el.status.classList.add("error");
    el.statusText.textContent = err.message;
  }
  paintComparison ();
}

["input", "change"].forEach(evt =>
  document.querySelectorAll("input").forEach(i => i.addEventListener(evt, recompute))
);

recompute();
