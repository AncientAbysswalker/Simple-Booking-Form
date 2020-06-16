// HTML Elements
const container = document.querySelector(".container")! as HTMLElement;
const all_seats = [...document.querySelectorAll(".row .seat")] as HTMLElement[];
let seats = [
  ...document.querySelectorAll(".row .seat:not(.unavail)"),
] as HTMLElement[];
const countDisplay = document.getElementById("count")! as HTMLElement;
const viewingDisplay = document.getElementById("viewing")! as HTMLElement;
const totalCostDisplay = document.getElementById("total")! as HTMLElement;
const viewingSelect = document.getElementById("movie")! as HTMLSelectElement;

// I would realistically expect to be able to retrieve viewing times and seat bookings from a server request
let viewing_times = ["2:30 PM", "5:00 PM", "7:30 PM", "10:00 PM"];
let booked_seats = [
  [28, 32, 33, 34, 41],
  [2, 20, 33, 12, 40, 6],
  [1, 4, 6],
  [47],
];

// Load local storage
let selected_seats: number[] = [];
loadAvailableViewings();
loadLocalStorage();
let viewing_time = viewing_times[viewingSelect.selectedIndex];
let viewing_index = viewingSelect.selectedIndex;
loadBookings();

// Load what seats are already booked for the chosen viewing
function loadBookings() {
  all_seats.forEach((seat, index) => {
    if (booked_seats[viewing_index].indexOf(index) > -1) {
      seat.classList.add("unavail");
    }
  });
}

// Save selected movie index and price
function updateViewing() {
  // Set local storage
  localStorage.setItem("selectedViewingIndex", viewing_index.toString());

  // Update Fields
  viewingDisplay.innerText = viewing_times[viewing_index];
}

// Set all seats to unselected
function clearSeats() {
  // Set local storage
  selected_seats = [];

  // Update Interface
  updateSeats();

  // Remove selected styling
  all_seats.forEach((seat) => {
    seat.classList.remove("selected", "unavail");
  });
}

// Update interface elements and local storage
function updateSeats() {
  // Set local storage
  localStorage.setItem("selectedSeats", JSON.stringify(selected_seats));

  // Update Fields
  const selected_count = selected_seats.length;
  countDisplay.innerText = selected_count.toString();
  totalCostDisplay.innerText = "$" + (selected_count * 20).toString();
}

// Load viewing times into the select element
function loadAvailableViewings() {
  let new_inner = "";
  viewing_times.forEach((time, index) => {
    new_inner += '<option value="' + index + '">' + time + "</option>";
  });

  // Place viewing times in list
  viewingSelect.innerHTML = new_inner;
}

// Get data from local storage and populate interface
function loadLocalStorage() {
  selected_seats = JSON.parse(localStorage.getItem("selectedSeats")) || [];

  // If there is data
  if (selected_seats !== null && selected_seats.length > 0) {
    seats.forEach((seat, index) => {
      if (selected_seats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }

  // Set selection per local storage
  const selected_viewing_index = localStorage.getItem("selectedViewingIndex");
  if (selected_viewing_index !== null) {
    viewingSelect.selectedIndex = +selected_viewing_index;
  }
}

// Viewing select event
viewingSelect.addEventListener("change", (e) => {
  let target = e.target as HTMLSelectElement;

  // Update viewing_index
  viewing_index = target.selectedIndex;

  // Update interface
  updateViewing();

  // Clear all seats (because different time and availability)
  clearSeats();

  // Load booked seats for viewing
  loadBookings();
});

// Seat click event
container.addEventListener("click", (e) => {
  let target = e.target as HTMLElement;

  // If the clicked seat can be purchased
  if (
    target.classList.contains("seat") &&
    !target.classList.contains("unavail")
  ) {
    let seat_index = seats.indexOf(target);

    // Toggle seat and add/remove from selected_seats
    if (target.classList.toggle("selected")) {
      selected_seats.push(seat_index);
    } else {
      selected_seats.splice(selected_seats.indexOf(seat_index), 1);
    }

    // Update interface
    updateSeats();
  }
});

// Update interface to initial values
updateSeats();
updateViewing();
