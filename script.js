// ======================================================
// STJ MEDIA — FINAL PUBLIC WEBSITE SCRIPT
// ======================================================

const SUPABASE_URL = "https://acuszwigwpfrumkhtdeh.supabase.co";
const SUPABASE_KEY = "sb_publishable_nXq7buM0ASGpEvRq_12VDQ_yLUkGIo2";

function loadSupabase() {
  return new Promise((resolve, reject) => {
    if (window.supabase) {
      resolve(window.supabase);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

    script.onload = () => {
      if (window.supabase) {
        resolve(window.supabase);
      } else {
        reject(new Error("Supabase library not available."));
      }
    };

    script.onerror = () => {
      reject(new Error("Supabase library could not load."));
    };

    document.head.appendChild(script);
  });
}

const portfolio = document.getElementById("portfolio");
const filters = document.querySelectorAll(".filter");
const teamGrid = document.getElementById("team-grid");

const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav nav");

if (menu && nav) {
  menu.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function startReveal() {
  const items = document.querySelectorAll(".reveal:not(.show)");

  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("show"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));
}


// ======================================================
// LIGHTBOX
// ======================================================

function injectLightboxStyles() {
  if (document.getElementById("stj-lightbox-style")) return;

  const style = document.createElement("style");

  style.id = "stj-lightbox-style";

  style.textContent = `
    .stj-lb-overlay{
      position:fixed;
      inset:0;
      background:rgba(0,0,0,0);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:9999;
      opacity:0;
      transition:opacity .28s ease, background .28s ease;
      padding:24px;
      box-sizing:border-box;
    }

    .stj-lb-overlay.stj-lb-show{
      opacity:1;
      background:rgba(0,0,0,.92);
    }

    .stj-lb-box{
      max-width:92vw;
      max-height:88vh;
      transform:scale(.92);
      transition:transform .28s ease;
      display:flex;
      flex-direction:column;
      align-items:center;
    }

    .stj-lb-overlay.stj-lb-show .stj-lb-box{
      transform:scale(1);
    }

    .stj-lb-box img{
      max-width:92vw;
      max-height:78vh;
      border-radius:14px;
      display:block;
      object-fit:contain;
    }

    .stj-lb-box video{
      max-width:92vw;
      max-height:70vh;
      border-radius:14px;
      display:block;
      background:#000;
    }

    .stj-lb-close{
      position:fixed;
      top:18px;
      right:18px;
      width:42px;
      height:42px;
      border-radius:50%;
      background:rgba(255,255,255,.1);
      border:1px solid rgba(255,255,255,.25);
      color:#fff;
      font-size:22px;
      line-height:1;
      cursor:pointer;
      display:flex;
      align-items:center;
      justify-content:center;
    }

    .stj-vc{
      margin-top:12px;
      display:flex;
      align-items:center;
      gap:10px;
      background:rgba(255,255,255,.06);
      border:1px solid rgba(255,255,255,.15);
      border-radius:30px;
      padding:8px 14px;
      width:min(92vw,520px);
    }

    .stj-vc button{
      background:transparent;
      border:0;
      color:#fff;
      font-size:16px;
      cursor:pointer;
      width:auto;
      padding:4px 6px;
      flex:none;
    }

    .stj-vc input[type=range]{
      flex:1;
      accent-color:#d7ff45;
    }

    .stj-vc .stj-vc-time{
      color:#aaa;
      font-size:12px;
      min-width:70px;
      text-align:center;
      flex:none;
    }

    .stj-vc select{
      width:auto;
      flex:none;
      background:#111;
      color:#fff;
      border:1px solid #333;
      border-radius:8px;
      padding:4px 6px;
      font-size:12px;
    }
  `;

  document.head.appendChild(style);
}

function formatTime(sec) {
  if (!isFinite(sec)) return "0:00";

  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");

  return `${m}:${s}`;
}

function openLightbox(mediaUrl, mediaType, title) {

  injectLightboxStyles();

  const overlay = document.createElement("div");
  overlay.className = "stj-lb-overlay";

  const closeBtn = document.createElement("button");
  closeBtn.className = "stj-lb-close";
  closeBtn.innerHTML = "&times;";
  closeBtn.setAttribute("aria-label", "Close");

  const box = document.createElement("div");
  box.className = "stj-lb-box";

  function close() {
    overlay.classList.remove("stj-lb-show");

    setTimeout(() => {
      overlay.remove();
    }, 250);

    document.removeEventListener("keydown", onKey);
  }

  function onKey(e) {
    if (e.key === "Escape") close();
  }

  closeBtn.addEventListener("click", close);

  overlay.addEventListener("click", e => {
    if (e.target === overlay) close();
  });

  document.addEventListener("keydown", onKey);

  if (mediaType === "video") {

    const video = document.createElement("video");

    video.src = mediaUrl;
    video.playsInline = true;
    video.setAttribute("aria-label", title || "Video");

    const controls = document.createElement("div");
    controls.className = "stj-vc";

    const playBtn = document.createElement("button");
    playBtn.textContent = "▶";

    const seek = document.createElement("input");
    seek.type = "range";
    seek.min = "0";
    seek.max = "100";
    seek.value = "0";

    const time = document.createElement("span");
    time.className = "stj-vc-time";
    time.textContent = "0:00 / 0:00";

    const speed = document.createElement("select");

    ["0.5", "1", "1.25", "1.5", "2"].forEach(r => {

      const opt = document.createElement("option");

      opt.value = r;
      opt.textContent = r + "x";

      if (r === "1") {
        opt.selected = true;
      }

      speed.appendChild(opt);
    });

    const muteBtn = document.createElement("button");
    muteBtn.textContent = "🔊";

    const fsBtn = document.createElement("button");
    fsBtn.textContent = "⛶";

    playBtn.addEventListener("click", () => {

      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }

    });

    video.addEventListener("play", () => {
      playBtn.textContent = "⏸";
    });

    video.addEventListener("pause", () => {
      playBtn.textContent = "▶";
    });

    video.addEventListener("timeupdate", () => {

      if (video.duration) {
        seek.value = String(
          (video.currentTime / video.duration) * 100
        );
      }

      time.textContent =
        `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    });

    seek.addEventListener("input", () => {

      if (video.duration) {
        video.currentTime =
          (Number(seek.value) / 100) * video.duration;
      }

    });

    speed.addEventListener("change", () => {
      video.playbackRate = Number(speed.value);
    });

    muteBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? "🔇" : "🔊";
    });

    fsBtn.addEventListener("click", () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      }
    });

    controls.appendChild(playBtn);
    controls.appendChild(seek);
    controls.appendChild(time);
    controls.appendChild(speed);
    controls.appendChild(muteBtn);
    controls.appendChild(fsBtn);

    box.appendChild(video);
    box.appendChild(controls);

    overlay.appendChild(closeBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add("stj-lb-show");
    });

    video.play().catch(() => {});

  } else {

    const img = document.createElement("img");
    img.src = mediaUrl;
    img.alt = title || "";

    box.appendChild(img);

    overlay.appendChild(closeBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add("stj-lb-show");
    });
  }
}


// ======================================================
// PORTFOLIO — LOADED FROM SUPABASE
// ======================================================

const categoryLabels = {
  design: "Graphic Design",
  shoot: "Photo & Video",
  edit: "Video Editing",
  social: "Social Media"
};

async function loadPortfolio(client) {
  if (!portfolio) return;

  portfolio.innerHTML = `<p class="section-note">Loading work...</p>`;

  const { data, error } = await client
    .from("portfolio")
    .select("*")
    .eq("status", "live")
    .order("created_at", { ascending: false });

  if (error) {
    portfolio.innerHTML = `<p class="section-note">Could not load portfolio right now.</p>`;
    console.error(error);
    return;
  }

  if (!data || !data.length) {
    portfolio.innerHTML = `<p class="section-note">New work is coming soon.</p>`;
    return;
  }

  portfolio.innerHTML = data.map((item, i) => {
    const isVideo = item.media_type === "video";
    const media = isVideo
      ? `<video src="${escapeHTML(item.media_url)}" muted playsinline preload="metadata"></video>`
      : `<img src="${escapeHTML(item.media_url)}" alt="${escapeHTML(item.title)}" loading="lazy">`;

    return `
      <div class="work-card reveal" data-category="${escapeHTML(item.category)}" data-id="${item.id}">
        <div class="work-media" data-media-url="${escapeHTML(item.media_url)}" data-media-type="${isVideo ? "video" : "image"}" data-title="${escapeHTML(item.title)}">
          ${media}
        </div>
        <div class="work-info">
          <div>
            <h3>${escapeHTML(item.title)}</h3>
            <p>${escapeHTML(categoryLabels[item.category] || item.category)}</p>
          </div>
          <span class="work-num">${String(i + 1).padStart(2, "0")}</span>
        </div>
      </div>
    `;
  }).join("");

  portfolio.querySelectorAll(".work-media").forEach(el => {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => {
      openLightbox(el.dataset.mediaUrl, el.dataset.mediaType, el.dataset.title);
    });
  });

  startReveal();
  applyFilter(getActiveFilter());
}

function getActiveFilter() {
  const active = document.querySelector(".filter.active");
  return active ? active.dataset.filter : "all";
}

function applyFilter(value) {
  document.querySelectorAll(".work-card").forEach(card => {
    const show = value === "all" || card.dataset.category === value;
    card.style.display = show ? "" : "none";
  });
}

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter(btn.dataset.filter);
  });
});


// ======================================================
// TEAM — LOADED FROM SUPABASE
// ======================================================

async function loadTeam(client) {
  if (!teamGrid) return;

  teamGrid.innerHTML = `<div class="team-loading">Loading team...</div>`;

  const { data, error } = await client
    .from("team_members")
    .select("*")
    .eq("status", "live")
    .order("display_order", { ascending: true });

  if (error) {
    teamGrid.innerHTML = `<div class="team-loading">Could not load team right now.</div>`;
    console.error(error);
    return;
  }

  if (!data || !data.length) {
    teamGrid.innerHTML = `<div class="team-loading">Team details coming soon.</div>`;
    return;
  }

  teamGrid.innerHTML = data.map(member => {
    const initial = escapeHTML((member.name || "?")[0] || "?");
    const photo = member.photo_url
      ? `<img src="${escapeHTML(member.photo_url)}" alt="${escapeHTML(member.name)}" style="width:100%;height:100%;object-fit:cover">`
      : initial;

    const socials = [];
    if (member.instagram_url) {
      socials.push(`<a href="${escapeHTML(member.instagram_url)}" target="_blank" rel="noopener">Instagram ↗</a>`);
    }
    if (member.linkedin_url) {
      socials.push(`<a href="${escapeHTML(member.linkedin_url)}" target="_blank" rel="noopener">LinkedIn ↗</a>`);
    }

    return `
      <div class="team reveal">
        <div class="team-photo">${photo}</div>
        <div>
          <small>${escapeHTML(member.role || "")}</small>
          <h3>${escapeHTML(member.name)}</h3>
          <p>${escapeHTML(member.work || "")}</p>
          ${socials.length ? `<p style="margin-top:8px;display:flex;gap:10px;font-size:10px;letter-spacing:.08em">${socials.join("")}</p>` : ""}
        </div>
      </div>
    `;
  }).join("");

  startReveal();
}


// ======================================================
// INIT
// ======================================================

async function init() {
  startReveal();

  try {
    const supabaseLib = await loadSupabase();
    const client = supabaseLib.createClient(SUPABASE_URL, SUPABASE_KEY);

    await Promise.all([
      loadPortfolio(client),
      loadTeam(client)
    ]);
  } catch (err) {
    console.error(err);
    if (portfolio) portfolio.innerHTML = `<p class="section-note">Could not connect right now.</p>`;
    if (teamGrid) teamGrid.innerHTML = `<div class="team-loading">Could not connect right now.</div>`;
  }
}

init();
