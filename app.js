/* ─ Pet data ─ */
const PETS = [
  {
    id: 'buddy', name: 'Buddy', breed: 'Golden Retriever', type: 'dog', size: 'large',
    age: '2 years', weight: '28 kg', gender: 'Male', img: 'assets/buddy.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Friendly', 'Active', 'Good with kids', 'House-trained'],
    tempTags: ['Gentle', 'Playful', 'Loyal'],
    desc: 'A gentle and loving companion who enjoys outdoor walks and cuddles. Great with kids and other pets. Buddy is housebroken and responds well to basic commands. He loves playing fetch and swimming.',
    urgent: false
  },
  {
    id: 'luna', name: 'Luna', breed: 'Tabby Cat', type: 'cat', size: 'small',
    age: '1 year', weight: '3.2 kg', gender: 'Female', img: 'assets/luna.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Calm', 'Indoor', 'Good with adults'],
    tempTags: ['Curious', 'Independent', 'Affectionate'],
    desc: 'Luna is a curious and playful tabby who loves sunny window spots and interactive toys. She is gentle, quiet and low-maintenance — perfect for apartment living.',
    urgent: false
  },
  {
    id: 'max', name: 'Max', breed: 'Black Labrador', type: 'dog', size: 'large',
    age: '3 years', weight: '32 kg', gender: 'Male', img: 'assets/max.jpg',
    status: 'Urgent', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Energetic', 'Loyal', 'Needs space'],
    tempTags: ['Brave', 'Playful', 'Protective'],
    desc: 'Max is a healthy, energetic Labrador who needs an active family with a yard. He is fully trained and loves to swim. Currently in urgent need of a home.',
    urgent: true
  },
  {
    id: 'bella', name: 'Bella', breed: 'Persian Cat', type: 'cat', size: 'small',
    age: '4 years', weight: '4 kg', gender: 'Female', img: 'assets/bella.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Calm', 'Fluffy', 'Indoor'],
    tempTags: ['Regal', 'Gentle', 'Quiet'],
    desc: 'Bella is a gorgeous white Persian with piercing blue eyes. She loves quiet homes and will reward you with head-bumps and purrs. Requires regular grooming.',
    urgent: false
  },
  {
    id: 'charlie', name: 'Charlie', breed: 'Beagle', type: 'dog', size: 'medium',
    age: '1.5 years', weight: '12 kg', gender: 'Male', img: 'assets/charlie.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'No',
    tags: ['Scent hound', 'Playful', 'Family pet'],
    tempTags: ['Sociable', 'Happy-go-lucky', 'Inquisitive'],
    desc: 'Charlie is a joyful Beagle with a wonderful personality. He gets along with everyone — kids, dogs and cats. He thrives with regular walks and playtime.',
    urgent: false
  }
];

let currentPet = null;
let currentFilter = 'all';
let selectedDate = null;
let visitorCount = 1;
let currentStep = 1;
let heartedPets = new Set();

/* ──────────────────────
   SCREEN NAVIGATION
────────────────────── */
function goScreen(id) {
  const prev = document.querySelector('.screen.active');
  const next = document.getElementById(id);
  if (!next || prev === next) return;

  if (prev) {
    prev.classList.remove('active');
    prev.classList.add('slide-out');
    setTimeout(() => prev.classList.remove('slide-out'), 350);
  }
  next.classList.add('active');

  // Scroll to top
  next.scrollTo({ top: 0 });

  // Bottom nav active state
  updateNav(id);
}

function updateNav(screenId) {
  const navMap = {
    'screen-home': 0,
    'screen-browse': 1,
    'screen-journey': 2,
    'screen-profile': 3
  };
  const idx = navMap[screenId];
  document.querySelectorAll('.bottom-nav').forEach(nav => {
    nav.querySelectorAll('.nav-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === idx);
    });
  });
}

