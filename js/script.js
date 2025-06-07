/* jshint esversion: 6 */

const body = document.body;
const darkToggle = document.createElement('button');
darkToggle.id = "darkModeToggle";
darkToggle.innerHTML = "🌙 Dark Mode";
document.querySelector('header').appendChild(darkToggle);

function setDarkMode(on) {
  body.classList.toggle('dark-mode', on);
  darkToggle.classList.toggle('active', on);
  darkToggle.innerHTML = on ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem('bali_darkmode', on ? "yes" : "no");
}
darkToggle.addEventListener('click', () => {
  setDarkMode(!body.classList.contains('dark-mode'));
});

if (localStorage.getItem('bali_darkmode') === "yes") setDarkMode(true);

const scrollBtn = document.createElement('button');
scrollBtn.id = "scrollToTopBtn";
scrollBtn.title = "Back to Top";
scrollBtn.innerHTML = "⬆️";
document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 200) scrollBtn.classList.add('show');
  else scrollBtn.classList.remove('show');
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function setupAccordion() {
  document.querySelectorAll('.accordion-header').forEach((header, idx) => {
    const body = header.nextElementSibling;
    const panelId = 'accordion-panel-' + idx;
    if (body) {
      body.id = panelId;
      body.setAttribute('role', 'region');
      body.setAttribute('aria-labelledby', 'accordion-header-' + idx);
      body.style.display = 'none';
    }
    header.id = 'accordion-header-' + idx;
    header.setAttribute('aria-controls', panelId);
    header.setAttribute('aria-expanded', 'false');
    header.addEventListener('click', function() {
      const isOpen = header.classList.contains('open');
      header.classList.toggle('open');
      if (body) {
        body.style.display = isOpen ? 'none' : 'block';
        header.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      }
    });
    header.setAttribute('tabindex', 0);
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') header.click();
    });
  });
}

document.addEventListener('DOMContentLoaded', setupAccordion);

function confettiBurst() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.pointerEvents = 'none';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const colors = ['#8cb49c','#ffbe76','#e1af50','#ff5eae','#04f0f0','#ab8767'];
  const confetti = Array.from({length: 75}, (_,i)=>({
    x: Math.random()*canvas.width,
    y: -20,
    r: Math.random()*8+6,
    d: Math.random()*75+15,
    color: colors[Math.floor(Math.random()*colors.length)],
    tilt: Math.random()*16-8
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confetti.forEach(c=>{
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, 2*Math.PI);
      ctx.fillStyle = c.color;
      ctx.fill();
    });
    update();
    frame++;
    if(frame < 70) requestAnimationFrame(draw);
    else canvas.remove();
  }
  function update() {
    confetti.forEach(c=>{
      c.y += 5 + Math.random()*2;
      c.x += Math.sin(frame/7 + c.d) * 2;
    });
  }
  draw();
}

function setupChecklist() {
  const checklist = document.querySelector('.checklist');
  if (!checklist) return;
  let state = {};
  try { state = JSON.parse(localStorage.getItem('bali_checklist') || '{}'); } catch (e) {}
  Array.from(checklist.children).forEach((li, i) => {
    const cb = li.querySelector('input[type=checkbox]');
    if (!cb) return;
    cb.checked = !!state[i];
    li.classList.toggle('checked', cb.checked);
    cb.addEventListener('change', () => {
      li.classList.toggle('checked', cb.checked);
      state[i] = cb.checked;
      localStorage.setItem('bali_checklist', JSON.stringify(state));
     
      if (
        Array.from(checklist.querySelectorAll('input[type=checkbox]')).every(box => box.checked)
        && checklist.childElementCount > 0
      ) {
        confettiBurst();
        setTimeout(() => alert("🎉 All set! You're ready for Bali!"), 350);
      }
    });
    if (!cb.id) cb.id = "cb"+i;
    li.setAttribute('for', cb.id);
  });
}
setupChecklist();

function setupPackingList() {
  document.querySelectorAll('.packing-list li').forEach(li => {
    li.addEventListener('click', () => {
      li.classList.toggle('checked');
      
      if (li.classList.contains('checked')) {
        li.innerHTML += " ✅";
        setTimeout(() => {
          li.innerHTML = li.innerHTML.replace(/ ✅/g, '');
        }, 1200);
      }
    });
    li.setAttribute('tabindex', 0);
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') li.click();
    });
  });
}
setupPackingList();

