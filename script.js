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
