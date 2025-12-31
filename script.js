const sidebar = document.querySelector('.sidebar');
const hamburger = document.querySelector('.hamburger');
const close = document.querySelector('.close');
const aside_links = document.querySelectorAll('.aside__link')

hamburger.addEventListener('click', () => {
  sidebar.classList.remove('hide');
});

// Close sidebar
close.addEventListener('click', () => {
  sidebar.classList.add('hide');
});

aside_links.forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.add('hide');
  });
});


const modal = document.getElementById('videoModal');
const openBtn = document.querySelector('.about__button');
const closeBtn = document.getElementById('closeModal');
const player = document.getElementById('ytPlayer');

const YT_URL = "https://www.youtube.com/embed/PE1k3TdwK7Y";

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


// Select all sections and nav links
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav__link");

// Intersection Observer options
const options = {
  root: null,       // viewport
  threshold: 0.5    // 50% of section visible
};

// Callback for Intersection Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute("id");
    const navLink = document.querySelector(`.nav__link[href="#${id}"]`);

    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove("active"));
      navLink.classList.add("active");                           
    }
  });
}, options);

// Observe each section
sections.forEach(section => observer.observe(section));
