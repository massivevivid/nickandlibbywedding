const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const addGuestButton = document.getElementById('addGuestButton');
const guestList = document.getElementById('guestList');
const rsvpForm = document.getElementById('rsvpForm');
const attendance = document.getElementById('attendance');
const mealSection = document.getElementById('mealSection');
const primaryMeal = document.getElementById('primaryMeal');
let guestCount = 0;

function mealOptions() {
  return `
    <option value="">Please choose</option>
    <option value="Steak">Steak</option>
    <option value="Chicken">Chicken</option>
    <option value="Fish">Fish</option>
  `;
}

function addGuest() {
  if (!guestList) return;
  guestCount += 1;
  const guestCard = document.createElement('div');
  guestCard.className = 'guest-card';
  guestCard.dataset.guestNumber = String(guestCount);
  guestCard.innerHTML = `
    <label>Guest ${guestCount} full name
      <input type="text" name="Guest ${guestCount} Name" class="guest-name" required>
    </label>
    <label>Guest ${guestCount} meal choice
      <select name="Guest ${guestCount} Meal Choice" class="guest-meal" required>${mealOptions()}</select>
    </label>
    <button type="button" class="remove-guest" aria-label="Remove guest ${guestCount}">Remove</button>
  `;
  guestList.appendChild(guestCard);
  guestCard.querySelector('.remove-guest').addEventListener('click', () => {
    guestCard.remove();
    buildSummary();
  });
}

function toggleMealSection() {
  if (!attendance || !mealSection || !primaryMeal) return;
  const attending = attendance.value !== 'Regretfully declines';
  mealSection.style.display = attending ? '' : 'none';
  primaryMeal.required = attending;
  guestList?.querySelectorAll('input, select').forEach(field => {
    field.required = attending;
  });
}

function buildSummary() {
  const summaryField = document.getElementById('rsvpSummary');
  if (!summaryField || !rsvpForm) return;
  const primaryName = document.getElementById('primaryName')?.value || '';
  const primaryEmail = document.getElementById('primaryEmail')?.value || '';
  const primaryPhone = document.getElementById('primaryPhone')?.value || '';
  const attendanceValue = document.getElementById('attendance')?.value || '';
  const primaryMealValue = document.getElementById('primaryMeal')?.value || 'No meal selected';
  const notes = document.getElementById('notes')?.value || '';

  const guests = [...document.querySelectorAll('.guest-card')].map((card, index) => {
    const name = card.querySelector('.guest-name')?.value || '';
    const meal = card.querySelector('.guest-meal')?.value || '';
    return `Guest ${index + 1}: ${name || 'No name'} — ${meal || 'No meal selected'}`;
  });

  summaryField.value = [
    `Primary guest: ${primaryName}`,
    `Email: ${primaryEmail}`,
    `Phone: ${primaryPhone || 'Not provided'}`,
    `Attendance: ${attendanceValue}`,
    `Primary meal choice: ${primaryMealValue}`,
    guests.length ? `Additional guests:\n${guests.join('\n')}` : 'Additional guests: None added',
    `Notes: ${notes || 'None'}`
  ].join('\n\n');
}

addGuestButton?.addEventListener('click', addGuest);
attendance?.addEventListener('change', toggleMealSection);
rsvpForm?.addEventListener('input', buildSummary);
rsvpForm?.addEventListener('submit', () => {
  buildSummary();
});
toggleMealSection();
