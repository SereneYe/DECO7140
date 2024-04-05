export const postEvent = function (event) {
  var formData = new FormData();
  formData.append("name", event.name);
  formData.append("date_time", event.dateTime);
  formData.append("photo", event.photo);
  formData.append("organiser", event.organiser);
  formData.append("event_type", event.type);
  formData.append("location", event.location);
  formData.append("description", event.description);
  formData.append("website_code", event.websiteCode);

  const baseURL =
    "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community_events/";
  const requestOptions = {
    method: "POST",
    body: formData,
    redirect: "follow",
  };

  return fetch(baseURL, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log("error", error);
      throw error;
    });
};