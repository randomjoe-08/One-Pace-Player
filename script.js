const video = document.getElementById("player");
const playPauseBtn = document.getElementById("playPause");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const muteBtn = document.getElementById("muteBtn");
const volumeIcon = document.getElementById("volumeIcon");
const volumeSlider = document.getElementById("volumeSlider");
const volumePopup = document.getElementById("volumePopup");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const fullscreenBtnIcon = document.getElementById("fullscreenIcon");
const progress = document.getElementById("progress");
const skipButton = document.getElementById("skipIntro");
const playerContainer = document.getElementById("playerContainer");
const controls = document.getElementById("controls");
const timeRemaining = document.getElementById("timeRemaining");
const nextEpBtn = document.getElementById("nextEpisodeBtn");
const epTitle = document.getElementById("epTitle");
const episodesBtn = document.getElementById("episodesBtn");
const episodesPopup = document.getElementById("episodesPopup");
const settingsBtn = document.getElementById("settingsBtn");
const settingsPopup = document.getElementById("settingsPopup");
const qualOptionDiv = document.getElementById("qualButtons");
const resumeOverlay = document.getElementById("resumeOverlay");
const resumeBtn = document.getElementById("resumeBtn");
const resumeTitle = document.getElementById("resumeTitle");
const resumeSubtitle = document.getElementById("resumeSubtitle");
const subBtn = document.getElementById("subBtn");
const dubBtn = document.getElementById("dubBtn");

const introEnd = 110;
let currentLang = "sub";
let currentQuality = 1080;
let currentArcIndex = 0;
let currentEpisodeIndex = 0;
let arcsDataCache = {};
let arcsData = {};

document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    arcsData = await loadArcsData();
  })();
  if (
    !("currentEp" in localStorage) ||
    JSON.parse(localStorage.getItem("currentEp"))["isFirstTime"] === true
  ) {
    video.src = "https://pixeldrain.net/api/file/jTVvHnMi";
    epTitle.innerText = "Romance Dawn (SUB) Ep 1";
    resumeTitle.innerHTML =
      " Welcome to <span class='highlight'>One Pace Player</span>";
    resumeSubtitle.innerText =
      "Start your journey with this enhanced video player.";
    resumeBtn.innerText = "Start Journey";
  } else {
    let cachedEpData = JSON.parse(localStorage.getItem("currentEp"));
    video.src = cachedEpData["url"];
    epTitle.innerText = cachedEpData["title"];
    currentArcIndex = cachedEpData["currentArcIndex"];
    currentEpisodeIndex = cachedEpData["currentEpisodeIndex"];
    currentLang = cachedEpData["currentLang"];
    currentQuality = cachedEpData["currentQuality"];
    video.addEventListener("loadedmetadata", () => {
      video.currentTime = cachedEpData["time"];
    });
    resumeTitle.innerHTML =
      " Welcome back to <span class='highlight'>One Pace Player</span>";
    resumeSubtitle.innerText =
      "Continue your journey right where you left off.";
    resumeBtn.innerText = "Resume Journey";
  }
  resumeBtn.addEventListener("click", () => {
    resumeOverlay.style.transition = "opacity 0.6s ease";
    resumeOverlay.style.opacity = "0";
    setTimeout(() => resumeOverlay.remove(), 600);
  });
});
async function loadArcsData() {
  try {
    const response = await fetch(
      "https://randomjoe-08.github.io/one-pace-player-api/arcs.json"
    );
    const data = await response.json();
    return data; // return the JSON
  } catch (err) {
    console.error("Error fetching arcs data:", err);
  }
}

// --- Progress Bar Setup ---
const wrapper = document.createElement("div");
wrapper.id = "progressWrapper";
progress.parentNode.insertBefore(wrapper, progress);
wrapper.appendChild(progress);

const hoverIndicator = document.createElement("div");
hoverIndicator.id = "hoverIndicator";
wrapper.appendChild(hoverIndicator);

