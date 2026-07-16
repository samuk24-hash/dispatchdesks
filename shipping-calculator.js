/* =========================================================================
   shipping-calculator.js  —  the code WITHOUT the pattern.

   This is the file to study. Notice that the service level is just a string,
   and that string gets switched on in TWO separate places below:
   once in cost(), and again in estimatedDays().

   Keep that in mind when you're asked to add a new service level...
   ========================================================================= */

export class ShippingCalculator {

  cost(order) {
    let c;
    switch (order.method) {
      case "standard":
        c = 5.0 + 0.50 * order.weightKg;
        break;
      case "express":
        c = 12.0 + 0.75 * order.weightKg + 0.02 * order.distanceKm;
        break;
      case "overnight":
        c = 30.0 + 1.20 * order.weightKg + 0.05 * order.distanceKm;
        break;
      case "same_day":
        c = 20.0 + 1.00 * order.weightKg + 0.10 * order.distanceKm;
        break;
      case "drone":
          if (order.distanceKm > 30) {
          throw new Error("Drone delivery is not available beyond 30 km");
        }
        c = 8.0 + 2.00 * order.weightKg + 0.03 * order.distanceKm;
        break;
      case "scheduled":
        c = Math.max(5.0, 15.0 - 0.50 * order.daysChosen);
        break;
      case "teleport":
        c = 50.0 + 0.10 * order.weightKg;
        break;
      default:
        throw new Error(`Unknown shipping method: ${order.method}`);
    }
    if (order.international) c += 15.0;
    return Math.round(c * 100) / 100;
  }

  estimatedDays(order) {
    let days;
    switch (order.method) {                 // <-- the second switch (the trap)
      case "standard":  days = 5; break;
      case "express":   days = 2; break;
      case "overnight": days = 1; break;
      case "same_day":  days = 1; break;
      case "drone":     days = 1; break;
        if (order.distanceKm > 30) throw new Error("Drone shipping is limited to 30 km");
        break;
      case "scheduled":
      days = order.daysChosen;
      break;
      case "teleport":
      days = 0;
      break;
      default:
        throw new Error(`Unknown shipping method: ${order.method}`);
    }
    if (order.international) days += 3;
    return days;
  }
}
