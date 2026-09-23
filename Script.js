// STJ MEDIA — PUBLIC WEBSITE SCRIPT

const SUPABASE_URL = "https://acuszwigwpfrumkhtdeh.supabase.co";
const SUPABASE_KEY = "sb_publishable_nXq7buM0ASGpEvRq_12VDQ_yLUkGIo2";

const portfolio = document.getElementById("portfolio");
const filters = document.querySelectorAll(".filter");


// ===============================
// MOBILE MENU
// ===============================

const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav nav");

if (menu && nav) {
  menu.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}


// ===============================
// SCROLL REVEAL
// ===============================

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

  const observer = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }

      });

    },
    {
      threshold: 0.12
    }
  );

  revealItems.forEach(item => observer.observe(item));
}


// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// ===============================
// LOAD PORTFOLIO
// ===============================

async function loadPortfolio(category = "all") {

  if (!portfolio) return;

  portfolio.innerHTML = `
    <div style="
      grid-column:1/-1;
      padding:40px;
      text-align:center;
      color:#888;
    ">
      Loading work...
    </div>
  `;

  try {

    const url =
      `${SUPABASE_URL}/rest/v1/portfolio` +
      `?select=id,title,category,description,media_url,media_type,created_at` +
      `&order=created_at.desc`;

    const response = await fetch(url, {

      method: "GET",

      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }

    });


    if (!response.ok) {

      const errorText = await response.text();

      console.error("Supabase error:", errorText);

      throw new Error(errorText || "Portfolio data could not be loaded.");

    }


    let data = await response.json();

    console.log("STJ Portfolio data:", data);


    // ===============================
    // CATEGORY FILTER
    // ===============================

    if (category !== "all") {

      data = data.filter(item => {

        return String(item.category || "").toLowerCase() ===
               String(category).toLowerCase();

      });

    }


    // ===============================
    // NO WORK
    // ===============================

    if (!data.length) {

      portfolio.innerHTML = `
        <div style="
          grid-column:1/-1;
          padding:50px;
          text-align:center;
          color:#888;
        ">
          No work added yet.
        </div>
      `;

      return;
    }


    // ===============================
    // CREATE CARDS
    // ===============================

    portfolio.innerHTML = data.map(item => {


      let mediaHTML = "";


      // VIDEO
      if (
        item.media_type === "video" ||
        (item.media_url &&
         /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(item.media_url))
      ) {

        mediaHTML = `
          <video
            src="${escapeHTML(item.media_url)}"
            controls
            playsinline
            preload="metadata"
            style="
              width:100%;
              height:100%;
              object-fit:cover;
              display:block;
            "
          ></video>
        `;

      }


      // IMAGE
      else {

        mediaHTML = `
          <img
            src="${escapeHTML(item.media_url)}"
            alt="${escapeHTML(item.title || "STJ Media work")}"
            loading="lazy"
            style="
              width:100%;
              height:100%;
              object-fit:cover;
              display:block;
            "
          >
        `;

      }


      return `
        <article class="portfolio-card reveal show">

          <div style="
            aspect-ratio:4/3;
            overflow:hidden;
            background:#111;
            border-radius:16px;
          ">

            ${mediaHTML}

          </div>


          <div style="
            padding:18px 4px;
          ">

            <small style="
              color:#888;
              text-transform:uppercase;
              letter-spacing:1px;
            ">
              ${escapeHTML(item.category || "Work")}
            </small>


            <h3 style="
              margin:7px 0 4px;
            ">
              ${escapeHTML(item.title || "STJ Media Project")}
            </h3>


            ${
              item.description
                ? `
                  <p style="
                    color:#888;
                    margin:0;
                  ">
                    ${escapeHTML(item.description)}
                  </p>
                `
                : ""
            }

          </div>

        </article>
      `;

    }).join("");


  } catch (error) {

    console.error("STJ Portfolio Error:", error);

    portfolio.innerHTML = `
      <div style="
        grid-column:1/-1;
        padding:40px;
        text-align:center;
        color:#ff7777;
      ">
        Portfolio load nahi ho pa raha.
      </div>
    `;

  }

}


// ===============================
// FILTER BUTTONS
// ===============================

filters.forEach(button => {

  button.addEventListener("click", () => {

    filters.forEach(btn => {
      btn.classList.remove("active");
    });


    button.classList.add("active");


    const category =
      button.dataset.filter || "all";


    loadPortfolio(category);

  });

});


// ===============================
// INITIAL LOAD
// ===============================

loadPortfolio("all");
