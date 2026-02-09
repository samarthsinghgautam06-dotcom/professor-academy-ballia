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

const playlistGrid = document.getElementById("playlistGrid");
const playlists = [
  {
    title: "Playlist 1",
    listId: "PLVNPzu8zqh7Ww8CTWfjKYRVV8AwrSY2rw",
    videoId: "nu0MVp2DFJE",
  },
  {
    title: "Playlist 2",
    listId: "PLVNPzu8zqh7UyUc3xSdiuTE8n6WGttfa8",
    videoId: "sgryKeC1wBQ",
  },
  {
    title: "Playlist 3",
    listId: "PLVNPzu8zqh7VrqQ1h6kTGD0Yp0dtgPOpY",
    videoId: "W4cMBheIjOc",
  },
  {
    title: "Playlist 4",
    listId: "PLVNPzu8zqh7UT0rUyoRn-RUDNhzYMhGUc",
    videoId: "LAueSdHsf4k",
  },
  {
    title: "Playlist 5",
    listId: "PLVNPzu8zqh7XWuNRllSCdUih3xpKhh-xx",
    videoId: "McgrXg-4cug",
  },
  {
    title: "Playlist 6",
    listId: "PLVNPzu8zqh7XVjD3gki6MklwWE63-9XkA",
    videoId: "Fi8HSTxfPhQ",
  },
  {
    title: "Playlist 7",
    listId: "PLVNPzu8zqh7WpxeVMje2CcojCtAaZg-We",
    videoId: "9oDiS-z53LA",
  },
  {
    title: "Playlist 8",
    listId: "PLVNPzu8zqh7V7b8tCB2Y5b8q8oHjMoNVh",
    videoId: "Fi8HSTxfPhQ",
  },
];

const renderPlaylists = () => {
  if (!playlistGrid) return;

  playlistGrid.innerHTML = "";
  playlists.forEach((playlist) => {
    const card = document.createElement("article");
    card.className = "playlist-card";

    const listUrl = `https://www.youtube.com/playlist?list=${playlist.listId}`;
    const watchUrl = playlist.videoId
      ? `https://www.youtube.com/watch?v=${playlist.videoId}&list=${playlist.listId}`
      : listUrl;

    card.innerHTML = `
      <h3>${playlist.title}</h3>
      <p class="playlist-meta">Playlist ID: ${playlist.listId}</p>
      <div class="playlist-actions">
        <button type="button" data-playlist="${playlist.listId}">Play Here</button>
        <a href="${listUrl}" target="_blank" rel="noopener">Open Playlist</a>
        <a href="${watchUrl}" target="_blank" rel="noopener">Watch Sample</a>
      </div>
    `;

    playlistGrid.appendChild(card);
  });

  playlistGrid.querySelectorAll("button[data-playlist]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!uploadsEmbed) return;
      const listId = button.dataset.playlist;
      uploadsEmbed.src = `https://www.youtube.com/embed/videoseries?list=${listId}`;
      uploadsEmbed.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};

renderPlaylists();

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
