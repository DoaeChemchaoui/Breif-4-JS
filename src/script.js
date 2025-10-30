const calendarBody = document.getElementById('calendarBody');
const modal = document.getElementById('modal');
const form = document.getElementById('reservationForm');
const cancelBtn = document.getElementById('cancel');
let selectedCell = null;

// Bouton "Ajouter"
const addBtn = document.querySelector("a[href='#modalTitle']");

// Liste des heures
const hours = [
  '1 AM','2 AM','3 AM','4 AM','5 AM','6 AM','7 AM','8 AM','9 AM','10 AM','11 AM','12 PM',
  '1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM','8 PM','9 PM','10 PM','11 PM','12 AM'
];

// Créer les lignes du calendrier
hours.forEach(hour => {
  const row = document.createElement('div');
  row.classList.add('row');

  const timeCol = document.createElement('div');
  timeCol.classList.add('time');
  timeCol.textContent = hour;
  row.appendChild(timeCol);

  for (let i = 1; i <= 7; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.hour = hour;
    if (i > 5) cell.classList.add('disabled'); // samedi et dimanche
    row.appendChild(cell);

    // Clic sur cellule active
    cell.addEventListener('click', () => {
      if (cell.classList.contains('disabled')) return;
      selectedCell = cell;
      form.reset();
      document.getElementById('modalTitle').textContent = 'Ajouter une Réservation';
      modal.style.display = 'flex';
    });
  }

  calendarBody.appendChild(row);
});

// Ouvrir le formulaire avec le bouton "Ajouter"
addBtn.addEventListener('click', (e) => {
  e.preventDefault();
  selectedCell = null;
  form.reset();
  document.getElementById('modalTitle').textContent = 'Ajouter une Réservation';
  modal.style.display = 'flex';
});

// Fermer modal
cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Ajouter la réservation
form.addEventListener('submit', (e) => {
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

  // Conversion heure 24h -> format affiché dans le calendrier (AM/PM)
  const startHourLabel = formatHour(startTime);
  const endHourLabel = formatHour(endTime);

  // Trouver la cellule correspondant à l'heure de début
  const targetCell = Array.from(document.querySelectorAll('.cell')).find(
    c => c.dataset.hour === startHourLabel && !c.classList.contains('disabled')
  );

  if (!targetCell) {
    alert("Heure non trouvée dans le calendrier !");
    return;
  }

  // Vérifie si la case contient déjà un event
  if (targetCell.querySelector('.event')) {
    alert("Une réservation existe déjà ici !");
    modal.style.display = 'none';
    return;
  }

  // Créer un bloc événement
  const eventDiv = document.createElement('div');
  eventDiv.classList.add('event', type);
  eventDiv.textContent = `${name} (${people} pers)`;

  // Couleur selon le type
  const colors = {
    standard: 'lightgreen',
    vip: 'lightcoral',
    groupe: 'lightblue',
    anniversaire: 'plum'
  };
  eventDiv.style.backgroundColor = colors[type] || 'gray';

  // Quand on clique sur la réservation → modifier ou supprimer
  eventDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    const action = prompt("Tapez 'm' pour modifier ou 's' pour supprimer :");
    if (action === 's') {
      eventDiv.remove();
    } else if (action === 'm') {
      const newName = prompt("Nouveau nom :", name);
      if (newName) eventDiv.textContent = `${newName} (${people} pers)`;
    }
  });

  // Ajout dans la bonne cellule
  targetCell.appendChild(eventDiv);

  // Fermer la modale
  modal.style.display = 'none';
  form.reset();
});

// Fonction pour convertir l'heure 24h en 12h AM/PM
function formatHour(time) {
  let [hour, minute] = time.split(':');
  hour = parseInt(hour);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour} ${suffix}`;
}