progress.addEventListener("mousemove", (e) => {
  const rect = progress.getBoundingClientRect();
  hoverIndicator.style.left = `${e.clientX - rect.left}px`;
  hoverIndicator.style.opacity = 1;
});
progress.addEventListener(
  "mouseleave",
  () => (hoverIndicator.style.opacity = 0)
);
video.addEventListener("loadedmetadata", () => {
  progress.addEventListener(
    "input",
    () => (video.currentTime = (progress.value / 100) * video.duration)
  );
});

// --- Play / Pause ---
function togglePlayPause() {
  if (video.paused) {
    video.play();
    showOverlay("play", "center");
  } else {
    video.pause();
    showOverlay("pause", "center");
  }
}
playPauseBtn.addEventListener("click", togglePlayPause);
video.addEventListener("click", togglePlayPause);

video.addEventListener("play", () => {
  playIcon.style.display = "none";
  pauseIcon.style.display = "inline";
  showControls();
});
video.addEventListener("pause", () => {
  playIcon.style.display = "inline";
  pauseIcon.style.display = "none";
  showControls();
});

// --- Volume ---
volumeSlider.value = video.volume;
function updateVolumeIcon(vol = video.volume) {
  if (vol === 0 || video.muted) {
    volumeIcon.src =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0xNjMuNTIsMjQuODFhOCw4LDAsMCwwLTguNDMuODhMODUuMjUsODBINDBBMTYsMTYsMCwwLDAsMjQsOTZ2NjRhMTYsMTYsMCwwLDAsMTYsMTZIODUuMjVsNjkuODQsNTQuMzFBNy45NCw3Ljk0LDAsMCwwLDE2MCwyMzJhOCw4LDAsMCwwLDgtOFYzMkE4LDgsMCwwLDAsMTYzLjUyLDI0LjgxWiI+PC9wYXRoPjxwYXRoIGQ9Ik0yMzUuMzEsMTI4bDE4LjM1LTE4LjM0YTgsOCwwLDAsMC0xMS4zMi0xMS4zMkwyMjQsMTE2LjY5LDIwNS42Niw5OC4zNGE4LDgsMCwwLDAtMTEuMzIsMTEuMzJMMjEyLjY5LDEyOGwtMTguMzUsMTguMzRhOCw4LDAsMCwwLDExLjMyLDExLjMyTDIyNCwxMzkuMzFsMTguMzQsMTguMzVhOCw4LDAsMCwwLDExLjMyLTExLjMyWiI+PC9wYXRoPjwvc3ZnPg==";
  } else if (vol <= 0.5) {
    volumeIcon.src =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0xNjgsMzJWMjI0YTgsOCwwLDAsMS0xMi45MSw2LjMxTDg1LjI1LDE3Nkg0MGExNiwxNiwwLDAsMS0xNi0xNlY5NkExNiwxNiwwLDAsMSw0MCw4MEg4NS4yNWw2OS44NC01NC4zMUE4LDgsMCwwLDEsMTY4LDMyWm0zMiw2NGE4LDgsMCwwLDAtOCw4djQ4YTgsOCwwLDAsMCwxNiwwVjEwNEE4LDgsMCwwLDAsMjAwLDk2WiI+PC9wYXRoPjwvc3ZnPg==";
  } else if (vol > 0.5) {
    volumeIcon.src =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0xNjgsMzJWMjI0YTgsOCwwLDAsMS0xMi45MSw2LjMxTDg1LjI1LDE3Nkg0MGExNiwxNiwwLDAsMS0xNi0xNlY5NkExNiwxNiwwLDAsMSw0MCw4MEg4NS4yNWw2OS44NC01NC4zMUE4LDgsMCwwLDEsMTY4LDMyWm0zMiw2NGE4LDgsMCwwLDAtOCw4djQ4YTgsOCwwLDAsMCwxNiwwVjEwNEE4LDgsMCwwLDAsMjAwLDk2Wm0zMi0xNmE4LDgsMCwwLDAtOCw4djgwYTgsOCwwLDAsMCwxNiwwVjg4QTgsOCwwLDAsMCwyMzIsODBaIj48L3BhdGg+PC9zdmc+";
  }
}
muteBtn.addEventListener("mouseenter", () => volumePopup.classList.add("show"));
muteBtn.addEventListener("mouseleave", () =>
  setTimeout(() => {
    if (!volumePopup.matches(":hover")) volumePopup.classList.remove("show");
  }, 50)
);
volumePopup.addEventListener("mouseenter", () =>
  volumePopup.classList.add("show")
);
volumePopup.addEventListener("mouseleave", () =>
  volumePopup.classList.remove("show")
);
volumeSlider.addEventListener("input", () => {
  video.volume = parseFloat(volumeSlider.value);
  video.muted = video.volume === 0;
  updateVolumeIcon();
});
video.addEventListener("volumechange", updateVolumeIcon);

