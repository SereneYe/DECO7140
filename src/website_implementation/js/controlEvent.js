export default class EventController {
  constructor(events) {
    this.events = Object.values(events);
  }

  sortEvents(sortBy) {
    let sortedEvents;
    if (sortBy === "order") sortedEvents = [...this.events].reverse();
    if (sortBy === "type" || sortBy === "name")
      sortedEvents = [...this.events].sort((a, b) =>
        a[sortBy].localeCompare(b[sortBy])
      );
    if (sortBy === "price" || sortBy === "intensity") {
      sortedEvents = [...this.events].sort(() => Math.random() - 0.5);
      return sortedEvents;
    }
    if (sortBy === "dateTime")
      sortedEvents = [...this.events].sort((a, b) => {
        const dateA = Date.parse(
          a[sortBy]
            .split(" ")
            .reverse()
            .join("-")
            .replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
        );
        const dateB = Date.parse(
          b[sortBy]
            .split(" ")
            .reverse()
            .join("-")
            .replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
        );
        return dateA - dateB;
      });
    return sortedEvents;
  }

  filterEvents(filterBy) {
    let filteredEvents = this.events.filter((event) => event.type === filterBy);
    return filteredEvents;
  }
}
