const calendarGrid = document.getElementById("calendar-grid");
const mahanikayaGrid = document.getElementById("mahanikaya-calendar-grid");
const monthLabel = document.getElementById("month-title");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

let currentDate = new Date();
let mahanikayaDates = []; // Se cargará desde el CSV

// Festivales generales
const festivals = {
  "4-15": "Vesak",
  "8-15": "Asalha Puja",
  "11-15": "Kathina End",
  "1-15": "Magha Puja"
};

// Luna nueva de referencia
function getLunarData(date) {
  const referenceNewMoon = new Date(Date.UTC(2025, 0, 29, 17, 9)); // 29 Jan 2025, 17:09 UTC
  const lunarCycle = 29.53059;
  const msPerDay = 86400000;

  const diffDays = (date.getTime() - referenceNewMoon.getTime()) / msPerDay;
  const moonAge = ((diffDays % lunarCycle) + lunarCycle) % lunarCycle;
  const lunarDay = Math.round(moonAge) % 30;

  return { day: lunarDay, age: moonAge };
}

// Renderiza el calendario base
function renderCalendar(date) {
  calendarGrid.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthLabel.textContent = `${date.toLocaleString("default", { month: "long" })} ${year}`;

  // Eliminar encabezado anterior si existe
  const oldHeader = document.querySelector(".calendar-section .calendar-header");
  if (oldHeader) oldHeader.remove();

  // Crear encabezado nuevo
 const calendarHeader = document.createElement("div");
 calendarHeader.classList.add("calendar-header");

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  weekDays.forEach(day => {
    const wd = document.createElement("div");
    wd.textContent = day;
    calendarHeader.appendChild(wd);
  });

  // Insertar encabezado antes del grid
  calendarGrid.parentNode.insertBefore(calendarHeader, calendarGrid);

  const totalCells = 42;
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("day-cell");

    let solarDate;
    let isOutsideMonth = false;

    if (i < startDay) {
      solarDate = new Date(year, month - 1, new Date(year, month, 0).getDate() - (startDay - i - 1));
      isOutsideMonth = true;
    } else if (i >= startDay + daysInMonth) {
      solarDate = new Date(year, month + 1, i - (startDay + daysInMonth) + 1);
      isOutsideMonth = true;
    } else {
      solarDate = new Date(year, month, i - startDay + 1);
    }

    const { day: lunarDay, age } = getLunarData(solarDate);
    const roundedAge = Math.round(age);
    const isNewMoon = roundedAge === 0;
    const isFullMoon = roundedAge === 15;

    const solarPart = document.createElement("div");
    solarPart.classList.add("solar-part");
    solarPart.textContent = isOutsideMonth ? "N/A" : solarDate.getDate();

    const lunarPart = document.createElement("div");
    lunarPart.classList.add("lunar-part");
    lunarPart.textContent = `Lunar ${lunarDay}`;

    if (isNewMoon) {
      lunarPart.textContent += " 🌑";
      cell.classList.add("newmoon");
    } else if (isFullMoon) {
      lunarPart.textContent += " 🌕";
      cell.classList.add("fullmoon");
    }

    if (isNewMoon || isFullMoon) {
      const uposatha = document.createElement("div");
      uposatha.classList.add("uposatha-label");
      uposatha.textContent = "Uposatha";
      lunarPart.appendChild(uposatha);
    }

    const key = `${solarDate.getMonth() + 1}-${lunarDay}`;
    if (festivals[key]) {
      const fest = document.createElement("div");
      fest.classList.add("festival-name");
      fest.textContent = festivals[key];
      lunarPart.appendChild(fest);
    }

    if (isOutsideMonth) cell.classList.add("outside-month");

    cell.appendChild(solarPart);
    cell.appendChild(lunarPart);
    calendarGrid.appendChild(cell);
  }

  renderMahanikayaCalendar(date); // sincronizar
}

// Renderiza el Mahānikāya calendar basado en CSV
function renderMahanikayaCalendar(date) {
  mahanikayaGrid.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  const matchingDates = mahanikayaDates.filter(d => {
    const csvDate = new Date(d.date);
    return csvDate.getFullYear() === year && csvDate.getMonth() === month;
  });


// Eliminar encabezado anterior si existe
const oldHeader = document.querySelector("#mahanikaya-calendar-grid .calendar-header");
if (oldHeader) oldHeader.remove();

// Crear nuevo encabezado dentro del mismo grid
const headerFragment = document.createDocumentFragment();
["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(day => {
  const cell = document.createElement("div");
  cell.textContent = day;
  cell.classList.add("calendar-header");
  headerFragment.appendChild(cell);
});
mahanikayaGrid.appendChild(headerFragment);


  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = (new Date(year, month, 1).getDay() + 6) % 7;

  for (let i = 0; i < 42; i++) {
    const cell = document.createElement("div");
    cell.classList.add("day-cell");

    let dayNum = i - startDay + 1;
    if (dayNum > 0 && dayNum <= daysInMonth) {
      const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      cell.innerHTML = `<div class="solar-part">${dayNum}</div>`;

      const match = mahanikayaDates.find(d => d.date === fullDate);
      if (match) {
        const label = document.createElement("div");
        label.classList.add("festival-name");
        label.textContent = match.event;
        cell.appendChild(label);

        if (/full moon/i.test(match.event)) {
          cell.classList.add("fullmoon");
        } else if (/new moon/i.test(match.event)) {
          cell.classList.add("newmoon");
        }
      }
    } else {
      cell.classList.add("outside-month");
      cell.innerHTML = `<div class="solar-part">N/A</div>`;
    }

    mahanikayaGrid.appendChild(cell);
  }
}

// Botones de navegación
prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// CSV loader
function loadCSVAndRender(csvText) {
  const lines = csvText.trim().split("\n").slice(1); // Skip header
  mahanikayaDates = lines.map(line => {
    const [dateStr, event] = line.split(",");
    return { date: dateStr.trim(), event: event?.trim() || "" };
  });

  renderCalendar(currentDate); // Start
}

// DOM ready
document.addEventListener("DOMContentLoaded", () => {
  fetch("mahanikaya.csv")
    .then(res => res.text())
    .then(csv => loadCSVAndRender(csv));
});

