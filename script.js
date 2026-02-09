const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const uploadsEmbed = document.getElementById("uploadsEmbed");
if (uploadsEmbed) {
  const channelId = (uploadsEmbed.dataset.channelId || "").trim();
  const playlistId = (uploadsEmbed.dataset.playlistId || "").trim();

  if (channelId) {
    const uploadsId = channelId.startsWith("UC")
      ? `UU${channelId.slice(2)}`
      : channelId;
    uploadsEmbed.src = `https://www.youtube.com/embed/videoseries?list=${uploadsId}`;
  } else if (playlistId) {
    uploadsEmbed.src = `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const notesGrid = document.getElementById("notesGrid");
const notesSearch = document.getElementById("notesSearch");
const notesFilters = document.getElementById("notesFilters");

const fallbackNotes = [
  {
    title: "UGC-NET Paper 1: Teaching Aptitude",
    description: "Sample notes file. Replace this PDF with your own.",
    tags: ["UGC-NET", "Paper 1"],
    format: "PDF",
    size: "0.1 MB",
    link: "assets/notes/ugc-net-paper1-sample.pdf",
  },
  {
    title: "Assistant Professor: Research Aptitude",
    description: "Sample notes file. Replace this PDF with your own.",
    tags: ["Assistant Professor", "Research Aptitude"],
    format: "PDF",
    size: "0.1 MB",
    link: "assets/notes/research-aptitude-sample.pdf",
  },
  {
    title: "KVS: Current Affairs Quick Notes",
    description: "Sample notes file. Replace this PDF with your own.",
    tags: ["KVS", "Current Affairs"],
    format: "PDF",
    size: "0.1 MB",
    link: "assets/notes/kvs-current-affairs-sample.pdf",
  },
];

let notesData = [];
let activeFilter = "All";
let searchQuery = "";

const normalize = (value) => (value || "").toLowerCase();

const renderNotes = () => {
  if (!notesGrid) return;
  notesGrid.innerHTML = "";

  const filtered = notesData.filter((note) => {
    const matchesFilter =
      activeFilter === "All" || (note.tags || []).includes(activeFilter);
    const haystack = [note.title, note.description, ...(note.tags || [])]
      .map(normalize)
      .join(" ");
    const matchesSearch = haystack.includes(normalize(searchQuery));
    return matchesFilter && matchesSearch;
  });

  if (!filtered.length) {
    notesGrid.innerHTML =
      '<div class="note-card"><h3>No notes found</h3><p>Try another keyword or filter.</p></div>';
    return;
  }

  filtered.forEach((note) => {
    const card = document.createElement("article");
    card.className = "note-card";

    const tagHtml = (note.tags || [])
      .map((tag) => `<span class="note-tag">${tag}</span>`)
      .join("");

    card.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.description || ""}</p>
      <div class="note-meta">
        <span>${note.format || ""}</span>
        <span>${note.size || ""}</span>
      </div>
      <div class="note-tags">${tagHtml}</div>
      <a class="note-link" href="${note.link}" target="_blank" rel="noopener">
        Download Notes
      </a>
    `;

    notesGrid.appendChild(card);
  });
};

const renderFilters = () => {
  if (!notesFilters) return;
  const tags = new Set();
  notesData.forEach((note) => {
    (note.tags || []).forEach((tag) => tags.add(tag));
  });

  const allTags = ["All", ...Array.from(tags)];
  notesFilters.innerHTML = "";

  allTags.forEach((tag) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-chip${tag === activeFilter ? " is-active" : ""}`;
    button.textContent = tag;
    button.addEventListener("click", () => {
      activeFilter = tag;
      document.querySelectorAll(".filter-chip").forEach((chip) => {
        chip.classList.toggle("is-active", chip.textContent === tag);
      });
      renderNotes();
    });
    notesFilters.appendChild(button);
  });
};

const loadNotes = async () => {
  if (!notesGrid) return;
  try {
    const response = await fetch("notes.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to load notes.json");
    const data = await response.json();
    notesData = Array.isArray(data) ? data : fallbackNotes;
  } catch (error) {
    notesData = fallbackNotes;
  }

  renderFilters();
  renderNotes();
};

if (notesSearch) {
  notesSearch.addEventListener("input", (event) => {
    searchQuery = event.target.value;
    renderNotes();
  });
}

loadNotes();
