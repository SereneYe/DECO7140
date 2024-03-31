const baseURL =
  "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community_events/";

const my_website_code = "Pete123";
const queryParams = {
  website_code: my_website_code,
};

const queryString = new URLSearchParams(queryParams).toString();
const urlWithParams = baseURL + "?" + queryString;

const requestOptions = {
  method: "GET",
  redirect: "follow",
};

fetch(urlWithParams, requestOptions)
  .then((response) => response.json())
  .then((jsonResponse) => {
    const resultDiv = document.querySelector("#result");

    const uniqueEvents = jsonResponse.reduce((acc, current) => {
      const x = acc.find((item) => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    uniqueEvents.map((event) => {
      const eventDiv = document.createElement("div");

      const title = document.createElement("h2");
      title.innerHTML = event.name;
      eventDiv.appendChild(title);

      const location = document.createElement("p");
      location.innerHTML = `<strong>Location: </strong> ${event.location}`;
      eventDiv.appendChild(location);

      const organiser = document.createElement("p");
      organiser.innerHTML = `<strong>Organiser: </strong> ${event.organiser}`;
      eventDiv.appendChild(organiser);

      const eventType = document.createElement("p");
      eventType.innerHTML = `<strong>Event Type: </strong> ${event.event_type}`;
      eventDiv.appendChild(eventType);

      const description = document.createElement("p");
      description.innerHTML = `<strong>Description: </strong> ${event.description}`;
      eventDiv.appendChild(description);

      const dateTime = document.createElement("p");
      dateTime.innerHTML = `<strong>Date Time: </strong> ${event.date_time}`;
      eventDiv.appendChild(dateTime);

      if (event.photo) {
        const photo = document.createElement("img");
        photo.src = event.photo;
        photo.alt = event.name;
        photo.style.width = "200px";
        photo.style.height = "auto";
        eventDiv.appendChild(photo);
      }

      eventDiv.className = "event-data";
      resultDiv.appendChild(eventDiv);
    });
  });
