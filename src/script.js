// ======== RÉFÉRENCES DES ÉLÉMENTS DU DOM ========
const calendarBody = document.getElementById("calendarBody"); // Corps du calendrier
const modal = document.getElementById("modal"); // Fenêtre modale pour les réservations
const form = document.getElementById("reservationForm"); // Formulaire du modal
const cancelBtn = document.getElementById("cancel"); // Bouton annuler dans le modal
const title = document.getElementById("modalTitle"); // Titre du modal

let selectedCell = null; // Cellule sélectionnée pour ajouter/modifier une réservation
const currentMonth = document.getElementById("currentMonth"); // Affichage du mois actuel

// ======== AFFICHAGE DU MOIS ========
function updateMonthDisplay(date) {
  const months = [
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
  ];
  currentMonth.textContent = months[date.getMonth()] + " " + date.getFullYear();
}

const today = new Date();
updateMonthDisplay(today); // Affiche le mois et l'année actuels

// ======== HEURES DU CALENDRIER ========
const hours = [
  "08:00","09:00","10:00","11:00","12:00","13:00","14:00",
  "15:00","16:00","17:00","18:00","19:00","20:00",
  "21:00","22:00","23:00","00:00"
];

// ======== CRÉATION DU CALENDRIER ========
function createCalendar() {
  calendarBody.innerHTML = ""; // Vide le calendrier avant de le remplir

  for (const hour of hours) { // Pour chaque heure
    const row = document.createElement("div");
    row.classList.add("row");

    // Cellule pour l'heure
    const timeCell = document.createElement("div");
    timeCell.classList.add("time");
    timeCell.textContent = hour;
    row.appendChild(timeCell);

    // Cellules pour chaque jour
    for (let day = 1; day <= 7; day++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if(day === 6 || day === 7) cell.classList.add("disabled"); // Samedi et dimanche
      else cell.addEventListener("click", () => openModal(cell)); // Ajouter réservation
      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }
}

// ======== OUVRIR LE MODAL ========
function openModal(cell) {
  selectedCell = cell; // Stocke la cellule sélectionnée
  const event = cell.querySelector(".event"); // Vérifie s'il y a déjà un événement

  if(event){
    // Si un événement existe, pré-remplir le formulaire pour modification
    const data = JSON.parse(event.dataset.info);
    document.getElementById("name").value = data.name;
    document.getElementById("startTime").value = data.start;
    document.getElementById("endTime").value = data.end;
    document.getElementById("people").value = data.people;
    document.getElementById("type").value = data.type;
    title.textContent = "Modifier la réservation";
  } else {
    // Sinon, formulaire vide pour ajouter une nouvelle réservation
    form.reset();
    title.textContent = "Ajouter une réservation";
  }

  modal.style.display = "flex"; // Affiche le modal
}

// ======== FERMER LE MODAL ========
cancelBtn.addEventListener("click", () => {
  modal.style.display = "none"; // Masque le modal
  form.reset(); // Réinitialise le formulaire
});

// ======== ENVOI DU FORMULAIRE ========
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Empêche l'envoi par défaut

  // Récupère les valeurs du formulaire
  const name = document.getElementById("name").value.trim();
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;
  const people = document.getElementById("people").value;
  const type = document.getElementById("type").value;

  // Vérifie que tous les champs sont remplis
  if(!name || !start || !end || !people || !type) {
    return alert("Veuillez remplir tous les champs !");
  }

  addReservation({name, start, end, people, type}); // Ajoute la réservation
  modal.style.display = "none"; // Masque le modal
  form.reset(); // Réinitialise le formulaire
});

// ======== AJOUT / MODIFICATION D'UNE RÉSERVATION ========
function addReservation(info){
  const oldEvent = selectedCell.querySelector(".event");
  if(oldEvent) oldEvent.remove(); // Supprime l'ancien événement si existant

  const event = document.createElement("div");
  event.classList.add("event");
  event.textContent = `${info.name} (${info.start}-${info.end})`;
  event.dataset.info = JSON.stringify(info); // Stocke les infos dans data

  // Couleur selon le type de réservation
  if(info.type === "vip") event.style.background = "#d9534f";
  else if(info.type === "standard") event.style.background = "#28a745";
  else if(info.type === "groupe") event.style.background = "#0275d8";
  else if(info.type === "anniversaire") event.style.background = "#f0ad4e";

  // Gestion du clic sur l'événement
  event.addEventListener("click", (e) => {
    e.stopPropagation(); // Empêche de déclencher le clic sur la cellule
    const choice = confirm("Modifier la réservation ? (Annuler = Supprimer)");
    if(choice) openModal(selectedCell); // Modifier
    else if(confirm("Voulez-vous supprimer cette réservation ?")) event.remove(); // Supprimer
  });

  selectedCell.appendChild(event); // Ajoute l'événement dans la cellule
}

// ======== INITIALISATION DU CALENDRIER ========
createCalendar(); // Génère le calendrier au chargement
