// ---------- SAMPLE DATA ----------
const templeData = [
  {
    id: 1,
    name: "Somnath",
    city: "Prabhas Patan, Gujarat",
    crowdLevel: "high",
    occupancy: 92,
    waitingMinutes: 75,
    lastUpdated: "2 min ago",
  },
  {
    id: 2,
    name: "Dwarka",
    city: "Dwarka, Gujarat",
    crowdLevel: "medium",
    occupancy: 68,
    waitingMinutes: 40,
    lastUpdated: "5 min ago",
  },
  {
    id: 3,
    name: "Ambaji",
    city: "Banaskantha, Gujarat",
    crowdLevel: "medium",
    occupancy: 55,
    waitingMinutes: 30,
    lastUpdated: "3 min ago",
  },
  {
    id: 4,
    name: "Pavagadh",
    city: "Panchmahal, Gujarat",
    crowdLevel: "low",
    occupancy: 28,
    waitingMinutes: 10,
    lastUpdated: "6 min ago",
  },
];

const zoneData = [
  {
    temple: "Somnath",
    zone: "Main Garbhagriha Queue",
    crowdLevel: "high",
    occupancy: 94,
    wait: "75 min",
  },
  {
    temple: "Somnath",
    zone: "Outer Mandir Corridor",
    crowdLevel: "medium",
    occupancy: 70,
    wait: "35 min",
  },
  {
    temple: "Dwarka",
    zone: "Bridge Entry Point",
    crowdLevel: "medium",
    occupancy: 66,
    wait: "40 min",
  },
  {
    temple: "Ambaji",
    zone: "Hill Steps (Mid Section)",
    crowdLevel: "medium",
    occupancy: 59,
    wait: "30 min",
  },
  {
    temple: "Pavagadh",
    zone: "Ropeway Queue",
    crowdLevel: "low",
    occupancy: 30,
    wait: "12 min",
  },
  {
    temple: "Pavagadh",
    zone: "Trek Path Checkpoint",
    crowdLevel: "low",
    occupancy: 22,
    wait: "8 min",
  },
];

// ---------- METRICS ----------
function updateMetrics() {
  const totalPilgrims = templeData.reduce(
    (sum, t) => sum + Math.round((t.occupancy / 100) * 2000),
    0
  ); // fake calc

  const avgOccupancy =
    templeData.reduce((sum, t) => sum + t.occupancy, 0) / templeData.length;

  const highRiskZones = zoneData.filter((z) => z.crowdLevel === "high").length;

  document.getElementById("metric-total").textContent =
    totalPilgrims.toLocaleString();
  document.getElementById("metric-avg").textContent =
    Math.round(avgOccupancy) + "%";
  document.getElementById("metric-high").textContent = highRiskZones;
}

// ---------- TEMPLE CARDS ----------
function createCrowdBadge(level) {
  const span = document.createElement("span");
  span.classList.add("crowd-badge");
  if (level === "low") span.classList.add("crowd-low");
  else if (level === "medium") span.classList.add("crowd-medium");
  else span.classList.add("crowd-high");
  span.textContent =
    level === "low" ? "Low" : level === "medium" ? "Medium" : "High";
  return span;
}

function crowdColor(level) {
  if (level === "low") return "#16a34a";
  if (level === "medium") return "#f59e0b";
  return "#ef4444";
}

