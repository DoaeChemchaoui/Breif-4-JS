// ==== Éléments HTML ====
const calendarBody = document.getElementById("calendarBody"); // Corps du calendrier
const modal = document.getElementById("modal"); // Fenêtre modale
const form = document.getElementById("reservationForm"); // Formulaire
const cancelBtn = document.getElementById("cancel"); // Bouton annuler
const title = document.getElementById("modalTitle"); // Titre du modal
const Month = document.getElementById("Month"); // Affichage du mois

let selectedCell = null; // La cellule sélectionnée pour ajouter/modifier
let editingEvent = null;  // L'événement en cours de modification

// ==== Afficher le mois actuel ====
const today = new Date();
const months = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet",
"Août","Septembre","Octobre","Novembre","Décembre"];
Month.textContent = months[today.getMonth()] + " " + today.getFullYear();

// ==== Heures du calendrier ====
const hours = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00",
"15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00","00:00"];

// ==== Couleurs pour chaque type de réservation ====
const colors = {
  vip: "#d9534f",
  standard: "#28a745",
  groupe: "#0275d8",
  anniversaire: "#f0ad4e"
};

// ==== Créer le calendrier ====
function createCalendar() {
  calendarBody.innerHTML = ""; // Vide le calendrier

  for(let i=0; i<hours.length; i++){
    const row = document.createElement("div");
    row.className = "row";

    // Cellule pour l'heure
    const timeCell = document.createElement("div");
    timeCell.className = "time";
    timeCell.textContent = hours[i];
    row.appendChild(timeCell);

    // Cellules pour chaque jour
    for(let day=1; day<=7; day++){
      const cell = document.createElement("div");
      cell.className = "cell";

      if(day>5) cell.className += " disabled"; // Samedi et dimanche
      else {
        // Clique sur la cellule pour ajouter réservation
        cell.onclick = function(){
          editingEvent = null; // On n'est pas en modification
          openModal(this);
        };
      }
      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }
}

// ==== Ouvrir modal ====
function openModal(cell){
  selectedCell = cell; // On garde la cellule sélectionnée
  modal.style.display = "flex"; // Affiche le modal

    if(editingEvent){ 
    document.getElementById("name").value = editingEvent.dataset.name;
    document.getElementById("startTime").value = editingEvent.dataset.start;
    document.getElementById("endTime").value = editingEvent.dataset.end;
    document.getElementById("type").value = editingEvent.dataset.type;
    title.textContent = "Modifier la réservation";
    } else {
      form.reset();
      title.textContent = "Ajouter une réservation";
    }

}

// ==== Fermer modal ====
cancelBtn.onclick = function(){
  modal.style.display = "none"; // Masquer le modal
}

// ==== Ajouter ou modifier une réservation ====
form.onsubmit = function(e){
  e.preventDefault(); // Empêche l'envoi par défaut

  // Récupérer les valeurs du formulaire
  const name = document.getElementById("name").value;
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;
  const type = document.getElementById("type").value;

  // Vérification simple
  if(name=="" || start=="" || end=="" || type==""){
    alert("Remplis tous les champs !");
    return;
  }

  let event;
  if(editingEvent){ 
    // Modifier événement existant
    event = editingEvent;
    event.textContent = name + " (" + start + "-" + end + ")";
    event.dataset.type = type;
    event.style.background = colors[type];
  } else { 
    // Ajouter nouvel événement
    event = document.createElement("div");
    event.className = "event";
    event.textContent = name + " (" + start + "-" + end + ")";
    event.dataset.type = type;
    event.style.background = colors[type];

    // Clique sur l'événement pour modifier ou supprimer
    event.onclick = function(e){
      e.stopPropagation(); // Ne pas ouvrir modal sur la cellule
      if(confirm("Modifier la réservation ? (Annuler = Supprimer)")){
        editingEvent = this;
        openModal(selectedCell);
      } else if(confirm("Supprimer cette réservation ?")){
        this.remove();
      }
    }

    selectedCell.appendChild(event); // Ajouter à la cellule
  }

  modal.style.display = "none"; // Fermer modal
  form.reset(); // Réinitialiser formulaire
}

// ==== Lancer le calendrier ====
createCalendar();
