class RouteStop {
    constructor(id, previous, next, stopId, minutesFromPrevRouteStop, prizeFromPrevRouteStop) {
      this.id = id;
      this.previous = previous;
      this.next = next;
      this.stopId = stopId;
      this.minutesFromPrevRouteStop = minutesFromPrevRouteStop;
      this.prizeFromPrevRouteStop = prizeFromPrevRouteStop;
    }
  }
  
  module.exports = RouteStop;
  