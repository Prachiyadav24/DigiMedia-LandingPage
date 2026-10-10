const PROFILE_STORAGE_KEY = "digimedia.profile.v1";
const PROJECT_STATUSES = ["Inquiry", "Planning", "In Progress", "Review", "Completed"];

const nameElement = document.getElementById("profileName");
const emailElement = document.getElementById("profileEmail");
const projectList = document.getElementById("projectList");
const projectForm = document.getElementById("projectForm");
const dashboardMessage = document.getElementById("dashboardMessage");
const showProjectFormButton = document.getElementById("showProjectForm");

function loadProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY));
    if (profile && typeof profile.name === "string" && typeof profile.email === "string" && Array.isArray(profile.projects)) {
      return profile;
    }
  } catch (error) {
    dashboardMessage.textContent = "We couldn't read the saved profile in this browser.";
  }
  return null;
}

let profile = loadProfile();
if (!profile) {
  window.location.replace("signUp.html");
} else {
  nameElement.textContent = profile.name;
  emailElement.textContent = profile.email;
}

function saveProfile() {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch (error) {
    dashboardMessage.textContent = "Changes couldn't be saved in this browser. Check your storage settings and try again.";
    return false;
  }
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function updateSummary() {
  document.getElementById("totalProjects").textContent = String(profile.projects.length);
  document.getElementById("activeProjects").textContent = String(profile.projects.filter((project) => project.status === "In Progress").length);
  document.getElementById("completedProjects").textContent = String(profile.projects.filter((project) => project.status === "Completed").length);
}

function renderProjects() {
  projectList.replaceChildren();
  updateSummary();

  if (profile.projects.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "project-empty-state";
    const title = document.createElement("h3");
    title.className = "h5 fw-bold";
    title.textContent = "No projects yet";
    const description = document.createElement("p");
    description.className = "text-muted mb-0";
    description.textContent = "Add your first project to start tracking its status here.";
    emptyState.append(title, description);
    projectList.append(emptyState);
    return;
  }

  profile.projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";

    const details = document.createElement("div");
    details.className = "project-card-details";
    const title = document.createElement("h3");
    title.className = "h5 fw-bold mb-1";
    title.textContent = project.name;
    const service = document.createElement("p");
    service.className = "text-muted small mb-1";
    service.textContent = project.service;
    const date = document.createElement("p");
    date.className = "project-date mb-0";
    date.textContent = `Added ${formatDate(project.createdAt)}`;
    details.append(title, service, date);

    const controls = document.createElement("div");
    controls.className = "project-card-controls";
    const statusLabel = document.createElement("label");
    statusLabel.className = "visually-hidden";
    statusLabel.htmlFor = `status-${project.id}`;
    statusLabel.textContent = `Status for ${project.name}`;
    const statusSelect = document.createElement("select");
    statusSelect.className = "form-select form-select-sm status-select";
    statusSelect.id = `status-${project.id}`;
    statusSelect.setAttribute("aria-label", `Status for ${project.name}`);
    PROJECT_STATUSES.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      statusSelect.append(option);
    });
    statusSelect.value = PROJECT_STATUSES.includes(project.status) ? project.status : "Inquiry";
    statusSelect.addEventListener("change", () => {
      project.status = statusSelect.value;
      if (saveProfile()) {
        updateSummary();
        dashboardMessage.textContent = `“${project.name}” status updated to ${project.status}.`;
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-sm btn-outline-danger";
    deleteButton.textContent = "Remove";
    deleteButton.setAttribute("aria-label", `Remove ${project.name}`);
    deleteButton.addEventListener("click", () => {
      profile.projects = profile.projects.filter((item) => item.id !== project.id);
      if (saveProfile()) {
        dashboardMessage.textContent = `“${project.name}” was removed.`;
        renderProjects();
      }
    });

    controls.append(statusLabel, statusSelect, deleteButton);
    card.append(details, controls);
    projectList.append(card);
  });
}

if (profile) {
  renderProjects();

  showProjectFormButton.addEventListener("click", () => {
    const willShow = projectForm.classList.contains("d-none");
    projectForm.classList.toggle("d-none", !willShow);
    showProjectFormButton.setAttribute("aria-expanded", String(willShow));
    if (willShow) document.getElementById("projectName").focus();
  });

  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!projectForm.reportValidity()) return;

    const values = new FormData(projectForm);
    const project = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: String(values.get("name")).trim(),
      service: String(values.get("service")),
      status: "Inquiry",
      createdAt: new Date().toISOString()
    };
    if (!project.name) return;

    profile.projects.unshift(project);
    if (saveProfile()) {
      projectForm.reset();
      projectForm.classList.add("d-none");
      showProjectFormButton.setAttribute("aria-expanded", "false");
      dashboardMessage.textContent = `“${project.name}” was added with Inquiry status.`;
      renderProjects();
    } else {
      profile.projects = profile.projects.filter((item) => item.id !== project.id);
    }
  });

  document.getElementById("signOutButton").addEventListener("click", () => {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    window.location.assign("signUp.html");
  });
}
