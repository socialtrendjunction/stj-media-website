// ======================================================
// STJ MEDIA — FINAL PUBLIC WEBSITE SCRIPT
// ======================================================

const SUPABASE_URL = "https://acuszwigwpfrumkhtdeh.supabase.co";
const SUPABASE_KEY = "sb_publishable_nXq7buM0ASGpEvRq_12VDQ_yLUkGIo2";

function loadSupabase() {
  return new Promise((resolve, reject) => {
    if (window.supabase) { resolve(window.supabase); return; }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.onload = () => {
      if (window.supabase) resolve(window.supabase);
      else reject(new Error("Supabase library not available."));
    };
    script.onerror = () => reject(new Error("Supabase library could not load."));
    document.head.appendChild(script);
  });
}

const portfolio = document.getElementById("portfolio");
const filters = document.querySelectorAll(".filter");

const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav nav");
if (menu && nav) {
  menu.addEventListener("click", () => nav.classList.toggle("open"));
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function startReveal() {
  const items = document.querySelectorAll(".reveal");
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
// LIGHTBOX (full-size photo/video viewer)
// ======================================================

function injectLightboxStyles(){
  if(document.getElementById("stj-lightbox-style")) return;
  const style = document.createElement("style");
  style.id = "stj-lightbox-style";
  style.textContent = `
    .stj-lb-overlay{position:fixed;inset:0;background:rgba(0,0,0,0);display:flex;
      align-items:center;justify-content:center;z-index:9999;opacity:0;
      transition:opacity .28s ease, background .28s ease;padding:24px;box-sizing:border-box;}
    .stj-lb-overlay.stj-lb-show{opacity:1;background:rgba(0,0,0,.92);}
    .stj-lb-box{max-width:92vw;max-height:88vh;transform:scale(.92);
      transition:transform .28s ease;display:flex;flex-direction:column;align-items:center;}
    .stj-lb-overlay.stj-lb-show .stj-lb-box{transform:scale(1);}
    .stj-lb-box img{max-width:92vw;max-height:78vh;border-radius:14px;display:block;object-fit:contain;}
    .stj-lb-box video{max-width:92vw;max-height:70vh;border-radius:14px;display:block;background:#000;}
    .stj-lb-close{position:fixed;top:18px;right:18px;width:42px;height:42px;border-radius:50%;
      background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#fff;
      font-size:22px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;}
    .stj-vc{margin-top:12px;display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.06);
      border:1px solid rgba(255,255,255,.15);border-radius:30px;padding:8px 14px;width:min(92vw,520px);}
    .stj-vc button{background:transparent;border:0;color:#fff;font-size:16px;cursor:pointer;
      width:auto;padding:4px 6px;flex:none;}
    .stj-vc input[type=range]{flex:1;accent-color:#d7ff45;}
    .stj-vc .stj-vc-time{color:#aaa;font-size:12px;min-width:70px;text-align:center;flex:none;}
    .stj-vc select{width:auto;flex:none;background:#111;color:#fff;border:1px solid #333;
      border-radius:8px;padding:4px 6px;font-size:12px;}
  `;
  document.head.appendChild(style);
}

function formatTime(sec){
  if(!isFinite(sec)) return "0:00";
  const m = Math.floor(sec/60);
  const s = Math.floor(sec%60).toString().padStart(2,"0");
  return `${m}:${s}`;
}

function openLightbox(mediaUrl, mediaType, title){
  injectLightboxStyles();

  const overlay = document.createElement("div");
  overlay.className = "stj-lb-overlay";

  const closeBtn = document.createElement("button");
  closeBtn.className = "stj-lb-close";
  closeBtn.innerHTML = "&times;";
  closeBtn.setAttribute("aria-label","Close");

  const box = document.createElement("div");
  box.className = "stj-lb-box";

  function close(){
    overlay.classList.remove("stj-lb-show");
    setTimeout(()=> overlay.remove(), 250);
    document.removeEventListener("keydown", onKey);
  }
  function onKey(e){ if(e.key === "Escape") close(); }

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e)=>{ if(e.target === overlay) close(); });
  document.addEventListener("keydown", onKey);

  if(mediaType === "video"){
    const video = document.createElement("video");
    video.src = mediaUrl;
    video.playsInline = true;
    video.setAttribute("aria-label", title || "Video");

    const controls = document.createElement("div");
    controls.className = "stj-vc";

    const playBtn = document.createElement("button");
    playBtn.textContent = "▶";

    const seek = document.createElement("input");
    seek.type = "range"; seek.min = "0"; seek.max = "100"; seek.value = "0";

    const time = document.createElement("span");
    time.className = "stj-vc-time";
    time.textContent = "0:00 / 0:00";

    const speed = document.createElement("select");
    ["0.5","1","1.25","1.5","2"].forEach(r=>{
      const opt = document.createElement("option");
      opt.value = r; opt.textContent = r+"x";
      if(r==="1") opt.selected = true;
      speed.appendChild(opt);
    });

    const muteBtn = document.createElement("button");
    muteBtn.textContent = "🔊";

    const fsBtn = document.createElement("button");
    fsBtn.textContent = "⛶";

    playBtn.addEventListener("click", ()=>{
      if(video.paused){ video.play(); } else { video.pause(); }
    });
    video.addEventListener("play", ()=> playBtn.textContent = "⏸");
    video.addEventListener("pause", ()=> playBtn.textContent = "▶");

    video.addEventListener("timeupdate", ()=>{
      if(video.duration){
        seek.value = String((video.currentTime/video.duration)*100);
      }
      time.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    });
    seek.addEventListener("input", ()=>{
      if(video.duration){
        video.currentTime = (Number(seek.value)/100)*video.duration;
      }
    });

    speed.addEventListener("change", ()=>{
      video.playbackRate = Number(speed.value);
    });

    muteBtn.addEventListener("click", ()=>{
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? "🔇" : "🔊";
    });

    fsBtn.addEventListener("click", ()=>{
      if(video.requestFullscreen) video.requestFullscreen();
    });

    controls.appendChild(playBtn);
    controls.appendChild(seek);
    controls.appendChild(time);
    controls.appendChild(speed);
    controls.appendChild(muteBtn);
    controls.appendChild(fsBtn);

    box.appendChild(video);
    box.appendChild(controls);

    overlay.appendChild(box);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    requestAnimationFrame(()=> overlay.classList.add("stj-lb-show"));

    video.play().catch(()=>{});

  } else {
    const img = document.createElement("img");
    img.src = mediaUrl;
    img.alt = title || "";
    box.appendChild(img);

    overlay.appendChild(box);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    requestAnimationFrame(()=> overlay.classList.add("stj-lb-show"));
  }
}