// --- Fullscreen ---
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) playerContainer.requestFullscreen();
  else document.exitFullscreen();
});
document.addEventListener("fullscreenchange", () => {
  fullscreenBtnIcon.src = document.fullscreenElement
    ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0xNDQsMTA0VjY0YTgsOCwwLDAsMSwxMy42Ni01LjY2TDE3Miw3Mi42OWwzMC4zNC0zMC4zNWE4LDgsMCwwLDEsMTEuMzIsMTEuMzJMMTgzLjMxLDg0bDE0LjM1LDE0LjM0QTgsOCwwLDAsMSwxOTIsMTEySDE1MkE4LDgsMCwwLDEsMTQ0LDEwNFptLTQwLDQwSDY0YTgsOCwwLDAsMC01LjY2LDEzLjY2TDcyLjY5LDE3Miw0Mi4zNCwyMDIuMzRhOCw4LDAsMCwwLDExLjMyLDExLjMyTDg0LDE4My4zMWwxNC4zNCwxNC4zNUE4LDgsMCwwLDAsMTEyLDE5MlYxNTJBOCw4LDAsMCwwLDEwNCwxNDRabTMuMDYtODcuMzlhOCw4LDAsMCwwLTguNzIsMS43M0w4NCw3Mi42OSw1My42Niw0Mi4zNEE4LDgsMCwwLDAsNDIuMzQsNTMuNjZMNzIuNjksODQsNTguMzQsOTguMzRBOCw4LDAsMCwwLDY0LDExMmg0MGE4LDgsMCwwLDAsOC04VjY0QTgsOCwwLDAsMCwxMDcuMDYsNTYuNjFaTTE4My4zMSwxNzJsMTQuMzUtMTQuMzRBOCw4LDAsMCwwLDE5MiwxNDRIMTUyYTgsOCwwLDAsMC04LDh2NDBhOCw4LDAsMCwwLDEzLjY2LDUuNjZMMTcyLDE4My4zMWwzMC4zNCwzMC4zNWE4LDgsMCwwLDAsMTEuMzItMTEuMzJaIj48L3BhdGg+PC9zdmc+"
    : "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0xMDkuNjYsMTQ2LjM0YTgsOCwwLDAsMSwwLDExLjMyTDgzLjMxLDE4NGwxOC4zNSwxOC4zNEE4LDgsMCwwLDEsOTYsMjE2SDQ4YTgsOCwwLDAsMS04LThWMTYwYTgsOCwwLDAsMSwxMy42Ni01LjY2TDcyLDE3Mi42OWwyNi4zNC0yNi4zNUE4LDgsMCwwLDEsMTA5LjY2LDE0Ni4zNFpNODMuMzEsNzJsMTguMzUtMTguMzRBOCw4LDAsMCwwLDk2LDQwSDQ4YTgsOCwwLDAsMC04LDhWOTZhOCw4LDAsMCwwLDEzLjY2LDUuNjZMNzIsODMuMzFsMjYuMzQsMjYuMzVhOCw4LDAsMCwwLDExLjMyLTExLjMyWk0yMDgsNDBIMTYwYTgsOCwwLDAsMC01LjY2LDEzLjY2TDE3Mi42OSw3MiwxNDYuMzQsOTguMzRhOCw4LDAsMCwwLDExLjMyLDExLjMyTDE4NCw4My4zMWwxOC4zNCwxOC4zNUE4LDgsMCwwLDAsMjE2LDk2VjQ4QTgsOCwwLDAsMCwyMDgsNDBabTMuMDYsMTEyLjYxYTgsOCwwLDAsMC04LjcyLDEuNzNMMTg0LDE3Mi42OWwtMjYuMzQtMjYuMzVhOCw4LDAsMCwwLTExLjMyLDExLjMyTDE3Mi42OSwxODRsLTE4LjM1LDE4LjM0QTgsOCwwLDAsMCwxNjAsMjE2aDQ4YTgsOCwwLDAsMCw4LThWMTYwQTgsOCwwLDAsMCwyMTEuMDYsMTUyLjYxWiI+PC9wYXRoPjwvc3ZnPg==";
  if (document.fullscreenElement === playerContainer) {
    // Move popup inside fullscreen container
    playerContainer.appendChild(settingsPopup);
  } else {
    // Move it back to body after exiting fullscreen
    document.body.appendChild(settingsPopup);
  }
});

