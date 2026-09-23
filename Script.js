// STJ MEDIA — PUBLIC WEBSITE SCRIPT

const SUPABASE_URL = "https://acuszwigwpfrumkhtdeh.supabase.co";
const SUPABASE_KEY = "sb_publishable_nXq7buM0ASGpEvRq_12VDQ_yLUkGIo2";

const portfolio = document.getElementById("portfolio");
const filters = document.querySelectorAll(".filter");

// Mobile menu
const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav nav");

if (menu && nav) {
  menu.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

// Scroll reveal
const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach(item => observer.observe(item));

// Portfolio loading
async function loadPortfolio(category = "all") {

  if (!portfolio) return;

  portfolio.innerHTML = `
    <div style="grid-column:1/-1;padding:40px;text-align:center;color:#888;">
      Loading work...
    </div>
  `;

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/portfolio?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Portfolio data could not be loaded.");
    }

    let data = await response.json();

    if (category !== "all") {
      data = data.filter(item => item.category === category);
    }

    if (!data.length) {
      portfolio.innerHTML = `
        <div style="grid-column:1/-1;padding:50px;text-align:center;color:#888;">
          No work added yet.<br>
          Add your first project from the Admin panel.
        </div>
      `;
      return;
    }

    portfolio.innerHTML = data.map(item => {

      const media = item.media_type === "video"
        ? `
          <video
            src="${item.media_url}"
            controls
            playsinline
            style="width:100%;height:100%;object-fit:cover;">
          </video>
        `
        : `
          <img
            src="${item.media_url}"
            alt="${escapeHTML(item.title || "STJ Media work")}"
            loading="lazy"
            style="width:100%;height:100%;object-fit:cover;">
        `;

      return `
        <article class="portfolio-card reveal">
          <div style="
            aspect-ratio:4/3;
            overflow:hidden;
            background:#111;
            border-radius:16px;
          ">
            ${media}
          </div>

          <div style="padding:18px 4px;">
            <small style="color:#888;text-transform:uppercase;">
              ${escapeHTML(item.category || "Work")}
            </small>

            <h3 style="margin:7px 0 4px;">
              ${escapeHTML(item.title || "STJ Media Project")}
            </h3>

            ${
              item.description
                ? `<p style="color:#888;margin:0;">
                    ${escapeHTML(item.description)}
                   </p>`
                : ""
            }
          </div>
        </article>
      `;

    }).join("");

  } catch (error) {

    console.error(error);

    portfolio.innerHTML = `
      <div style="grid-column:1/-1;padding:40px;text-align:center;color:#ff7777;">
        Portfolio load nahi ho pa raha.
      </div>
    `;
  }
}


// Filter buttons
filters.forEach(button => {

  button.addEventListener("click", () => {

    filters.forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    const category = button.dataset.filter;

    loadPortfolio(category);

  });

});


// Basic HTML escaping
function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// Initial load
loadPortfolio();
