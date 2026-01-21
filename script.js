const tabs = [...document.querySelectorAll(".tab")];
const views = [...document.querySelectorAll("section[data-view]")];
const yearEl = document.getElementById("y");
yearEl.textContent = new Date().getFullYear();

// Typewriter variables
const bioTextEl = document.getElementById("bio-text");
const originalBioText = bioTextEl ? bioTextEl.innerText.trim() : "";
let typeInterval;

function startTypewriter() {
  if (!bioTextEl) return;

  // Clear previous
  if (typeInterval) clearInterval(typeInterval);
  bioTextEl.textContent = "";
  bioTextEl.classList.add("typing");

  let i = 0;
  typeInterval = setInterval(() => {
    bioTextEl.textContent += originalBioText.charAt(i);
    i++;
    if (i >= originalBioText.length) {
      clearInterval(typeInterval);
      bioTextEl.classList.remove("typing");
    }
  }, 1000 / 60); // Speed: ~60fps feels fast but typed
}

function animateView(viewElement) {
  // Find direct children to animate (cards, etc.)
  const children = viewElement.querySelectorAll("article, .gallery-item, .event, .box");
  children.forEach((child, index) => {
    // Reset animation
    child.classList.remove("animate-in");
    child.style.animationDelay = `${index * 0.05}s`; // Stagger
    // Force reflow
    void child.offsetWidth;
    child.classList.add("animate-in");
  });
}

function setActive(name, pushHash = true) {
  tabs.forEach(t => t.setAttribute("aria-selected", String(t.dataset.tab === name)));
  views.forEach(v => {
    const isActive = v.dataset.view === name;
    v.classList.toggle("active", isActive);
    if (isActive) {
      animateView(v);
      if (name === 'home') startTypewriter();
    }
  });
  if (pushHash) location.hash = name;
}

// Init animation for initial view
const initialView = views.find(v => v.classList.contains("active"));
if (initialView) {
  animateView(initialView);
  if (initialView.dataset.view === 'home') startTypewriter();
}

tabs.forEach(t => t.addEventListener("click", () => setActive(t.dataset.tab)));

// Deep-link: /#skills
const hash = (location.hash || "").replace("#", "");
if (hash && ["home", "skills", "timeline", "gallery"].includes(hash)) setActive(hash, false);

// Keyboard shortcuts: 1/2/3
window.addEventListener("keydown", (e) => {
  if (e.target && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
  if (e.key === "1") setActive("home");
  if (e.key === "2") setActive("skills");
  if (e.key === "3") setActive("timeline");
  if (e.key === "4") setActive("gallery");
});

/* MEDIA MODAL LOGIC */
const modal = document.getElementById("media-modal");
const btnClose = modal.querySelector(".modal-close");
const mImg = document.getElementById("m-img");
const mTag = document.getElementById("m-tag");
const mTitle = document.getElementById("m-title");
const mDesc = document.getElementById("m-desc");
const mTech = document.getElementById("m-tech");
const mLink = document.getElementById("m-link");

function openModal(el) {
  const d = el.dataset;
  mImg.src = d.img;
  mTag.textContent = d.tag;
  mTitle.textContent = d.title;
  mDesc.textContent = d.desc;
  mLink.href = d.link;

  // Tech stack pills
  mTech.innerHTML = "";
  if (d.tech) {
    d.tech.split(",").forEach(t => {
      const span = document.createElement("span");
      span.textContent = t.trim();
      mTech.appendChild(span);
    });
  }

  // Link Text/Icon Logic
  const isLinkedIn = d.link && d.link.includes("linkedin.com");
  mLink.innerHTML = isLinkedIn
    ? '<i class="fa-brands fa-linkedin"></i> Ver en LinkedIn'
    : '<i class="fa-solid fa-globe"></i> Ver Sitio Web';
  mLink.target = "_blank";

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  // Clear src to stop video/loading if ever used
  setTimeout(() => { if (!modal.classList.contains("open")) mImg.src = ""; }, 300);
}

// Attach click to gallery items
document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(item);
  });
});

// Close events
btnClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});
