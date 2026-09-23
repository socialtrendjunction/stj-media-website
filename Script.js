const SUPABASE_URL = "https://acuszwigwpfrumkhtdeh.supabase.co";
const SUPABASE_KEY = "sb_publishable_nXq7buM0ASGpEvRq_12VDQ_yLUkGIo2";

const portfolio = document.getElementById("portfolio");
const filters = document.querySelectorAll(".filter");


// SUPABASE CLIENT
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// MOBILE MENU
const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav nav");

if (menu && nav) {
  menu.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}


// SCROLL REVEAL
function setupReveal() {

  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(item => item.classList.add("show"));
    return;
  }

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
}


// HTML ESCAPE
function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// LOAD PORTFOLIO
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

    const { data, error } = await supabaseClient
      .from("portfolio")
      .select("id,title,category,description,media_url,media_type,created_at")
      .order("created_at", { ascending: false });


    if (error) {
      console.error("Supabase portfolio error:", error);
      throw error;
    }


    console.log("STJ Portfolio:", data);


    let works = data || [];


    // CATEGORY FILTER
    if (category !== "all") {

      works = works.filter(item =>
        String(item.category || "").toLowerCase() ===
        String(category).toLowerCase()
      );

    }


    // NO WORK
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


    // CREATE WORK CARDS
    portfolio.innerHTML = works.map(item => {

      let media = "";


      // VIDEO
      if (
        String(item.media_type || "").toLowerCase() === "video"
      ) {

        media = `
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

        media = `
          <img
            src="${escapeHTML(item.media_url)}"
            alt="${escapeHTML(item.title || "STJ Media Work")}"
            loading="lazy"
            style="
              width:100%;
              height:100%;
              object-fit:cover;
              display:block;
            "
            onerror="this.style.display='none';"
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

            ${media}

          </div>

          <div style="padding:18px 4px;">

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


    setupReveal();


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


// FILTER BUTTONS
filters.forEach(button => {

  button.addEventListener("click", () => {

    filters.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    loadPortfolio(
      button.dataset.filter || "all"
    );

  });

});


// INITIAL LOAD
loadPortfolio("all");
