// tsc .\app-new.ts --outFile .\app-new.g.js --target es2017
/**
 * Function to construct a card given a JSON object
 * @param json The JSON source of data
 * @returns HTML string with the approppriate card
 */
function eventCardFromJson(json) {
    let obj = toEventInterface(json);
    let card = document.createElement('div');
    card.className = "evt card";
    if (obj.image_url !== '') {
        let cardImage = document.createElement('img');
        cardImage.src = obj.image_url;
        cardImage.className = "card-img-top";
        // TODO: Set image alt property in JSON
        // cardImage.alt=
        card.appendChild(cardImage);
    }
    let cardBody = document.createElement('div');
    cardBody.className = "card-body";
    let cardTitle = document.createElement('h5');
    cardTitle.innerText = obj.title;
    cardTitle.className = "card-title";
    cardBody.appendChild(cardTitle);
    let cardText = document.createElement('p');
    cardText.innerText = obj.description;
    cardText.className = "card-text";
    cardBody.appendChild(cardText);
    if (obj.date !== "") {
        let cardDate = document.createElement('a');
        cardDate.className = "icon-link icon-link-hover link-underline link-underline-opacity-0";
        cardDate.title = `Add ${obj.date} to your Google Calendar`;
        cardDate.innerHTML = `<i class="bi-calendar2-event"></i>${obj.date}`;
        // Constructing the Google calendar link
        // Ref: https://support.google.com/calendar/thread/81344786?hl=en&msgid=81423288
        // TL;DR: https://calendar.google.com/calendar/render?action=TEMPLATE&text=Example+Google+Calendar+Event&details=More+help+see:+https://support.google.com/calendar/thread/81344786&dates=20201231T160000/20201231T170000&recur=RRULE:FREQ%3DWEEKLY;UNTIL%3D20210603&ctz=America/Toronto
        // Older Ref: Update in https://stackoverflow.com/a/19867654
        let baseUrl = 'https://calendar.google.com/calendar/render';
        // Doing it this way because this handles all of the encodings automatically.
        let calUrl = new URL(baseUrl);
        // Constant
        calUrl.searchParams.set('action', 'TEMPLATE');
        // Event Name
        calUrl.searchParams.set('text', obj.title);
        // Event Description
        calUrl.searchParams.set('details', obj.description);
        // Event Date
        let startDate;
        let startDateString;
        let endDate;
        let endDateString;
        if (obj.date.includes('/')) {
            // Start and End dates are explicitly mentioned, use them.
            let parts = obj.date.split('/');
            startDate = new Date(parts[0]);
            endDate = new Date(parts[1]);
        }
        else {
            startDate = new Date(obj.date);
            endDate = new Date(startDate);
            // Set the end time to be 1 hr later
            // Seems to handle date rollover well enough
            endDate.setHours(endDate.getHours() + 1);
        }
        calUrl.searchParams.set('dates', `${toGcalTimeSTring(startDate)}/${toGcalTimeSTring(endDate)}`);
        // Assuming all events are IST
        calUrl.searchParams.set('ctz', 'India/Kolkata');
        if (obj.location !== "") {
            calUrl.searchParams.set('location', obj.location);
        }
        cardDate.href = calUrl.toString();
        // 
        cardBody.appendChild(cardDate);
    }
    if (obj.location !== "") {
        let cardLocation = document.createElement('a');
        cardLocation.className = "icon-link icon-link-hover link-underline link-underline-opacity-0";
        cardLocation.title = `Its happening @ ${obj.location}`;
        cardLocation.innerHTML = `<i class="bi-geo-alt"></i>${obj.location}`;
        cardBody.appendChild(cardLocation);
    }
    // Add after assembling card body
    card.appendChild(cardBody);
    return card;
    // Old string-based code
    // return `
    // <div class="evt card" style="width: 18rem;">
    //                 <img src="${obj.image_url}" class="card-img-top" alt="Code Loops Image">
    //                 <div class="card-body">
    //                     <h5 class="card-title">${obj.title}</h5>
    //                     <p class="card-text">${obj.description}</p>
    //                     <a class="icon-link icon-link-hover link-underline link-underline-opacity-0" href="#">
    //                         <i class="bi-geo-alt"></i>
    //                         ${obj.location}
    //                     </a>
    //                 </div>
    //             </div>
    // `;
}
function toGcalTimeSTring(date) {
    return `${date.getFullYear().toString().padStart(4, '0')}${date.getMonth().toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
}
async function getEvents(target = document.querySelector('#events  div.evts')) {
    console.log('Querying JSON...');
    const res = await fetch('data/events.json');
    console.log('Parsing JSON...');
    const events = await res.json();
    console.log('Generating DOM...');
    let childNodes = events.map(eventCardFromJson);
    // Empty out existing content, usu placeholder
    target.innerHTML = "";
    for (const childNode of childNodes) {
        target.appendChild(childNode);
    }
    return;
}
;
function toEventInterface(json) {
    // Default values
    let evt = {
        title: '',
        image_url: '',
        description: '',
        date: '',
        location: '',
        form_link: '',
        btnText: '',
    };
    if (!json) {
        return evt;
    }
    if (json.title) {
        evt.title = json.title;
    }
    if (json.image_url) {
        evt.image_url = json.image_url;
    }
    if (json.description) {
        evt.description = json.description;
    }
    if (json.date) {
        evt.date = json.date;
    }
    if (json.location) {
        evt.location = json.location;
    }
    if (json.form_link) {
        evt.form_link = json.form_link;
    }
    if (json.btnText) {
        evt.btnText = json.btnText;
    }
    return evt;
}
// Init stuff
getEvents();
