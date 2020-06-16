"use strict";
const container = document.querySelector(".container");
const all_seats = [...document.querySelectorAll(".row .seat")];
const countDisplay = document.getElementById("count");
const viewingDisplay = document.getElementById("viewing");
const totalCostDisplay = document.getElementById("total");
const viewingSelect = document.getElementById("movie");
let viewing_times = ["2:30 PM", "5:00 PM", "7:30 PM", "10:00 PM"];
let booked_seats = [
    [28, 32, 33, 34, 41],
    [2, 20, 33, 12, 40, 6],
    [1, 4, 6],
    [47],
];
let selected_seats = [];
loadAvailableViewings();
loadLocalStorage();
let viewing_time = viewing_times[viewingSelect.selectedIndex];
let viewing_index = viewingSelect.selectedIndex;
loadBookings();
function loadBookings() {
    all_seats.forEach((seat, index) => {
        if (booked_seats[viewing_index].indexOf(index) > -1) {
            seat.classList.add("unavail");
        }
    });
}
function updateViewing() {
    localStorage.setItem("selectedViewingIndex", viewing_index.toString());
    viewingDisplay.innerText = viewing_times[viewing_index];
}
function clearSeats() {
    selected_seats = [];
    updateSeats();
    all_seats.forEach((seat) => {
        seat.classList.remove("selected", "unavail");
    });
}
function updateSeats() {
    localStorage.setItem("selectedSeats", JSON.stringify(selected_seats));
    const selected_count = selected_seats.length;
    countDisplay.innerText = selected_count.toString();
    totalCostDisplay.innerText = "$" + (selected_count * 20).toString();
}
function loadAvailableViewings() {
    let new_inner = "";
    viewing_times.forEach((time, index) => {
        new_inner += '<option value="' + index + '">' + time + "</option>";
    });
    viewingSelect.innerHTML = new_inner;
}
function loadLocalStorage() {
    selected_seats = JSON.parse(localStorage.getItem("selectedSeats")) || [];
    if (selected_seats !== null && selected_seats.length > 0) {
        all_seats.forEach((seat, index) => {
            if (selected_seats.indexOf(index) > -1) {
                seat.classList.add("selected");
            }
        });
    }
    const selected_viewing_index = localStorage.getItem("selectedViewingIndex");
    if (selected_viewing_index !== null) {
        viewingSelect.selectedIndex = +selected_viewing_index;
    }
}
viewingSelect.addEventListener("change", (e) => {
    let target = e.target;
    viewing_index = target.selectedIndex;
    updateViewing();
    clearSeats();
    loadBookings();
});
container.addEventListener("click", (e) => {
    let target = e.target;
    if (target.classList.contains("seat") &&
        !target.classList.contains("unavail")) {
        let seat_index = all_seats.indexOf(target);
        if (target.classList.toggle("selected")) {
            selected_seats.push(seat_index);
        }
        else {
            selected_seats.splice(selected_seats.indexOf(seat_index), 1);
        }
        updateSeats();
    }
});
updateSeats();
updateViewing();
//# sourceMappingURL=script.js.map