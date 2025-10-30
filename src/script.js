const calendarBody = document.getElementById('calendarBody');
const modal = document.getElementById('modal');
const form = document.getElementById('reservationForm');
const cancelBtn = document.getElementById('cancel');
const addBtn = document.querySelector("button[href='#Ajouter-une-reservation']");
let selectedCell = null;

// Liste des heures
const hours = [
  '1 AM','2 AM','3 AM','4 AM','5 AM','6 AM','7 AM','8 AM','9 AM','10 AM','11 AM','12 PM',
  '1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM','8 PM','9 PM','10 PM','11 PM','12 AM'
];

// === Création du calendrier ===
hours.forEach(hour => {
  const row = document.createElement('div');
  row.className = 'row';

  // Colonne de l'heure
  const timeCol = document.createElement('div');
  timeCol.className = 'time';
  timeCol.textContent = hour;
  row.appendChild(timeCol);

  // Colonnes des jours (7 jours)
  for (let i = 1; i <= 7; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.hour = hour;

    // Samedi et dimanche désactivés
    if (i > 5) cell.classList.add('disabled');
    row.appendChild(cell);

    // Clic sur une cellule active
    cell.addEventListener('click', () => {
      if (cell.classList.contains('disabled')) return;
      selectedCell = cell;
      openModal();
    });
  }

  calendarBody.appendChild(row);
});

// === Ouvrir le formulaire via "Ajouter" ===
addBtn.addEventListener('click', e => {
  e.preventDefault();
  selectedCell = null;
  openModal();
});

// === Fermer la modale ===
cancelBtn.addEventListener('click', closeModal);

// === Soumission du formulaire ===
form.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  const people = document.getElementById('people').value;
  const type = document.getElementById('type').value;

  if (!name || !startTime || !endTime || !people || !type) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  const startHourLabel = formatHour(startTime);

  // Trouver la cellule correspondante (même heure, même jour)
  const targetCell = selectedCell ||
    Array.from(document.querySelectorAll('.cell')).find(
      c => c.dataset.hour === startHourLabel && !c.classList.contains('disabled')
    );

  if (!targetCell) {
    alert("Heure non trouvée dans le calendrier !");
    return;
  }

  // Vérifie s’il y a déjà un événement
  if (targetCell.querySelector('.event')) {
    alert("Une réservation existe déjà ici !");
    closeModal();
    return;
  }

  // Crée l’événement
  createEvent(targetCell, { name, people, type, startTime, endTime });

  closeModal();
});

// === Fonctions utilitaires ===
function openModal() {
  form.reset();
  document.getElementById('modalTitle').textContent = 'Ajouter une Réservation';
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
  form.reset();
}

function createEvent(cell, { name, people, type, startTime, endTime }) {
  const colors = {
    standard: 'lightgreen',
    vip: 'lightcoral',
    groupe: 'lightblue',
    anniversaire: 'plum'
  };

  const eventDiv = document.createElement('div');
  eventDiv.className = `event ${type}`;
  eventDiv.style.backgroundColor = colors[type] || 'gray';
  eventDiv.innerHTML = `
    <strong>${name}</strong><br>
    <small>${type.toUpperCase()} - ${people} pers<br>${startTime} → ${endTime}</small>
  `;

  // Clic sur la réservation : modifier ou supprimer
  eventDiv.addEventListener('click', e => {
    e.stopPropagation();
    const action = prompt("Tapez 'm' pour modifier ou 's' pour supprimer :");
    if (action === 's') {
      eventDiv.remove();
    } else if (action === 'm') {
      const newName = prompt("Nom :", name) || name;
      const newPeople = prompt("Nombre de personnes :", people) || people;
      const newType = prompt("Type (standard, vip, groupe, anniversaire) :", type) || type;
      const newStart = prompt("Heure début (HH:MM) :", startTime) || startTime;
      const newEnd = prompt("Heure fin (HH:MM) :", endTime) || endTime;

      eventDiv.className = `event ${newType}`;
      eventDiv.style.backgroundColor = colors[newType] || 'gray';
      eventDiv.innerHTML = `
        <strong>${newName}</strong><br>
        <small>${newType.toUpperCase()} - ${newPeople} pers<br>${newStart} → ${newEnd}</small>
      `;
    }
  });

  cell.appendChild(eventDiv);
}

// Conversion 24h -> AM/PM
function formatHour(time) {
  let [hour] = time.split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour} ${suffix}`;
}