/* ──────────────────────
   BROWSE & FILTER
────────────────────── */
function renderPetGrid(filter = 'all') {
  const grid = document.getElementById('pet-grid');
  const filtered = filter === 'all' ? PETS : PETS.filter(p => {
    if (filter === 'dog') return p.type === 'dog';
    if (filter === 'cat') return p.type === 'cat';
    if (filter === 'small') return p.size === 'small' || p.type === 'cat';
    return true;
  });

  grid.innerHTML = filtered.map(p => `
    <div class="pet-grid-card" onclick="viewPet('${p.id}')">
      <div style="position:relative">
        <img src="${p.img}" alt="${p.name}" class="pgc-img" />
        <button class="heart-btn ${heartedPets.has(p.id) ? 'liked' : ''}" 
          onclick="event.stopPropagation();toggleHeart('${p.id}')" 
          id="heart-${p.id}-grid">
          ${heartedPets.has(p.id) ? '♥' : '♡'}
        </button>
        <div class="pet-badge ${p.urgent ? 'urgent' : ''}">${p.status}</div>
      </div>
      <div class="pgc-info">
        <div class="pgc-name">${p.name}</div>
        <div class="pgc-meta">${p.type === 'dog' ? '🐶' : '🐱'} ${p.breed} · ${p.age}</div>
        <div class="pgc-badge-row">
          ${p.tags.slice(0,2).map(t => `<span class="pgc-badge">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function setFilter(btn, filter) {
  currentFilter = filter;
  document.querySelectorAll('.browse-filters .chip').forEach(c => c.classList.remove('chip-active'));
  btn.classList.add('chip-active');
  renderPetGrid(filter);
}

function filterAndBrowse(filter) {
  currentFilter = filter;
  // Update chip on browse screen
  document.querySelectorAll('.browse-filters .chip').forEach(c => {
    c.classList.toggle('chip-active', c.dataset.filter === filter);
  });
  renderPetGrid(filter);
  goScreen('screen-browse');
}

/* ──────────────────────
   PET DETAIL
────────────────────── */
function viewPet(petId) {
  const pet = PETS.find(p => p.id === petId);
  if (!pet) return;
  currentPet = petId;

  document.getElementById('detail-img').src = pet.img;
  document.getElementById('detail-img').alt = pet.name;
  document.getElementById('gallery-img-main').src = pet.img;
  document.getElementById('detail-name').textContent = pet.name;
  document.getElementById('detail-sub').textContent = `${pet.breed} · ${pet.gender} · ${pet.age}`;
  document.getElementById('detail-status').textContent = pet.status;
  document.getElementById('detail-status').style.background = pet.urgent ? '#fde8e8' : '';
  document.getElementById('detail-status').style.color = pet.urgent ? '#E74C3C' : '';
  document.getElementById('qs-age').textContent = pet.age;
  document.getElementById('qs-weight').textContent = pet.weight;
  document.getElementById('qs-vaccinated').textContent = pet.vaccinated;
  document.getElementById('qs-neutered').textContent = pet.neutered;
  document.getElementById('detail-desc').textContent = pet.desc;
  document.getElementById('mr-neuter').textContent = pet.neutered === 'Yes' ? 'Neutered/Spayed — Jan 2024' : 'Not yet neutered';

  // Tags
  document.getElementById('detail-tags').innerHTML = pet.tags.map(t => `<span class="detail-tag">${t}</span>`).join('');
  document.getElementById('detail-tags-temp').innerHTML = pet.tempTags.map(t => `<span class="detail-tag">${t}</span>`).join('');

  // Heart state
  const heartBtn = document.getElementById('detail-heart');
  heartBtn.textContent = heartedPets.has(petId) ? '♥' : '♡';
  heartBtn.classList.toggle('liked', heartedPets.has(petId));

  // Reset tabs
  switchTab('about');

  goScreen('screen-pet-detail');
}

function switchTab(tab) {
  ['about', 'medical', 'gallery'].forEach(t => {
    document.getElementById(`tab-${t}`).classList.toggle('hidden', t !== tab);
  });
  document.querySelectorAll('.dtab').forEach((btn, i) => {
    btn.classList.toggle('active', ['about','medical','gallery'][i] === tab);
  });
}

/* ──────────────────────
   HEARTS / WISHLIST
────────────────────── */
function toggleHeart(petId) {
  if (heartedPets.has(petId)) {
    heartedPets.delete(petId);
  } else {
    heartedPets.add(petId);
  }

  // Update home cards
  const homeHeart = document.getElementById(`heart-${petId}`);
  if (homeHeart) {
    homeHeart.textContent = heartedPets.has(petId) ? '♥' : '♡';
    homeHeart.classList.toggle('liked', heartedPets.has(petId));
  }
  // Update grid cards
  const gridHeart = document.getElementById(`heart-${petId}-grid`);
  if (gridHeart) {
    gridHeart.textContent = heartedPets.has(petId) ? '♥' : '♡';
    gridHeart.classList.toggle('liked', heartedPets.has(petId));
  }
  // Update detail
  const detailHeart = document.getElementById('detail-heart');
  if (detailHeart && currentPet === petId) {
    detailHeart.textContent = heartedPets.has(petId) ? '♥' : '♡';
    detailHeart.classList.toggle('liked', heartedPets.has(petId));
  }

  showToast(heartedPets.has(petId) ? `${petId.charAt(0).toUpperCase()+petId.slice(1)} saved to wishlist ❤️` : 'Removed from wishlist');
}

/* ──────────────────────
   CALENDAR
────────────────────── */
function renderCalendar(containerId, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  function draw() {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    let html = `
      <div class="cal-header">
        <button class="cal-nav" onclick="calPrev('${containerId}')">‹</button>
        <div class="cal-month">${monthNames[month]} ${year}</div>
        <button class="cal-nav" onclick="calNext('${containerId}')">›</button>
      </div>
      <div class="cal-days-header">${days.map(d=>`<div class="cal-day-name">${d}</div>`).join('')}</div>
      <div class="cal-days">
    `;

    for (let i = 0; i < firstDay; i++) html += `<div class="cal-day cal-empty"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isPast = date < new Date(today.setHours(0,0,0,0));
      const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
      const isSelected = selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
      let cls = 'cal-day';
      if (isPast) cls += ' cal-disabled';
      if (isToday) cls += ' cal-today';
      if (isSelected) cls += ' cal-selected';
      html += `<div class="${cls}" onclick="selectDate(${year},${month},${d},'${containerId}')">${d}</div>`;
    }

    html += '</div>';
    container.innerHTML = html;
  }

  container._draw = draw;
  container._getYM = () => ({ year, month });
  container._setYM = (y, m) => { year = y; month = m; draw(); };
  draw();
}

window.calPrev = function(id) {
  const c = document.getElementById(id);
  const { year, month } = c._getYM();
  const nm = month === 0 ? 11 : month - 1;
  const ny = month === 0 ? year - 1 : year;
  c._setYM(ny, nm);
};
window.calNext = function(id) {
  const c = document.getElementById(id);
  const { year, month } = c._getYM();
  const nm = month === 11 ? 0 : month + 1;
  const ny = month === 11 ? year + 1 : year;
  c._setYM(ny, nm);
};
window.selectDate = function(y, m, d, id) {
  selectedDate = new Date(y, m, d);
  // Redraw all calendars
  ['calendar-mini','calendar-interview','calendar-homecheck'].forEach(cid => {
    const c = document.getElementById(cid);
    if (c && c._draw) c._draw();
  });
};

/* ──────────────────────
   TIME SLOT
────────────────────── */
let selectedSlot = null;
function selectSlot(btn) {
  const parent = btn.closest('.time-slots');
  parent.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSlot = btn.textContent;
}

/* ──────────────────────
   VISITOR STEPPER
────────────────────── */
function changeVisitors(delta) {
  visitorCount = Math.max(1, Math.min(6, visitorCount + delta));
  document.getElementById('visitor-count').textContent = visitorCount;
}

/* ──────────────────────
   MULTI-STEP FORM
────────────────────── */
function nextStep(step) {
  document.getElementById(`form-step-${step}`).classList.add('hidden');
  document.getElementById(`form-step-${step + 1}`).classList.remove('hidden');

  // Update progress indicator
  document.getElementById(`fp${step}`).classList.remove('fp-active');
  document.getElementById(`fp${step}`).classList.add('fp-done');
  document.getElementById(`fp${step + 1}`).classList.add('fp-active');
  currentStep = step + 1;
}

function prevStep(step) {
  document.getElementById(`form-step-${step}`).classList.add('hidden');
  document.getElementById(`form-step-${step - 1}`).classList.remove('hidden');

  document.getElementById(`fp${step}`).classList.remove('fp-active');
  document.getElementById(`fp${step - 1}`).classList.remove('fp-done');
  document.getElementById(`fp${step - 1}`).classList.add('fp-active');
  currentStep = step - 1;
}

function selectOption(btn, groupId) {
  document.getElementById(groupId).querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

/* ──────────────────────
   DOCUMENT UPLOAD SIMULATION
────────────────────── */
function simulateUpload(doc) {
  const sub = document.getElementById(`uc-${doc}-sub`);
  const status = document.getElementById(`uc-${doc}-status`);
  const icon = document.getElementById(`uc-${doc}-icon`);
  sub.textContent = 'Uploading…';
  status.textContent = '⏳';
  setTimeout(() => {
    sub.textContent = 'Uploaded successfully';
    status.textContent = '✅';
    icon.textContent = doc === 'nric' ? '🪪' : doc === 'proof' ? '✅' : '✅';
  }, 1200);
}

/* ──────────────────────
   CONFIRMATIONS
────────────────────── */
function confirmVisit() {
  const petName = currentPet ? currentPet.charAt(0).toUpperCase() + currentPet.slice(1) : 'your pet';
  const dateStr = selectedDate ? selectedDate.toDateString() : 'your chosen date';
  const slot = selectedSlot || 'your chosen time';
  showModal('📅', 'Visit Confirmed!', `Your gallery visit to meet ${petName} is confirmed for ${dateStr} at ${slot}. A confirmation has been sent to your email.`);
}

function confirmInterview() {
  const dateStr = selectedDate ? selectedDate.toDateString() : 'your chosen date';
  const slot = selectedSlot || 'your chosen time';
  showModal('🎥', 'Interview Scheduled!', `Your virtual interview is set for ${dateStr} at ${slot}. You'll receive a link via email 1 hour before the call.`);
}

function confirmHomeCheck() {
  const dateStr = selectedDate ? selectedDate.toDateString() : 'your chosen date';
  const slot = selectedSlot || 'your chosen time';
  showModal('🏡', 'Home Visit Booked!', `Our officer will visit your home on ${dateStr} at ${slot}. You will receive an SMS reminder 24 hrs before.`);
}

function submitApplication() {
  showModal('📋', 'Application Submitted!', 'Your adoption application has been received. Our team will review it within 2–3 business days. Track your progress in My Journey.');
}

function processPayment() {
  showModal('🎉', 'Payment Successful!', 'Your adoption fee of S$205.00 has been processed. Download your adoption agreement and prepare to welcome Buddy home!');
  setTimeout(() => {
    closeModal();
    goScreen('screen-post-adoption');
  }, 2800);
}

function submitReview() {
  showModal('⭐', 'Thank You!', 'Your feedback helps us improve the adoption experience for future adopters. Welcome to the SPCA family!');
}

/* ──────────────────────
   MODAL & TOAST
────────────────────── */
function showModal(icon, title, body) {
  document.getElementById('modal-icon').textContent = icon;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent = body;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

/* ──────────────────────
   PAYMENT OPTIONS
────────────────────── */
function selectPay(el) {
  document.querySelectorAll('.pay-opt').forEach(p => p.classList.remove('pay-opt-active'));
  el.classList.add('pay-opt-active');
  const type = el.querySelector('span').textContent;
  const cardForm = document.getElementById('card-form');
  cardForm.style.display = type === 'Card' ? 'block' : 'none';
}

/* ──────────────────────
   STARS RATING
────────────────────── */
function rateStar(n) {
  for (let i = 1; i <= 5; i++) {
    document.getElementById(`s${i}`).classList.toggle('active', i <= n);
  }
}

/* ──────────────────────
   MISC
────────────────────── */
function downloadDoc(type) {
  showToast(type === 'agreement' ? '📜 Adoption Agreement downloaded!' : '🏆 Certificate downloaded!');
}
function openResource(type) {
  const labels = { feeding: '🍖 Feeding Guide opening…', training: '🎾 Training Tips opening…', vet: '🩺 Vet Finder opening…' };
  showToast(labels[type] || 'Opening…');
}

/* ──────────────────────
   INIT
────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderPetGrid('all');
  renderCalendar('calendar-mini');
  renderCalendar('calendar-interview');
  renderCalendar('calendar-homecheck');

  // Ensure home screen is active
  document.getElementById('screen-home').classList.add('active');
});
