/* ============ EDIT ME ============
   Everything personal lives here. Change the text, keep the quotes and commas.
   Ideas for later: swap a card for a real, specific observation about her. */
const CONFIG = {
  name: "Bindiya di",
  from: "kaihocore",
  appreciation: [
    { title: "Warm, without trying", text: "Some people just make things feel friendlier. You’re one of them." },
    { title: "Easy to be around", text: "Talking with you feels natural and comfortable, and that’s something worth appreciating." },
    { title: "Easy to trust", text: "You have a way of making conversations feel real, which is a big part of being a good friend." },
    { title: "Just a little something", text: "Made with care, no strings attached. Nothing to reply to, just enjoy it." }
  ],
  giftWish: "May this year bring you good surprises, quiet joy, and plenty of reasons to smile.",
  wishes: [
    "Hope your day is full of cake, good food and zero boring moments.",
    "May this year be kind to you, in big ways and small ones.",
    "Wishing you good surprises, easy days and the occasional random win.",
    "And may the cake be generous. That’s the most important part."
  ],
  closing: "Keep being you. There’s a whole new year waiting to surprise you. Happy Birthday!"
};
/* =================================== */

const $ = (s, r = document) => r.querySelector(s);
const scenes = [...document.querySelectorAll(".scene")];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let cur = 0;

/* fill text */
document.querySelectorAll("[data-name]").forEach(n => n.textContent = CONFIG.name);
$("#signoff").textContent = CONFIG.closing;
$("#signname").textContent = "— " + CONFIG.from;
$("#giftWish p").textContent = CONFIG.giftWish;
$("#wishes").innerHTML = "";
CONFIG.wishes.forEach((w, i) => {
  const li = document.createElement("li");
  li.textContent = w; li.style.setProperty("--i", i);
  $("#wishes").appendChild(li);
});

/* navigation */
function go(i) {
  if (i === cur || !scenes[i]) return;
  const old = scenes[cur];
  old.classList.remove("is-active"); old.classList.add("gone"); old.setAttribute("aria-hidden", "true");
  cur = i;
  const s = scenes[cur];
  s.classList.remove("gone"); s.classList.add("is-active"); s.removeAttribute("aria-hidden");
  s.scrollTop = 0;
  const h = s.querySelector("h1,h2"); h.tabIndex = -1; setTimeout(() => h.focus({ preventScroll: true }), 300);
  if (cur === 1) setTimeout(() => burst(0.5, 0.25, 60), 500);
}
scenes.forEach((s, i) => { if (i) s.setAttribute("aria-hidden", "true"); });
document.querySelectorAll("[data-next]").forEach(b => b.addEventListener("click", () => go(cur + 1)));

/* particles */
if (!reduce) {
  const p = $("#particles");
  for (let i = 0; i < 16; i++) {
    const e = document.createElement("span"), z = 6 + Math.random() * 14;
    e.className = i % 4 === 0 ? "g" : "";
    e.style.cssText = `left:${Math.random() * 100}%;width:${z}px;height:${z}px;--dx:${(Math.random() - .5) * 80}px;` +
      `animation-duration:${14 + Math.random() * 14}s;animation-delay:${-Math.random() * 20}s`;
    p.appendChild(e);
  }
}

/* stars */
const sky = $("#stars");
for (let i = 0; i < 70; i++) {
  const e = document.createElement("i"), z = Math.random() * 2.4 + .8;
  e.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${z}px;height:${z}px;--d:${2 + Math.random() * 4}s;animation-delay:${-Math.random() * 5}s`;
  sky.appendChild(e);
}
sky.appendChild(document.createElement("b"));

/* confetti (tiny, self-stopping canvas) */
const cv = $("#confetti"), cx = cv.getContext("2d");
let bits = [], raf = 0;
const colors = ["#cdb8f0", "#f7cfd8", "#d4a95a", "#fff0dc", "#b9a2e6"];
function size() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; }
addEventListener("resize", size); size();
function burst(x, y, n) {
  if (reduce) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 6;
    bits.push({ x: x * cv.width, y: y * cv.height, vx: Math.cos(a) * v * devicePixelRatio, vy: (Math.sin(a) * v - 4) * devicePixelRatio,
      w: (5 + Math.random() * 5) * devicePixelRatio, r: Math.random() * 6, vr: (Math.random() - .5) * .3,
      c: colors[i % colors.length], life: 140 + Math.random() * 60 });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}
function tick() {
  cx.clearRect(0, 0, cv.width, cv.height);
  bits = bits.filter(b => b.life-- > 0 && b.y < cv.height + 20);
  bits.forEach(b => {
    b.vy += .16 * devicePixelRatio; b.vx *= .99; b.x += b.vx; b.y += b.vy; b.r += b.vr;
    cx.save(); cx.translate(b.x, b.y); cx.rotate(b.r); cx.globalAlpha = Math.min(1, b.life / 40);
    cx.fillStyle = b.c; cx.fillRect(-b.w / 2, -b.w / 4, b.w, b.w / 2); cx.restore();
  });
  raf = bits.length ? requestAnimationFrame(tick) : 0;
  if (!raf) cx.clearRect(0, 0, cv.width, cv.height);
}

/* cake */
$("#blow").addEventListener("click", e => {
  $("#cake").classList.add("out");
  $("#wishline").textContent = "Wish made. Keep it secret.";
  e.target.textContent = "Wish made ✓"; e.target.disabled = true;
  burst(.5, .45, 70);
});

/* appreciation */
let n = 0;
const note = $("#note"), dots = $("#dots"), nb = $("#noteNext");
CONFIG.appreciation.forEach(() => dots.appendChild(document.createElement("span")));
function showNote() {
  const a = CONFIG.appreciation[n];
  note.querySelector("h3").textContent = a.title;
  note.querySelector("p").textContent = a.text;
  [...dots.children].forEach((d, i) => d.classList.toggle("on", i === n));
  note.classList.remove("swap"); void note.offsetWidth; note.classList.add("swap");
  nb.textContent = n === CONFIG.appreciation.length - 1 ? "Continue" : "Another one";
}
nb.addEventListener("click", () => {
  if (n < CONFIG.appreciation.length - 1) { n++; showNote(); } else go(cur + 1);
});
showNote();

/* gift */
const gift = $("#gift");
gift.addEventListener("click", () => {
  if (gift.classList.contains("open")) return;
  gift.classList.add("open"); gift.setAttribute("aria-expanded", "true");
  gift.setAttribute("aria-label", "Gift box, opened");
  $("#giftHint").hidden = true;
  $("#giftWish").hidden = false; $("#giftNext").hidden = false;
  burst(.5, .5, 40);
});

/* replay */
$("#replay").addEventListener("click", () => {
  $("#cake").classList.remove("out");
  const b = $("#blow"); b.disabled = false; b.textContent = "Blow out the candles";
  $("#wishline").textContent = "Make a wish, then blow out the candles.";
  gift.classList.remove("open"); gift.setAttribute("aria-expanded", "false"); gift.setAttribute("aria-label", "Open the gift box");
  $("#giftHint").hidden = false; $("#giftWish").hidden = true; $("#giftNext").hidden = true;
  n = 0; showNote(); go(0);
});
