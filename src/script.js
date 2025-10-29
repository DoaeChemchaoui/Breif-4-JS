const calendar = document.getElementById("calendar");
const modal = document.getElementById("modal");
const form = document.getElementById("reservationForm");
const nameInput = document.getElementById("name");
const dayInput = document.getElementById("day");
const hourInput = document.getElementById("hour");
const cancelBtn = document.getElementById("cancel");

const days = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const hours = Array.from({length:24}, (_,i)=>i); // 0-23

let reservations = [];
let editing = null;

// Fonction pour afficher en format 12h
function formatHour(h){
  let suffix = h < 12 ? "AM" : "PM";
  let hour12 = h % 12;
  if(hour12===0) hour12 = 12;
  return hour12 + suffix;
}

// Créer le calendrier
function createCalendar(){
  calendar.innerHTML = "";
  calendar.appendChild(document.createElement("div")); // case vide en haut à gauche

  // afficher jours
  days.forEach(day=>{
    const div = document.createElement("div");
    div.className="day-label";
    div.textContent = day;
    calendar.appendChild(div);
  });

  // afficher heures et cellules
  hours.forEach(hour=>{
    const timeLabel = document.createElement("div");
    timeLabel.className="time-label";
    timeLabel.textContent = formatHour(hour);
    calendar.appendChild(timeLabel);

    days.forEach(day=>{
      const cell = document.createElement("div");
      cell.className="cell";
      cell.dataset.day = day;
      cell.dataset.hour = hour;

      if(day === "Samedi" || day === "Dimanche"){
        cell.classList.add("disabled");
      } else {
        cell.addEventListener("click", ()=>{
          const existing = reservations.find(r=>r.day===day && r.hour===hour);
          if(existing){
            editReservation(existing);
          } else {
            addReservation(day, hour);
          }
        });
      }

      calendar.appendChild(cell);
    });
  });
}

// Ouvrir modal pour ajouter
function addReservation(day, hour){
  dayInput.value = day;
  hourInput.value = hour;
  nameInput.value = "";
  editing = null;
  modal.style.display = "flex";
}

// Ouvrir modal pour modifier
function editReservation(res){
  dayInput.value = res.day;
  hourInput.value = res.hour;
  nameInput.value = res.name;
  editing = res;
  modal.style.display = "flex";
}

// Ajouter / modifier réservation
form.addEventListener("submit", function(e){
  e.preventDefault();
  const name = nameInput.value.trim();
  const day = dayInput.value;
  const hour = parseInt(hourInput.value);

  if(editing){
    editing.name = name; // modifier
  } else {
    if(reservations.find(r=>r.day===day && r.hour===hour)){
      alert("Ce créneau est déjà pris !");
      return;
    }
    reservations.push({name, day, hour}); // ajouter
  }

  modal.style.display = "none";
  updateCalendar();
});

// Fermer modal
cancelBtn.addEventListener("click", ()=>{
  modal.style.display = "none";
});

// Mettre à jour le calendrier
function updateCalendar(){
  document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = "");

  reservations.forEach(r=>{
    const cell = document.querySelector(`.cell[data-day="${r.day}"][data-hour="${r.hour}"]`);
    if(cell){
      const div = document.createElement("div");
      div.className="event";
      div.textContent = r.name;

      // clic sur l'événement
      div.addEventListener("click", e=>{
        e.stopPropagation(); // éviter le clic sur la cellule
        const action = prompt("Tapez 'M' pour modifier, '' pour supprimer :");
        if(action === "s"){
          reservations = reservations.filter(res => res !== r);
          updateCalendar();
        } else if(action === "m"){
          editReservation(r);
        }
      });

      cell.appendChild(div);
    }
  });
}


// Initialiser le calendrier
createCalendar();
updateCalendar();
