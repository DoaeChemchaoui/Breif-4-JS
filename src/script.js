const calendarBody = document.getElementById("calendarBody");
const modal = document.getElementById("modal");
const form = document.getElementById("reservationForm");
const cancelBtn = document.getElementById("cancel");
const title = document.getElementById("modalTitle");

let selectedCell = null;


const dateTimer = document.getElementById('dateTimer');

setInterval(() => {
  const d = new Date();
  dateTimer.textContent = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}, 1000);


const hours = [
  "09:00","10:00","11:00","12:00","13:00","14:00",
  "15:00","16:00","17:00","18:00","19:00","20:00",
  "21:00","22:00","23:00","00:00"
];

function createCalendar() {
  calendarBody.innerHTML = "";
  for (const hour of hours) {
    const row = document.createElement("div");
    row.classList.add("row");

    const timeCell = document.createElement("div");
    timeCell.classList.add("time");
    timeCell.textContent = hour;
    row.appendChild(timeCell);

    for (let day = 1; day <= 7; day++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if(day===6||day===7) cell.classList.add("disabled");
      else cell.addEventListener("click",()=>openModal(cell));
      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }
}

function openModal(cell){
  selectedCell = cell;
  const event = cell.querySelector(".event");
  if(event){
    const data = JSON.parse(event.dataset.info);
    document.getElementById("name").value = data.name;
    document.getElementById("startTime").value = data.start;
    document.getElementById("endTime").value = data.end;
    document.getElementById("people").value = data.people;
    document.getElementById("type").value = data.type;
    title.textContent = "Modifier la réservation";
  } else form.reset(), title.textContent="Ajouter une réservation";
  modal.style.display="flex";
}

cancelBtn.addEventListener("click",()=>{
  modal.style.display="none";
  form.reset();
});

form.addEventListener("submit", (e)=>{
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;
  const people = document.getElementById("people").value;
  const type = document.getElementById("type").value;
  if(!name||!start||!end||!people||!type) return alert("Veuillez remplir tous les champs !");
  addReservation({name,start,end,people,type});
  modal.style.display="none";
  form.reset();
});

function addReservation(info){
  const oldEvent = selectedCell.querySelector(".event");
  if(oldEvent) oldEvent.remove();
  const event = document.createElement("div");
  event.classList.add("event");
  event.textContent = `${info.name} (${info.start}-${info.end})`;
  event.dataset.info=JSON.stringify(info);
  if(info.type==="vip") event.style.background="#d9534f";
  else if(info.type==="standard") event.style.background="#28a745";
  else if(info.type==="groupe") event.style.background="#0275d8";
  else if(info.type==="anniversaire") event.style.background="#f0ad4e";
  event.addEventListener("click",(e)=>{
    e.stopPropagation();
    const choice=confirm("Modifier la réservation ? (Annuler = Supprimer)");
    if(choice) openModal(selectedCell);
    else if(confirm("Voulez-vous supprimer cette réservation ?")) event.remove();
  });
  selectedCell.appendChild(event);
}

createCalendar();
