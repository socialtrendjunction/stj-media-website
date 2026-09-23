// ======================================================
// STJ MEDIA — FINAL PUBLIC WEBSITE SCRIPT
// ======================================================

const SUPABASE_URL =
  "https://acuszwigwpfrumkhtdeh.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_nXq7buM0ASGpEvRq_12VDQ_yLUkGIo2";


// ======================================================
// LOAD SUPABASE LIBRARY AUTOMATICALLY
// ======================================================

function loadSupabase() {
  return new Promise((resolve, reject) => {

    if (window.supabase) {
      resolve(window.supabase);
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

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


// ======================================================
// ELEMENTS
// ======================================================

const portfolio =
  document.getElementById("portfolio");

const filters =
  document.querySelectorAll(".filter");


// ======================================================
// MOBILE MENU
// ======================================================

const menu =
  document.querySelector(".menu");

const nav =
  document.querySelector(".nav nav");

if (menu && nav) {

  menu.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

}


// ======================================================
// HTML ESCAPE
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
// SCROLL REVEAL
// ======================================================

function startReveal() {

  const items =
    document.querySelectorAll(".reveal");

  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {

    items.forEach(item => {
      item.classList.add("show");
    });

    return;
  }

  const observer =
    new IntersectionObserver(
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


// ======================================================
// LOAD PORTFOLIO
// ======================================================

async function loadPortfolio(category = "all") {

  if (!portfolio) {
    console.error(
      "STJ MEDIA: #portfolio not found."
    );
    return;
  }

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
    // CONNECT TO SUPABASE
    // --------------------------------------------------

    const supabaseLibrary =
      await loadSupabase();

    const supabaseClient =
      supabaseLibrary.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );


    // --------------------------------------------------
    // GET PORTFOLIO DATA
    // --------------------------------------------------

    const {
      data,
      error
    } = await supabaseClient
      .from("portfolio")
      .select(
        "id,title,category,description,media_url,media_type,created_at"
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      );


    // --------------------------------------------------
    // SUPABASE ERROR
    // --------------------------------------------------

    if (error) {

      console.error(
        "STJ MEDIA SUPABASE ERROR:",
        error
      );

      throw error;
    }


    let works =
      Array.isArray(data)
        ? data
        : [];


    // --------------------------------------------------
    // CATEGORY FILTER
    // --------------------------------------------------

    if (category !== "all") {

      const selectedCategory =
        String(category).toLowerCase();

      works =
        works.filter(item => {

          return String(
            item.category || ""
          ).toLowerCase() ===
          selectedCategory;

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
    // CREATE PORTFOLIO CARDS
    // --------------------------------------------------

    portfolio.innerHTML =
      works.map(item => {

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
              onerror="this.style.display='none';"
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


    // --------------------------------------------------
    // REVEAL
    // --------------------------------------------------

    startReveal();


    console.log(
      "STJ MEDIA: Portfolio loaded successfully.",
      works
    );

  }

  catch (error) {

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

  button.addEventListener(
    "click",
    () => {

      filters.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      const category =
        button.getAttribute(
          "data-filter"
        ) || "all";

      loadPortfolio(category);

    }
  );

});


// ======================================================
// INITIAL LOAD
// ======================================================

loadPortfolio("all");