function renderTempleCards() {
  const container = document.getElementById("temple-cards");
  container.innerHTML = "";

  templeData.forEach((t) => {
    const card = document.createElement("article");
    card.className = "card temple-card";

    const header = document.createElement("div");
    header.className = "temple-header";

    const name = document.createElement("div");
    name.className = "temple-name";
    name.textContent = t.name;

    const badge = createCrowdBadge(t.crowdLevel);

    header.appendChild(name);
    header.appendChild(badge);

    const meta = document.createElement("div");
    meta.className = "temple-meta";
    meta.innerHTML = `
      <span>${t.city}</span>
      <span>Wait: <strong>${t.waitingMinutes} min</strong></span>
    `;

    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-bar-container";

    const progress = document.createElement("div");
    progress.className = "progress-bar";
    progress.style.width = t.occupancy + "%";
    progress.style.background = crowdColor(t.crowdLevel);

    progressContainer.appendChild(progress);

    const update = document.createElement("div");
    update.style.fontSize = "0.75rem";
    update.style.color = "#777";
    update.textContent = "Last updated: " + t.lastUpdated;

    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(progressContainer);
    card.appendChild(update);

    container.appendChild(card);
  });
}

// ---------- ADMIN TABLE & ALERTS ----------
function renderTable() {
  const filterValue = document.getElementById("filter-crowd").value;
  const tbody = document.getElementById("admin-table-body");
  tbody.innerHTML = "";

  zoneData
    .filter((z) => (filterValue === "all" ? true : z.crowdLevel === filterValue))
    .forEach((z) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${z.temple}</td>
        <td>${z.zone}</td>
        <td>${z.crowdLevel.toUpperCase()}</td>
        <td>${z.occupancy}%</td>
        <td>${z.wait}</td>
      `;
      tbody.appendChild(tr);
    });

  renderAlerts();
}

function renderAlerts() {
  const alertsUl = document.getElementById("alerts-list");
  alertsUl.innerHTML = "";

  const highZones = zoneData.filter((z) => z.crowdLevel === "high");

  if (highZones.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No critical alerts. All zones within safe capacity.";
    alertsUl.appendChild(li);
    return;
  }

  highZones.forEach((z) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${z.temple}</strong> – ${z.zone} at <strong>${
      z.occupancy
    }%</strong> capacity.
      Consider opening an alternate gate and slowing new entries.
    `;
    alertsUl.appendChild(li);
  });
}

// ---------- VIEW TOGGLE ----------
function setView(view) {
  const devotee = document.getElementById("devotee-view");
  const admin = document.getElementById("admin-view");
  const btnDevotee = document.getElementById("btn-devotee");
  const btnAdmin = document.getElementById("btn-admin");

  if (view === "devotee") {
    devotee.style.display = "block";
    admin.style.display = "none";
    btnDevotee.classList.add("active");
    btnAdmin.classList.remove("active");
  } else {
    devotee.style.display = "none";
    admin.style.display = "block";
    btnDevotee.classList.remove("active");
    btnAdmin.classList.add("active");
  }
}

// ---------- SMOOTH SCROLL ----------
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({
    top: el.offsetTop - 70,
    behavior: "smooth",
  });
}

// ---------- INIT ----------
updateMetrics();
renderTempleCards();
renderTable();

// ---------- REGISTRATION FORM HANDLING ----------
// Populate temple select from templeData
const templeSelect = document.getElementById("templeSelect");
if (templeSelect && Array.isArray(templeData)) {
  templeData.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.name;
    opt.textContent = `${t.name} — ${t.city}`;
    templeSelect.appendChild(opt);
  });
}

const registerForm = document.getElementById("register-form");
const formMessage = document.getElementById("form-message");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // basic validation
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const agree = document.getElementById("agree").checked;

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      showFormMessage("Please fill in all required fields.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showFormMessage("Passwords do not match.", "error");
      return;
    }

    if (!agree) {
      showFormMessage("Please accept the terms to continue.", "error");
      return;
    }

    // success (in a real app we'd POST to a server)
    showFormMessage("Registration successful — token will be sent shortly.", "success");
    // clear form after short delay so user sees message
    setTimeout(() => registerForm.reset(), 700);
  });

  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) resetBtn.addEventListener("click", () => registerForm.reset());
}

function showFormMessage(msg, type) {
  if (!formMessage) return;
  formMessage.textContent = msg;
  formMessage.classList.remove("success", "error");
  formMessage.classList.add(type === "success" ? "success" : "error");
}