// --- Duration & Progress Update ---
video.addEventListener("loadedmetadata", () => {
  const mins = Math.floor(video.duration / 60);
  const secs = String(Math.floor(video.duration % 60)).padStart(2, "0");
  timeRemaining.textContent = `${mins}:${secs}`;
});
video.addEventListener("timeupdate", () => {
  const percent = (video.currentTime / video.duration) * 100 || 0;
  progress.value = percent;
  progress.style.setProperty("--progress", `${percent}%`);
  const remaining = Math.max(video.duration - video.currentTime, 0);
  const mins = Math.floor(remaining / 60);
  const secs = String(Math.floor(remaining % 60)).padStart(2, "0");
  timeRemaining.textContent = `${mins}:${secs}`;
  // skipButton.classList.toggle(
  //   "visible",
  //   video.currentTime < introEnd && video.currentTime > 3
  // );
});
// skipButton.addEventListener("click", () => {
//   video.currentTime = introEnd;
//   skipButton.classList.remove("visible");
// });

// --- Keyboard Shortcuts ---
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  switch (key) {
    case " ":
      e.preventDefault();
      togglePlayPause();
      break;
    case "m":
      video.muted = !video.muted;
      updateVolumeIcon();
      break;
    case "arrowright":
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
      showOverlay("forward", "right");
      break;
    case "arrowleft":
      video.currentTime = Math.max(0, video.currentTime - 10);
      overlay.classList;
      showOverlay("backward", "left");
      break;
    case "f":
      if (!document.fullscreenElement) playerContainer.requestFullscreen();
      else document.exitFullscreen();
      break;
  }
});

// --- Auto Hide Controls ---
let hideTimer;
function showControls() {
  controls.classList.remove("hidden");
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    if (!video.paused) controls.classList.add("hidden");
  }, 3000);
}
playerContainer.addEventListener("mousemove", showControls);

// ---  Settings opup ---

// Create overlay
const langOverlay = document.createElement("div");
langOverlay.id = "langOverlay";
document.body.appendChild(langOverlay);
document.body.appendChild(settingsPopup);

// Toggle popup and position it properly
settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isVisible = settingsPopup.classList.contains("show");

  while (qualOptionDiv.firstChild) {
    qualOptionDiv.removeChild(qualOptionDiv.firstChild);
  }
  const currentArc = arcsData.arcs[currentArcIndex];
  const arcQuals = currentArc["available_qualities"];
  const arcLangs = currentArc["available_languages"];

  if (arcLangs.includes("sub")) {
    subBtn.classList.remove("hide-option");
  } else {
    subBtn.classList.add("hide-option");
  }

  if (arcLangs.includes("dub")) {
    dubBtn.classList.remove("hide-option");
  } else {
    dubBtn.classList.add("hide-option");
  }
  if (currentLang === "sub") {
    subBtn.classList.add("active-lang");
    dubBtn.classList.remove("active-lang");
  } else if (currentLang === "dub") {
    dubBtn.classList.add("active-lang");
    subBtn.classList.remove("active-lang");
  }
  for (let i = 0; i < arcQuals.length; i++) {
    const qualOption = document.createElement("button");
    qualOption.innerText = arcQuals[i].toString();
    qualOption.className = "quality-option";
    qualOption.setAttribute("data-quality", arcQuals[i].toString());
    qualOptionDiv.appendChild(qualOption);
    if (arcQuals[i].toString() === currentQuality.toString()) {
      qualOption.style.color = " #66c0ef";
      qualOption.style.fontWeight = "bold";
    }
  }
  if (isVisible) {
    settingsPopup.classList.remove("show");
    langOverlay.classList.remove("show");
  } else {
    settingsPopup.classList.add("show");
    langOverlay.classList.add("show");
  }
});

