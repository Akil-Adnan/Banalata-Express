import { siteLinks, socialLinksData, castData, carouselSlides, contactInfo, youTubeLink, backgroundImages } from "./data.js";

/* ---------- Nav & Aside Link Function ---------- */
function renderLinks({ container, links, liClass = "", aClass = "", addActiveToFirst = false }) {
  if (!container) return;

  container.innerHTML = links
    .map(({ text, href }, index) => {
      const liCls = liClass ? ` class="${liClass}"` : "";
      const aCls = aClass ? ` class="${aClass}${addActiveToFirst && index === 0 ? " active" : ""}"` : "";
      return `
        <li${liCls}>
          <a${aCls} href="${href}">${text}</a>
        </li>
      `;
    })
    .join("");
}


/* ---------- Nav ---------- */
renderLinks({
  container: document.getElementById("navLinks"),
  links: siteLinks,
  aClass: "nav__link",
  addActiveToFirst: false
});

/* ---------- Aside ---------- */
renderLinks({
  container: document.getElementById("asideLinks"),
  links: siteLinks,
  liClass: "aside__link"
});



/* ---------- Social Media Handles ---------- */
function renderSocialLinks(container, links) {
  container.innerHTML = links
    .map(
      ({ href, icon }) => `
        <a href="${href}" target="_blank" rel="noopener">
          <i class="fa-brands ${icon}"></i>
        </a>`
    )
    .join("");
}

renderSocialLinks(
  document.getElementById("asideSocialLinks"),
  socialLinksData
);

renderSocialLinks(
  document.getElementById("homeSocialLinks"),
  socialLinksData
);


/* ---------- Cast Information ---------- */
const castGrid = document.getElementById("castGrid");

castGrid.innerHTML = castData
  .map(
    (cast, index) => `
      <div class="cast__card" style="--index: ${index}">
        <div class="cast__card-items">
          <h3>${cast.name}</h3>
          <img src="${cast.img}" alt="${cast.name}" />
        </div>
      </div>
    `
  )
  .join("");


/* ---------- Cast Information ---------- */
const indicatorsEl = document.getElementById("carouselIndicators");
const innerEl = document.getElementById("carouselInner");

// Render indicators
indicatorsEl.innerHTML = carouselSlides
  .map((_, i) => `
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" 
      ${i === 0 ? 'class="active" aria-current="true"' : ''} 
      aria-label="Slide ${i + 1}">
    </button>
  `)
  .join("");

// Render slides
carouselSlides.forEach((slide, i) => {
  const div = document.createElement("div");
  div.classList.add("carousel-item");
  if (i === 0) div.classList.add("active");

  const img = document.createElement("img");
  img.alt = slide.alt;
  img.classList.add("d-block", "w-100");

  // Lazy load
  if (i === 0) {
    // First slide loads immediately
    img.src = slide.src;
  } else {
    // Other slides: use data-src and let carousel JS load when shown
    img.dataset.src = slide.src;
    img.loading = "lazy"; // optional, modern browsers
  }

  div.appendChild(img);
  innerEl.appendChild(div);
});

// Optional: Preload images on slide show
const carouselEl = document.getElementById("carouselExampleIndicators");
carouselEl.addEventListener("slide.bs.carousel", (e) => {
  const nextImg = e.relatedTarget.querySelector("img");
  if (nextImg && nextImg.dataset.src && !nextImg.src) {
    nextImg.src = nextImg.dataset.src;
  }
});


/* ---------- Contact Information ---------- */
const contactEl = document.getElementById("contactInfo");

contactInfo.forEach(item => {
  const div = document.createElement("div");
  div.classList.add("footer-item");

  div.innerHTML = `
    <i class="fa-solid ${item.icon}"></i>
    <p>${item.text}</p>
  `;

  contactEl.appendChild(div);
});


/* ---------- Navigation Bar ---------- */
const sections = document.querySelectorAll("section");
const navLinksContainer = document.getElementById("navLinks");
const navLinks = navLinksContainer.querySelectorAll(".nav__link");

function updateActiveNav() {
  const scrollPos = window.scrollY + window.innerHeight / 2;
  let currentSection = null;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      currentSection = section;
    }
  });

  if (currentSection) {
    const id = currentSection.getAttribute("id");

    // Remove active only from nav links in this container
    navLinks.forEach(link => link.classList.remove("active"));

    const navLink = navLinksContainer.querySelector(`.nav__link[href="#${id}"]`);
    if (navLink) navLink.classList.add("active");
  }
}

// Scroll listener with requestAnimationFrame
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }
});

// Initial check
updateActiveNav();



/* ---------- Sidebar Open And Close Functionality ---------- */
const sidebar = document.querySelector('.sidebar');
const hamburger = document.querySelector('.hamburger');
const close = document.querySelector('.close');
const asideLinks = document.querySelectorAll('.aside__link')
const asideOverlay = document.querySelector('.aside__overlay')

hamburger.addEventListener('click', () => {
  sidebar.classList.remove('hide');
  asideOverlay.classList.remove('hidden');
});

// Close sidebar
close.addEventListener('click', () => {
  sidebar.classList.add('hide');
  asideOverlay.classList.add('hidden');
});


asideOverlay.addEventListener('click', () => {
  sidebar.classList.add('hide');
  asideOverlay.classList.add('hidden');
});

asideLinks.forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.add('hide');
    asideOverlay.classList.add('hidden');
  });
});


/* ---------- Modal Video Functionality ---------- */
const modal = document.getElementById('videoModal');
const openBtn = document.querySelector('.display__button');
const closeBtn = document.getElementById('closeModal');
const player = document.getElementById('ytPlayer');

const YT_URL = youTubeLink;

openBtn.addEventListener('click', () => {
  modal.classList.remove('hidden'); // Show modal
  player.src = YT_URL;              // Load video + autoplay
});

function closeModal() {
  modal.classList.add('hidden'); // Hide modal
  player.src = "";               // Stop video playback
}

closeBtn.addEventListener('click', closeModal);
modal.querySelector('.modal__overlay').addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


/* ---------- Modify cast card position property feature ---------- */
const cards = document.querySelectorAll('.cast__card');

cards.forEach((card, index) => {
  card.style.setProperty('--index', index);
});



/* ---------- Video on and off feature ---------- */
const videoSections = document.querySelectorAll('section');
let currentlyPlayingVideo = null;

const sectionVideoObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const backgroundVideo = entry.target.querySelector('.bg-video');
      if (!backgroundVideo) return;

      if (entry.isIntersecting) {
        // Pause any previously playing video
        if (
          currentlyPlayingVideo &&
          currentlyPlayingVideo !== backgroundVideo
        ) {
          currentlyPlayingVideo.pause();
        }

        entry.target.classList.add('is-active');
        currentlyPlayingVideo = backgroundVideo;
        backgroundVideo.play();
      } else {
        entry.target.classList.remove('is-active');
        backgroundVideo.pause();
      }
    });
  },
  {
    threshold: 0.15
  }
);

videoSections.forEach(section =>
  sectionVideoObserver.observe(section)
);


/* ---------- Background Images ---------- */
backgroundImages.forEach(bg => {
  const section = document.getElementById(bg.id);
  if (section) {
    section.style.backgroundImage = `url('${bg.url}')`;
  }
});