function setupLightbox() {
  let overlay = document.getElementById('lightboxOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'lightboxOverlay';
    overlay.innerHTML = "<img alt='Enlarged view' />";
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.style.display = 'none');
    overlay.addEventListener('keydown', e => {
      if (e.key === 'Escape') overlay.style.display = 'none';
    });
  }
  document.querySelectorAll('.card img, img.lightbox').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', e => {
      e.stopPropagation();
      overlay.style.display = 'flex';
      overlay.querySelector('img').src = img.src;
      overlay.focus && overlay.focus();
    });
  });
}
setupLightbox();

function setupForms() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('input[type=email]');
    const emailVal = email.value.trim();
    const feedback = document.createElement('span');
    feedback.style.marginLeft = "12px";
    form.querySelectorAll('span').forEach(s => s.remove());
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(emailVal)) {
      feedback.style.color = "crimson";
      feedback.textContent = "Please enter a valid email.";
      email.after(feedback);
      email.focus();
      return;
    }
    feedback.style.color = "#8cb49c";
    feedback.textContent = "Subscribed! Terima kasih 🙏";
    email.after(feedback);
    setTimeout(() => feedback.remove(), 3000);
    form.reset();
  });
}
setupForms();

function typewriterFact(fact, el) {
  el.textContent = "";
  let i = 0;
  function type() {
    el.textContent += fact[i];
    i++;
    if (i < fact.length) setTimeout(type, 28 + Math.random()*44);
  }
  type();
}

function randomBaliFact() {
  const facts = [
    "Bali has over 20,000 temples—there’s a ceremony almost every day.",
    "The Balinese New Year (Nyepi) is a Day of Silence—no travel, work, or fire!",
    "Bali is the only Hindu-majority island in Indonesia.",
    "You can find coffee luwak—made with beans digested by civet cats—in Bali.",
    "Mount Agung is Bali’s highest point and considered the spiritual center.",
    "The word 'Om Swastiastu' is a traditional Balinese greeting meaning 'May you be blessed'.",
    "Bali has nine directional temples to protect the island from evil spirits.",
    "Balinese offerings (canang sari) are made daily to appease the gods and demons."
  ];
  const factEl = document.querySelector('.fun-fact p');
  if (factEl) {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    typewriterFact(fact, factEl);
  }
}
randomBaliFact();

function setupResponsiveNav() {
  const nav = document.querySelector('nav ul');
  if (!nav) return;
  if (window.innerWidth < 700 && !document.getElementById('hamburgerBtn')) {
    const btn = document.createElement('button');
    btn.id = 'hamburgerBtn';
    btn.setAttribute('aria-label', 'Open menu');
    btn.innerHTML = "☰";
    btn.style.position = 'absolute';
    btn.style.top = '1.1rem';
    btn.style.left = '1.3rem';
    btn.style.background = "#8cb49c";
    btn.style.color = "#fff";
    btn.style.fontSize = "1.45rem";
    btn.style.border = "none";
    btn.style.borderRadius = "7px";
    btn.style.cursor = "pointer";
    btn.style.padding = "4px 12px";
    btn.style.zIndex = 200;
    btn.onclick = () => nav.classList.toggle('open');
    nav.parentNode.insertBefore(btn, nav);
    nav.style.display = 'none';
    btn.addEventListener('click', () => {
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
  }
}
setupResponsiveNav();
window.addEventListener('resize', setupResponsiveNav);

window.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = 0;
  setTimeout(() => {
    document.body.style.transition = "opacity 1.3s cubic-bezier(.51,.26,.48,.96)";
    document.body.style.opacity = 1;
    document.querySelectorAll('main > section, main > div').forEach((el, i) => {
      el.style.opacity = 0;
      el.style.transform = "translateY(48px)";
      setTimeout(() => {
        el.style.transition = "opacity 1s, transform 0.9s";
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
      }, 550 + 120 * i);
    });
  }, 40);
});

window.baliInit = function() {
  setupAccordion();
  setupChecklist();
  setupPackingList();
  setupLightbox();
  setupForms();
  setupResponsiveNav();
  randomBaliFact();
};