// Clicking outside hides popup
langOverlay.addEventListener("click", () => {
  settingsPopup.classList.remove("show");
  langOverlay.classList.remove("show");
});

// Hide popup when clicking outside
document.addEventListener("click", (e) => {
  if (!settingsPopup.contains(e.target) && e.target !== settingsBtn) {
    settingsPopup.classList.remove("show");
  }
});

settingsPopup.addEventListener("click", (e) => {
  if (
    !e.target.classList.contains("lang-option") &&
    !e.target.classList.contains("quality-option")
  )
    return;
  const currentArc = arcsData.arcs[currentArcIndex];
  currentQuality = currentArc["available_qualities"].at(-1);
  if (e.target.classList.contains("quality-option")) {
    const newQuality = e.target.dataset.quality;
    if (newQuality === currentQuality) return;
    currentQuality = newQuality;
  } else if (e.target.classList.contains("lang-option")) {
    const newLang = e.target.dataset.lang;
    if (newLang === currentLang) return;

    currentLang = newLang;
    if (e.target.id === "subBtn") {
      subBtn.classList.add("active-lang");
      dubBtn.classList.remove("active-lang");
    } else {
      dubBtn.classList.add("active-lang");
      subBtn.classList.remove("active-lang");
    }

    const img = settingsBtn.querySelector("img");
    if (img) img.alt = currentLang.toUpperCase();
  }
  const arcId = currentArc[currentLang][currentQuality]; // ✅ correct
  const arcData = arcsDataCache[`${arcId}-${currentLang}-${currentQuality}`];

  if (arcData?.files?.[currentEpisodeIndex]) {
    video.src = `https://pixeldrain.net/api/file/${arcData.files[currentEpisodeIndex].id}`;
    checkMatchCacheEp(video.src);
    video.play();
    epTitle.textContent = `${
      currentArc.name
    } (${currentLang.toUpperCase()}) Ep ${currentEpisodeIndex + 1}`;
  } else {
    fetchArcEpisodes(arcId, currentArc.name).then(() => {
      const newArcData =
        arcsDataCache[`${arcId}-${currentLang}-${currentQuality}`];
      if (newArcData?.files?.[currentEpisodeIndex]) {
        video.src = `https://pixeldrain.net/api/file/${newArcData.files[currentEpisodeIndex].id}`;
        checkMatchCacheEp(video.src);
        video.play();
        epTitle.textContent = `${
          currentArc.name
        } (${currentLang.toUpperCase()}) Ep ${currentEpisodeIndex + 1}`;
      }
    });
  }
  settingsPopup.classList.remove("show");
  langOverlay.classList.remove("show");
});

