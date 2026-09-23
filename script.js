// ======================================================
// STJ MEDIA — PUBLIC WEBSITE SCRIPT
// Portfolio + Dynamic Team
// ======================================================

const SUPABASE_URL =
  "https://acuszwigwpfrumkhtdeh.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_nXq7buM0ASGpEvRq_12VDQ_yLUkGIo2";

// ======================================================
// SUPABASE CLIENT
// ======================================================

let supabaseClientPromise = null;

function getSupabaseClient() {
  if (supabaseClientPromise) {
    return supabaseClientPromise;
  }

  supabaseClientPromise = new Promise((resolve, reject) => {
    if (window.supabase) {
      resolve(
        window.supabase.createClient(
          SUPABASE_URL,
          SUPABASE_KEY
        )
      );
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

    script.onload = () => {
      if (!window.supabase) {
        reject(
          new Error("Supabase library not available.")
        );
        return;
      }

      resolve(
        window.supabase.createClient(
          SUPABASE_URL,
          SUPABASE_KEY
        )
      );
    };

    script.onerror = () => {
      reject(
        new Error(
          "Supabase library could not load."
        )
      );
    };

    document.head.appendChild(script);
  });

  return supabaseClientPromise;
}

// ======================================================
// ELEMENTS
// ======================================================

const portfolio =
  document.getElementById("portfolio");

const teamGrid =
  document.getElementById("team-grid");

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
// SAFE URL
// ======================================================

function safeURL(value) {
  const valueString =
    String(value || "").trim();

  if (!valueString) {
    return "";
  }

  try {
    const url =
      new URL(valueString);

    if (
      url.protocol === "http:" ||
      url.protocol === "https:"
    ) {
      return escapeHTML(url.href);
    }

    return "";
  } catch {
    return "";
  }
}

// ======================================================
// SCROLL REVEAL
// ======================================================

function startReveal() {
  const items =
    document.querySelectorAll(".reveal");

  if (!items.length) {
    return;
  }

  if (
    !("IntersectionObserver" in window)
  ) {
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
            entry.target.classList.add(
              "show"
            );

            observer.unobserve(
              entry.target
            );
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

async function loadPortfolio(
  category = "all"
) {
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
    const supabase =
      await getSupabaseClient();

    const {
      data,
      error
    } = await supabase
      .from("portfolio")
      .select(`
        id,
        title,
        category,
        description,
        media_url,
        media_type,
        created_at
      `)
      .order(
        "created_at",
        {
          ascending: false
        }
      );

    if (error) {
      console.error(
        "STJ MEDIA PORTFOLIO ERROR:",
        error
      );

      throw error;
    }

    let works =
      Array.isArray(data)
        ? data
        : [];

    // CATEGORY FILTER
    if (category !== "all") {
      const selectedCategory =
        String(category)
          .toLowerCase();

      works =
        works.filter(item => {
          return (
            String(
              item.category || ""
            ).toLowerCase() ===
            selectedCategory
          );
        });
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

    // RENDER WORK
    portfolio.innerHTML =
      works
        .map(item => {

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
            safeURL(
              item.media_url
            );

          let mediaHTML = "";

          // VIDEO
          if (
            String(
              item.media_type || ""
            ).toLowerCase() ===
            "video"
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
                  background:#111;
                "
              ></video>
            `;

          } else {

            // IMAGE
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
                onerror="
                  this.style.display='none';
                "
              >
            `;
          }

          return `
            <article
              class="portfolio-card reveal show"
            >

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
        })
        .join("");

    startReveal();

    console.log(
      "STJ MEDIA: Portfolio loaded.",
      works
    );

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
// LOAD TEAM
// ======================================================

async function loadTeam() {

  if (!teamGrid) {
    console.warn(
      "STJ MEDIA: #team-grid not found."
    );

    return;
  }

  teamGrid.innerHTML = `
    <div style="
      grid-column:1/-1;
      padding:40px;
      text-align:center;
      color:#888;
    ">
      Loading team...
    </div>
  `;

  try {

    const supabase =
      await getSupabaseClient();

    const {
      data,
      error
    } = await supabase
      .from("team_members")
      .select(`
        id,
        name,
        photo_url,
        role,
        work,
        skills,
        instagram_url,
        linkedin_url,
        display_order,
        created_at
      `)
      .eq(
        "status",
        "live"
      )
      .order(
        "display_order",
        {
          ascending: true
        }
      )
      .order(
        "created_at",
        {
          ascending: true
        }
      );

    if (error) {

      console.error(
        "STJ MEDIA TEAM ERROR:",
        error
      );

      throw error;
    }

    const members =
      Array.isArray(data)
        ? data
        : [];

    // NO TEAM MEMBERS
    if (!members.length) {

      teamGrid.innerHTML = `
        <div style="
          grid-column:1/-1;
          padding:50px;
          text-align:center;
          color:#888;
        ">
          Team members will appear here.
        </div>
      `;

      return;
    }

    // RENDER TEAM
    teamGrid.innerHTML =
      members
        .map((member, index) => {

          const name =
            escapeHTML(
              member.name ||
              "STJ Team"
            );

          const role =
            escapeHTML(
              member.role ||
              ""
            );

          const work =
            escapeHTML(
              member.work ||
              ""
            );

          const skills =
            escapeHTML(
              member.skills ||
              ""
            );

          const photoURL =
            safeURL(
              member.photo_url
            );

          const instagram =
            safeURL(
              member.instagram_url
            );

          const linkedin =
            safeURL(
              member.linkedin_url
            );

          const firstLetter =
            escapeHTML(
              (
                member.name ||
                "S"
              )
                .trim()
                .charAt(0)
                .toUpperCase()
            );

          let photoHTML = "";

          if (photoURL) {

            photoHTML = `
              <img
                src="${photoURL}"
                alt="${name}"
                loading="lazy"
                style="
                  width:100%;
                  height:100%;
                  object-fit:cover;
                  display:block;
                "
                onerror="
                  this.style.display='none';
                  this.nextElementSibling.style.display='flex';
                "
              >

              <span
                style="
                  display:none;
                  width:100%;
                  height:100%;
                  align-items:center;
                  justify-content:center;
                  font-size:48px;
                  font-weight:700;
                "
              >
                ${firstLetter}
              </span>
            `;

          } else {

            photoHTML = `
              <span
                style="
                  display:flex;
                  width:100%;
                  height:100%;
                  align-items:center;
                  justify-content:center;
                  font-size:48px;
                  font-weight:700;
                "
              >
                ${firstLetter}
              </span>
            `;
          }

          let socialHTML = "";

          if (
            instagram ||
            linkedin
          ) {

            socialHTML = `
              <div style="
                display:flex;
                gap:12px;
                margin-top:14px;
              ">

                ${
                  instagram
                    ? `
                      <a
                        href="${instagram}"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="
                          text-decoration:none;
                        "
                      >
                        Instagram ↗
                      </a>
                    `
                    : ""
                }

                ${
                  linkedin
                    ? `
                      <a
                        href="${linkedin}"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="
                          text-decoration:none;
                        "
                      >
                        LinkedIn ↗
                      </a>
                    `
                    : ""
                }

              </div>
            `;
          }

          return `
            <article
              class="team reveal"
            >

              <div
                class="team-photo"
                style="
                  overflow:hidden;
                  position:relative;
                "
              >
                ${photoHTML}
              </div>

              <div>

                <small>
                  ${String(
                    index + 1
                  ).padStart(2, "0")}
                </small>

                <h3>
                  ${name}
                </h3>

                ${
                  role
                    ? `
                      <p>
                        ${role}
                      </p>
                    `
                    : ""
                }

                ${
                  work
                    ? `
                      <p style="
                        margin-top:8px;
                        color:#888;
                      ">
                        ${work}
                      </p>
                    `
                    : ""
                }

                ${
                  skills
                    ? `
                      <p style="
                        margin-top:8px;
                        color:#888;
                        font-size:13px;
                      ">
                        ${skills}
                      </p>
                    `
                    : ""
                }

                ${socialHTML}

              </div>

            </article>
          `;
        })
        .join("");

    startReveal();

    console.log(
      "STJ MEDIA: Team loaded.",
      members
    );

  } catch (error) {

    console.error(
      "STJ MEDIA TEAM ERROR:",
      error
    );

    teamGrid.innerHTML = `
      <div style="
        grid-column:1/-1;
        padding:40px;
        text-align:center;
        color:#ff7777;
      ">
        Team load nahi ho pa raha.
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
        btn.classList.remove(
          "active"
        );
      });

      button.classList.add(
        "active"
      );

      const category =
        button.getAttribute(
          "data-filter"
        ) || "all";

      loadPortfolio(
        category
      );
    }
  );

});

// ======================================================
// INITIAL LOAD
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadPortfolio("all");

    loadTeam();

  }
);