// ======================================================
// LOAD PORTFOLIO
// ======================================================

async function loadPortfolio(category = "all") {
  if (!portfolio) { console.error("STJ MEDIA: #portfolio not found."); return; }

  portfolio.innerHTML = `
    <div style="grid-column:1/-1;padding:40px;text-align:center;color:#888;">
      Loading work...
    </div>
  `;

  try {
    const supabaseLibrary = await loadSupabase();
    const supabaseClient = supabaseLibrary.createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data, error } = await supabaseClient
      .from("portfolio")
      .select("id,title,category,description,media_url,media_type,status,created_at")
      .order("created_at", { ascending: false });

    if (error) { console.error("STJ MEDIA SUPABASE ERROR:", error); throw error; }

    let works = Array.isArray(data) ? data : [];

    // Hide archived items from the public site (missing/NULL status = still published)
    works = works.filter(item => item.status !== "archived");

    if (category !== "all") {
      const selectedCategory = String(category).toLowerCase();
      works = works.filter(item => String(item.category || "").toLowerCase() === selectedCategory);
    }

    if (!works.length) {
      portfolio.innerHTML = `
        <div style="grid-column:1/-1;padding:50px;text-align:center;color:#888;">
          No work added yet.
        </div>
      `;
      return;
    }

    portfolio.innerHTML = works.map(item => {
      const title = escapeHTML(item.title || "STJ Media Project");
      const categoryName = escapeHTML(item.category || "Work");
      const description = escapeHTML(item.description || "");
      const mediaURL = escapeHTML(item.media_url || "");
      const isVideo = String(item.media_type || "").toLowerCase() === "video";
      const reelUrl = escapeHTML(item.reel_url || "");

      let mediaHTML = "";
      if (isVideo) {
        mediaHTML = `
          <video src="${mediaURL}" muted playsinline preload="metadata"
            style="width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;"></video>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
            <div style="width:52px;height:52px;border-radius:50%;background:rgba(0,0,0,.55);
              display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;">▶</div>
          </div>
        `;
      } else {
        mediaHTML = `
          <img src="${mediaURL}" alt="${title}" loading="lazy"
            onerror="this.style.display='none';"
            style="width:100%;height:100%;object-fit:cover;display:block;">
        `;
      }

      return `
        <article class="portfolio-card reveal show" data-url="${mediaURL}" data-type="${isVideo?'video':'image'}" data-title="${title}" style="cursor:pointer;">
          <div style="aspect-ratio:4/3;overflow:hidden;background:#111;border-radius:16px;position:relative;">
            ${mediaHTML}
          </div>
          <div style="padding:18px 4px;">
            <small style="color:#888;text-transform:uppercase;letter-spacing:1px;">${categoryName}</small>
            <h3 style="margin:7px 0 4px;">${title}</h3>
            ${description ? `<p style="color:#888;margin:0 0 8px;">${description}</p>` : ""}
            ${reelUrl ? `<a href="${reelUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation();" style="color:#d7ff45;font-size:13px;font-weight:600;text-decoration:none;">Watch Reel on Instagram ↗</a>` : ""}
          </div>
        </article>
      `;
    }).join("");

    portfolio.querySelectorAll(".portfolio-card").forEach(card=>{
      card.addEventListener("click", ()=>{
        openLightbox(card.dataset.url, card.dataset.type, card.dataset.title);
      });
    });

    startReveal();
    console.log("STJ MEDIA: Portfolio loaded successfully.", works);

  } catch (error) {
    console.error("STJ MEDIA PORTFOLIO ERROR:", error);
    portfolio.innerHTML = `
      <div style="grid-column:1/-1;padding:40px;text-align:center;color:#ff7777;">
        Portfolio load nahi ho pa raha.
      </div>
    `;
  }
}

filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    const category = button.getAttribute("data-filter") || "all";
    loadPortfolio(category);
  });
});

// ======================================================
// LOAD TEAM
// ======================================================

async function loadTeam(){
  const teamGrid = document.getElementById("team-grid");
  if(!teamGrid) return;

  teamGrid.innerHTML = `<div style="grid-column:1/-1;padding:30px;text-align:center;color:#888;">Loading team...</div>`;

  try{
    const supabaseLibrary = await loadSupabase();
    const supabaseClient = supabaseLibrary.createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data, error } = await supabaseClient
      .from("team_members")
      .select("id,name,role,work,skills,photo_url,instagram_url,linkedin_url,display_order,status")
      .order("display_order", { ascending: true });

    if(error){ console.error("STJ MEDIA TEAM ERROR:", error); throw error; }

    let members = Array.isArray(data) ? data : [];
    members = members.filter(m => m.status !== "archive" && m.status !== "bin");

    if(!members.length){
      teamGrid.innerHTML = `<div style="grid-column:1/-1;padding:30px;text-align:center;color:#888;">Team coming soon.</div>`;
      return;
    }

    teamGrid.innerHTML = members.map((m, i) => {
      const name = escapeHTML(m.name || "");
      const role = escapeHTML(m.role || "");
      const photo = m.photo_url
        ? `<img src="${escapeHTML(m.photo_url)}" alt="${name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
        : escapeHTML((m.name||"?")[0]);

      const socials = [];
      if(m.instagram_url) socials.push(`<a href="${escapeHTML(m.instagram_url)}" target="_blank" rel="noopener" style="color:#888;margin-right:10px;">Instagram</a>`);
      if(m.linkedin_url) socials.push(`<a href="${escapeHTML(m.linkedin_url)}" target="_blank" rel="noopener" style="color:#888;">LinkedIn</a>`);

      return `
        <article class="team reveal show">
          <div class="team-photo" style="overflow:hidden;">${photo}</div>
          <div>
            <small>0${i+1}</small>
            <h3>${name}</h3>
            <p>${role}</p>
            ${socials.length ? `<div style="margin-top:8px;font-size:13px;">${socials.join("")}</div>` : ""}
          </div>
        </article>
      `;
    }).join("");

    startReveal();

  }catch(error){
    console.error("STJ MEDIA TEAM LOAD ERROR:", error);
    teamGrid.innerHTML = `<div style="grid-column:1/-1;padding:30px;text-align:center;color:#ff7777;">Team load nahi ho pa raha.</div>`;
  }
}

// Agar koi invite/confirm/recovery link home page pe khul jaye, use admin.html pe bhej do
if (location.hash && /token=/.test(location.hash)) {
  location.replace("/admin.html" + location.hash);
}

loadPortfolio("all");
loadTeam();
startReveal();