// --- Episodes Popup ---
function populateArcs() {
  episodesPopup.innerHTML = `<h2>Arcs (${currentLang.toUpperCase()})</h2>`;
  episodesPopup.scrollTop = 0;
  arcsData.arcs.forEach((arc, index) => {
    const btn = document.createElement("button");
    btn.className = "arc-btn";
    btn.textContent = arc.name;
    btn.addEventListener("click", () => {
      currentArcIndex = index;
      currentQuality = arc["available_qualities"].at(-1);
      if (!arc["available_languages"].includes(currentLang)) {
        currentLang = arc["available_languages"].at(0);
      }

      fetchArcEpisodes(arc[currentLang][currentQuality], arc.name);
    });
    episodesPopup.appendChild(btn);
  });
}
async function fetchArcEpisodes(arcId, arcName) {
  try {
    episodesPopup.innerHTML = `<h2>Loading ${arcName} (${currentLang.toUpperCase()})...</h2>`;
    const res = await fetch(`https://pixeldrain.net/api/list/${arcId}`);
    const data = await res.json();
    if (!data.success) throw new Error("Failed to fetch episodes");
    episodesPopup.innerHTML = `<div class="arc-header"><button id="backToArcs" class="back-btn"><?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="3" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffff"><path d="M21 12L3 12M3 12L11.5 3.5M3 12L11.5 20.5" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg></button><h2>${arcName} (${data.file_count} eps)</h2></div>`;
    document
      .getElementById("backToArcs")
      .addEventListener("click", populateArcs);
    arcsDataCache[`${arcId}-${currentLang}-${currentQuality}`] = data;
    data.files.forEach((file, i) => {
      const epBtn = document.createElement("button");
      epBtn.className = "arc-btn";
      epBtn.textContent = `Episode ${i + 1}`;
      epBtn.addEventListener("click", () => {
        currentEpisodeIndex = i;
        video.src = `https://pixeldrain.net/api/file/${file.id}`;
        checkMatchCacheEp(video.src);
        video.play();
        episodesPopup.classList.remove("show");

        epTitle.textContent = `${arcName} (${currentLang.toUpperCase()}) Ep ${
          i + 1
        }`;
      });
      episodesPopup.appendChild(epBtn);
    });
  } catch (err) {
    console.error(err);
    episodesPopup.innerHTML = `<h2>${arcName}</h2><p style="color:red;">Failed to load episodes</p>`;
  }
}
episodesBtn.addEventListener("click", () => {
  episodesPopup.classList.add("show");
  populateArcs();
});
episodesPopup.addEventListener("mouseleave", () =>
  episodesPopup.classList.remove("show")
);

// --- Next Episode ---
nextEpBtn.addEventListener("click", async () => {
  const currentArc = arcsData.arcs[currentArcIndex];
  currentQuality = currentArc["available_qualities"].at(-1);
  if (!currentArc["available_languages"].includes(currentLang)) {
    currentLang = currentArc["available_languages"].at(0);
  }
  const arcId = currentArc[currentLang][currentQuality];

  let arcData = arcsDataCache[`${arcId}-${currentLang}-${currentQuality}`];
  if (!arcData) {
    const res = await fetch(`https://pixeldrain.net/api/list/${arcId}`);
    arcData = await res.json();
    arcsDataCache[`${arcId}-${currentLang}-${currentQuality}`] = arcData;
  }
  const episodes = arcData.files;
  if (currentEpisodeIndex < episodes.length - 1) currentEpisodeIndex++;
  else if (currentArcIndex < arcsData.arcs.length - 1) {
    currentArcIndex++;
    currentEpisodeIndex = 0;
  } else {
    console.log("You’ve finished all arcs!");
    return;
  }
  const nextArc = arcsData.arcs[currentArcIndex];
  const nextArcId = nextArc[currentLang][currentQuality];
  let nextArcData =
    arcsDataCache[`${nextArcId}-${currentLang}-${currentQuality}`];
  if (!nextArcData) {
    const res = await fetch(`https://pixeldrain.net/api/list/${nextArcId}`);
    nextArcData = await res.json();
    arcsDataCache[`${nextArcId}-${currentLang}-${currentQuality}`] =
      nextArcData;
  }

  video.src = `https://pixeldrain.net/api/file/${nextArcData.files[currentEpisodeIndex].id}`;
  checkMatchCacheEp(video.src);
  video.play();

  epTitle.textContent = `${nextArc.name} (${currentLang.toUpperCase()}) Ep ${
    currentEpisodeIndex + 1
  }`;
});

window.addEventListener("beforeunload", () => {
  let firstTime = false;
  if (!("currentEp" in localStorage)) {
    video.src = "https://pixeldrain.net/api/file/3Yuxg9Y9";
    epTitle.innerText = "Romance Dawn (SUB) Ep 1";
    video.currentTime = 0;
    firstTime = true;
  }
  let episodeUrl = video.src;
  let episodeTitle = epTitle.textContent;
  let episodeTime = video.currentTime;
  localStorage.setItem(
    "currentEp",
    JSON.stringify({
      url: episodeUrl,
      title: episodeTitle,
      time: episodeTime,
      isFirstTime: firstTime,
      currentArcIndex: currentArcIndex,
      currentEpisodeIndex: currentEpisodeIndex,
      currentLang: currentLang,
      currentQuality: currentQuality,
    })
  );
});

