// ======================================================
// STJ MEDIA — PUBLIC WEBSITE SCRIPT
// ======================================================

const SUPABASE_URL =
  "https://acuszwigwpfrumkhtdeh.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_nXq7buM0ASGpEvRq_12VDQ_yLUkGIo2";


// ======================================================
// ELEMENTS
// ======================================================

const portfolio = document.getElementById("portfolio");
const filters = document.querySelectorAll(".filter");


// ======================================================
// MOBILE MENU
// ======================================================

const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav nav");

if (menu && nav) {

  menu.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

}


// ======================================================
// SCROLL REVEAL
// ======================================================

function startReveal() {

  const items = document.querySelectorAll(".reveal");

  if (!items.length) return;


  // Show items normally if browser doesn't support observer
  if (!("IntersectionObserver" in window)) {

    items.forEach(item => {
      item.classList.add("show");
    });

    return;
  }


  const observer = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("show");

          observer.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.12
    }
  );


  items.forEach(item => {
    observer.observe(item);
  });

}


// Start reveal immediately
startReveal();


// ======================================================
// HTML SECURITY
// ======================================================

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ======================================================
// PORTFOLIO LOADING
// ======================================================

async function loadPortfolio(category = "all") {

  if (!portfolio) {

    console.error(
      "STJ MEDIA: #portfolio element not found."
    );

    return;
  }


  // Loading message
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

    // --------------------------------------------------
    // SUPABASE REST REQUEST
    // --------------------------------------------------

    const url =
      SUPABASE_URL +
      "/rest/v1/portfolio" +
      "?select=id,title,category,description,media_url,media_type,created_at" +
      "&order=created_at.desc";


    const response = await fetch(url, {

      method: "GET",

      headers: {

        "apikey": SUPABASE_KEY,

        "Authorization":
          "Bearer " + SUPABASE_KEY,

        "Content-Type":
          "application/json"

      }

    });


    // --------------------------------------------------
    // ERROR CHECK
    // --------------------------------------------------

    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "STJ MEDIA SUPABASE ERROR:",
        response.status,
        errorText
      );

      throw new Error(
        "Portfolio request failed."
      );

    }


    // --------------------------------------------------
    // GET DATA
    // --------------------------------------------------

    let works =
      await response.json();


    console.log(
      "STJ MEDIA — Portfolio:",
      works
    );


    // Make sure data is an array
    if (!Array.isArray(works)) {

      works = [];

    }


    // --------------------------------------------------
    // CATEGORY FILTER
    // --------------------------------------------------

    if (category !== "all") {

      const selectedCategory =
        String(category).toLowerCase();


      works = works.filter(item => {

        return String(
          item.category || ""
        ).toLowerCase() === selectedCategory;

      });

    }


    // --------------------------------------------------
    // NO WORK
    // --------------------------------------------------

    if (!works.length) {

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


    // --------------------------------------------------
    // CREATE CARDS
    // --------------------------------------------------

    portfolio.innerHTML = works.map(item => {


      const title =
        escapeHTML(
          item.title ||
          "STJ Media Project"
        );


      const categoryName =
        escapeHTML(
          item.category ||
          "Work"
        );


      const description =
        escapeHTML(
          item.description ||
          ""
        );


      const mediaURL =
        escapeHTML(
          item.media_url ||
          ""
        );


      let mediaHTML = "";


      // ------------------------------------------------
      // VIDEO
      // ------------------------------------------------

      if (
        String(
          item.media_type || ""
        ).toLowerCase() === "video"
      ) {

        mediaHTML = `
          <video
            src="${mediaURL}"
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


      // ------------------------------------------------
      // IMAGE
      // ------------------------------------------------

      else {

        mediaHTML = `
          <img
            src="${mediaURL}"
            alt="${title}"
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


      // ------------------------------------------------
      // CARD
      // ------------------------------------------------

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
              ${categoryName}
            </small>


            <h3 style="
              margin:7px 0 4px;
            ">
              ${title}
            </h3>


            ${
              description
                ? `
                  <p style="
                    color:#888;
                    margin:0;
                  ">
                    ${description}
                  </p>
                `
                : ""
            }

          </div>

        </article>
      `;

    }).join("");


    // Re-run reveal for newly created cards
    startReveal();


  } catch (error) {

    console.error(
      "STJ MEDIA PORTFOLIO ERROR:",
      error
    );


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


// ======================================================
// FILTER BUTTONS
// ======================================================

filters.forEach(button => {

  button.addEventListener("click", () => {


    // Remove active from all
    filters.forEach(btn => {
      btn.classList.remove("active");
    });


    // Add active to clicked button
    button.classList.add("active");


    // Get category
    const category =
      button.getAttribute(
        "data-filter"
      ) || "all";


    // Load selected category
    loadPortfolio(category);

  });

});


// ======================================================
// INITIAL LOAD
// ======================================================

loadPortfolio("all");
