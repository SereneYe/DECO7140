const MY_WEBSITE_CODE = "serene12345";

export function fetchEvents() {
  const baseURL =
    "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community_events/";

  const queryParams = {
    website_code: MY_WEBSITE_CODE,
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