function checkMatchCacheEp(currentUrl) {
  video.addEventListener("loadedmetadata", () => {
    const cachedEpUrl = JSON.parse(localStorage.getItem("currentEp"))["url"];
    if (cachedEpUrl === currentUrl) return;
    video.currentTime = 0;
  });
}

function showOverlay(type, position = "center") {
  let iconPath = "";
  switch (type) {
    case "play":
      iconPath =
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yNDAsMTI4YTE1Ljc0LDE1Ljc0LDAsMCwxLTcuNiwxMy41MUw4OC4zMiwyMjkuNjVhMTYsMTYsMCwwLDEtMTYuMi4zQTE1Ljg2LDE1Ljg2LDAsMCwxLDY0LDIxNi4xM1YzOS44N2ExNS44NiwxNS44NiwwLDAsMSw4LjEyLTEzLjgyLDE2LDE2LDAsMCwxLDE2LjIuM0wyMzIuNCwxMTQuNDlBMTUuNzQsMTUuNzQsMCwwLDEsMjQwLDEyOFoiPjwvcGF0aD48L3N2Zz4=";
      break;
    case "pause":
      iconPath =
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yMTYsNDhWMjA4YTE2LDE2LDAsMCwxLTE2LDE2SDE2MGExNiwxNiwwLDAsMS0xNi0xNlY0OGExNiwxNiwwLDAsMSwxNi0xNmg0MEExNiwxNiwwLDAsMSwyMTYsNDhaTTk2LDMySDU2QTE2LDE2LDAsMCwwLDQwLDQ4VjIwOGExNiwxNiwwLDAsMCwxNiwxNkg5NmExNiwxNiwwLDAsMCwxNi0xNlY0OEExNiwxNiwwLDAsMCw5NiwzMloiPjwvcGF0aD48L3N2Zz4=";
      break;
    case "forward":
      iconPath =
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yNTYsMTI4YTE1Ljc2LDE1Ljc2LDAsMCwxLTcuMzMsMTMuMzRMMTYwLjQ4LDE5Ny41QTE1LjkxLDE1LjkxLDAsMCwxLDEzNiwxODQuMTZ2LTM3LjNMNTYuNDgsMTk3LjVBMTUuOTEsMTUuOTEsMCwwLDEsMzIsMTg0LjE2VjcxLjg0QTE1LjkxLDE1LjkxLDAsMCwxLDU2LjQ4LDU4LjVMMTM2LDEwOS4xNFY3MS44NEExNS45MSwxNS45MSwwLDAsMSwxNjAuNDgsNTguNWw4OC4xOSw1Ni4xNkExNS43NiwxNS43NiwwLDAsMSwyNTYsMTI4WiI+PC9wYXRoPjwvc3ZnPg==";
      break;
    case "backward":
      iconPath =
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yMzIsNzEuODRWMTg0LjE2YTE1LjkyLDE1LjkyLDAsMCwxLTI0LjQ4LDEzLjM0TDEyOCwxNDYuODZ2MzcuM2ExNS45MiwxNS45MiwwLDAsMS0yNC40OCwxMy4zNEwxNS4zMywxNDEuMzRhMTUuOCwxNS44LDAsMCwxLDAtMjYuNjhMMTAzLjUyLDU4LjVBMTUuOTEsMTUuOTEsMCwwLDEsMTI4LDcxLjg0djM3LjNMMjA3LjUyLDU4LjVBMTUuOTEsMTUuOTEsMCwwLDEsMjMyLDcxLjg0WiI+PC9wYXRoPjwvc3ZnPg==";
      break;
  }
  const overlayIcon = document.createElement("div");
  playerContainer.appendChild(overlayIcon);
  overlayIcon.innerHTML = `<img src="${iconPath}" class="overlay-icon" />`;
  overlayIcon.className = "overlay-effect";
  overlayIcon.classList.add(position);
  overlayIcon.classList.add("show");
  overlayIcon.addEventListener(
    "transitionend",
    () => {
      overlayIcon.remove();
    },
    { once: true }
  );

  setTimeout(() => {
    overlayIcon.classList.remove("show");
  }, 250);
}

