/* -------------------------------------------------------------
        EVENTS RENDERING
------------------------------------------------------------- */

// Data

$.holdReady(true);
$.getJSON("data/events.json", (data, status) => {
  let events = data;

  // Presentation
  const eventsContainer = $(".events-slider");
  let htmlEvents = "";
  events.forEach(event => {
    htmlEvents += buildEvent(event);
  });
  eventsContainer.html(htmlEvents);
  $.holdReady(false);
});

function buildEvent(event) {
  let title = event && event.title ? event.title : "Add Event title";
  let description = event && event.description ? event.description : "";
  let date = event && event.date ? event.date : "date";
  let location =
    event && event.location ? event.location : "Navrachna University";
  let btnText = event && event.btnText ? event.btnText : null;
  let btnLink = event && event.form_link ? event.form_link : "#";
  let imageUrl =
    event && event.image_url ? event.image_url : "assets/images/events/e1.png";

  if (btnText != null) {
    return `
  <div class="events-slider-item">
    <div class="card">
      <img
        src="${imageUrl}"
        class="card-img-top"
      />
      <div class="card-body text-center">
        <h3 class="card-title">${title}</h3>
        <p class="card-text text-body">${description}</p>
        <hr />
        <ul class="event-info list-inline">
          <li class="list-inline-item">
            <i class="far fa-calendar-alt"></i>${date}
          </li>
          <li class="list-inline-item">
            <i class="fas fa-map-marker-alt"></i>${location}
          </li>
        </ul>
          <a href="${btnLink}" class="btn btn-primary" id="eventBtn" target="_blank">${btnText}</a>
      </div>
    </div>
  </div>
  `;
  }
  else {
    return `
  <div class="events-slider-item">
    <div class="card">
      <img
        src="${imageUrl}"
        class="card-img-top"
      />
      <div class="card-body text-center">
        <h3 class="card-title">${title}</h3>
        <p class="card-text text-body">${description}</p>
        <hr />
        <ul class="event-info list-inline">
          <li class="list-inline-item">
            <i class="far fa-calendar-alt"></i>${date}
          </li>
          <li class="list-inline-item">
            <i class="fas fa-map-marker-alt"></i>${location}
          </li>
        </ul>
      </div>
    </div>
  </div>
  `;
  }
}
