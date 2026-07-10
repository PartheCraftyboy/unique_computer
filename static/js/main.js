const storyTitle = document.getElementById('story-title');
const storyDesc = document.getElementById('story-desc');
const storyTags = document.getElementById('story-tags');
const storyImage = document.getElementById('story-image');
const storyBrand = document.getElementById('story-brand');
const steps = Array.from(document.querySelectorAll('.story-step'));

function updateStory(index) {
  if (!steps.length) return;

  const active = steps[index];
  if (!active) return;

  steps.forEach((step, idx) => step.classList.toggle('active', idx === index));

  if (storyTitle) storyTitle.textContent = active.dataset.title;
  if (storyDesc) storyDesc.textContent = active.dataset.desc;
  if (storyTags) {
    storyTags.innerHTML = '';
    active.dataset.tags.split('•').forEach((tag) => {
      const pill = document.createElement('span');
      pill.textContent = tag.trim();
      storyTags.appendChild(pill);
    });
  }
  if (storyImage) storyImage.src = active.dataset.image;
  if (storyBrand) storyBrand.textContent = active.dataset.brand;
}

const filterButtons = document.querySelectorAll('.filter-chip');
const catalogCards = document.querySelectorAll('[data-brand]');
const brandSections = document.querySelectorAll('[data-brand-section]');

function applyFilter(filter) {
  catalogCards.forEach((card) => {
    const cardBrand = card.getAttribute('data-brand');
    const shouldShow = filter === 'all' || cardBrand === filter;
    card.style.display = shouldShow ? '' : 'none';
  });

  brandSections.forEach((section) => {
    const sectionBrand = section.getAttribute('data-brand-section');
    const shouldShow = filter === 'all' || sectionBrand === filter;
    section.style.display = shouldShow ? '' : 'none';
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((chip) => chip.classList.remove('active'));
    button.classList.add('active');
    applyFilter(button.getAttribute('data-filter'));
  });
});

if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: '.story-shell',
    start: 'top top+=140',
    end: 'bottom bottom-=140',
    scrub: 1.4,
    pin: '.story-copy-card',
    pinSpacing: true,
    snap: {
      snapTo: 1 / Math.max(1, steps.length - 1),
      duration: { min: 0.9, max: 1.6 },
      delay: 0.3,
      ease: 'power2.out'
    }
  });

  steps.forEach((step, index) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => updateStory(index),
      onEnterBack: () => updateStory(index)
    });
  });

  gsap.from('.hero-section', { opacity: 0, y: 42, duration: 1.1, ease: 'power3.out' });
  gsap.from('.story-copy-card', { opacity: 0, x: -40, duration: 0.9, delay: 0.2, ease: 'power3.out' });
  gsap.from('.story-step', { opacity: 0, y: 28, duration: 1, stagger: 0.12, ease: 'power3.out' });
} else {
  steps.forEach((step, index) => {
    step.addEventListener('mouseenter', () => updateStory(index));
  });
  updateStory(0);
}

if (storyTitle && storyDesc) {
  updateStory(0);
}

function initImageModal() {
  const modal = document.querySelector('.image-modal');
  const modalImage = modal?.querySelector('img');
  const closeButton = modal?.querySelector('.image-modal-close');

  if (!modal || !modalImage || !closeButton) return;

  function closeModal() {
    modal.classList.remove('active');
    modalImage.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.card img').forEach((img) => {
    img.addEventListener('click', () => {
      modal.classList.add('active');
      modalImage.src = img.src;
      modalImage.alt = img.alt || 'Product image';
      document.body.style.overflow = 'hidden';
    });
  });

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

initImageModal();

applyFilter('all');