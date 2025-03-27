'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

//
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(i => i.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// console.log(document.documentElement);
const head = document.querySelector('body');
// console.log(document.body);
const allButtons = document.getElementById('button');
const btns = document.getElementsByClassName('btn');
const s1Coords = section1.getBoundingClientRect();

///////////////// SCROLLING FUNCTIONS
btnScrollTo.addEventListener('click', function (e) {
  const targetCoords = e.target.getBoundingClientRect();
  // console.log('CURRENT X AND Y OFFSET', window.scrollX, window.scrollY);

  // Scrolling
  // window.scrollTo(
  //   s1Coords.left + window.scrollX,
  //   s1Coords.top + window.scrollY
  // );
  /*window.scrollTo({
    left: s1Coords.left + window.scrollX,
    top: s1Coords.top + window.scrollY,
    behavior: 'smooth',
  });*/
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////
// PAGE NAVIGATION

/*
const navs = document.querySelectorAll('.nav__link');

navs.forEach(links =>
  links.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  })
);
*/

////////////////////////////
// 1. Add Event listener to common parent
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  const handler = e.target;
  if (handler.classList.contains('nav__link')) {
    const id = handler.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//
// Tabbed Function
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  // Guard Clause
  if (!clicked) return;

  // Removing classes
  tabs.forEach(a => a.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => {
    c.classList.remove('operations__content--active');
  });

  //Chaning Tabs
  clicked.classList.add('operations__tab--active');

  // Changing content
  const content = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );
  content.classList.add('operations__content--active');
});

// STICKY NAVIGATION
// window.addEventListener('scroll', function () {
//   if (window.scrollY > s1Coords.top) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });
// Sticky navigation: Intersection Observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOption = {
//   root: null,
//   threshold: [0.1, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOption);

const header = document.querySelector('.header');

const stickyNav = entries => {
  const [entry] = entries;
  if (entry.isIntersecting === false) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObs = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: [0],
  rootMargin: '-90px',
});
headerObs.observe(header);

// Animation
const allSection = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting === true) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// ////////////// Lazy Loading
const imgTarget = document.querySelectorAll('img[data-src]');
const loading = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imageObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0.1,
  // rootMargin: '-200px',
});

imgTarget.forEach(img => imageObserver.observe(img));

/////////////////// SLIDER PROP
const slides = document.querySelectorAll('.slide');

const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dots = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

const createDots = () => {
  slides.forEach((s, i) => {
    dots.insertAdjacentHTML(
      'beforeEnd',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activeDot = slide => {
  document
    .querySelectorAll('.dots__dot')
    .forEach(d => d.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
const init = () => {
  createDots();
  activeDot(0);
};

init();

const slider = document.querySelector('.slider');
// slider.style.transform = `translateX(-800px)`;
// slider.style.overflow = 'visible';
slides.forEach((s, i) => (s.style.transform = `translateX(${i * 100}%)`));

const goToNextSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
  );
};

//Next Slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToNextSlide(curSlide);
  activeDot(curSlide);
};
btnRight.addEventListener('click', nextSlide);

// Previous Slide
const previousSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToNextSlide(curSlide);
  activeDot(curSlide);
};
btnLeft.addEventListener('click', previousSlide);
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') previousSlide();
  if (e.key === 'ArrowRight') nextSlide();
});
//
dots.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToNextSlide(slide);
    activeDot(slide);
  }
});
// const alertH1 = function () {
//   alert('addEventlistener: Great!');

// h1.removeEventListener('mouseenter', alertH1);
// };
// const h1 = document.querySelector('h1');
// h1.addEventListener('mouseenter', alertH1);
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 50000);

// h1.onmouseenter = function () {
//   alert('addEventlistener: Great!');
// };
/*
// Creating and Inserting HTML elements
// .insertAdjacentHTML
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent =
//   'We use cookie for improved functionalities and analytics';
message.innerHTML =
  'We use cookie for improved functionalities and analytics. <button class="btn btn--close-cookie">Got it!</button>';
head.append(message);
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });
// styles
message.style.backgroundColor = '#37383d';
message.style.width = '100%';
console.log(getComputedStyle(message));

// Attributes
const logo = document.querySelector('nav__logo');
console.log(logo.scr);
console.log(logo.className);

//
console.log(logo.getAttribute('src'));

//
logo.classList.add();
logo.classList.remove();
logo.classList.toggle();
logo.classList.contains();

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
console.log(randomColor());


// for (let i = 0; i < navs.length; i++)
//   navs[i].addEventListener('mouseenter', function (e) {
//     console.log('LINK');
//     this.style.backgroundColor = randomColor();
//     e.stopPropagation();
//   });

navs.forEach(links =>
  links.addEventListener('mouseenter', function (e) {
    console.log('LINK');
    this.style.backgroundColor = randomColor();
    e.stopPropagation();
  })
);

document.querySelector('.nav__links').addEventListener('click', function () {
  console.log('LINK');
  this.style.backgroundColor = randomColor();
});

document.querySelector('.nav').addEventListener('click', function () {
  console.log('LINK');
  this.style.backgroundColor = randomColor();
});
*/

const h1 = document.querySelector('h1');

// Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
h1.firstElementChild.style.color = 'purple';

// Going Upwards: parent
// console.log(h1.parentElement);
// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// Going Sideways: siblngs
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// [...h1.parentElement.children].forEach(el => {
//   if (el !== h1) {
//     el.style.transform = 'scale(0.5)';
//   }
// });
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log(`HTML oarsed and DOM tree vuilt!`);
// });
// window.addEventListener('load', function (e) {
//   console.log(`Page fully loaded!`, e);
// });
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(`Page fully loaded!`, e);
//   e.preventDefault() = '';
// });
