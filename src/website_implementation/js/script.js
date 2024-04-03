function fetchEvents() {
  const baseURL =
    "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community_events/";

  const my_website_code = "serene12345";
  const queryParams = {
    website_code: my_website_code,
  };

  const queryString = new URLSearchParams(queryParams).toString();
  const urlWithParams = baseURL + "?" + queryString;

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch(urlWithParams, requestOptions)
    .then((response) => response.json())
    .then((jsonResponse) => {
      return jsonResponse;
    });
}

fetchEvents().then((events) => {
  events.map((event) => {
    console.log(event);
  });
});
