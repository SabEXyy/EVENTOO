/* ================================================
   EVENTOO — script.js
   All pages handled via DOMContentLoaded guard
================================================ */

// ── EVENT DATABASE ─────────────────────────────
const events = [
    {
        id: 1,
        title: "Hackathon 2026",
        description: "A 24-hour coding marathon for innovators and tech enthusiasts. Build something amazing, pitch it to judges, and win prizes up to ₹50,000.",
        venue: "DU Main Auditorium",
        price: 500,
        participants: 125,
        date: 12,
        genre: "tech",
        university: "Delhi University",
        icon: "💻",
        likes: 34
    },
    {
        id: 2,
        title: "Music Fest",
        description: "Live DJ night and electrifying band performances featuring top indie artists. Food stalls, glow sticks, and an unforgettable night.",
        venue: "Campus Ground",
        price: 300,
        participants: 210,
        date: 18,
        genre: "cultural",
        university: "Delhi University",
        icon: "🎵",
        likes: 87
    },
    {
        id: 3,
        title: "Startup Pitch Day",
        description: "Pitch your startup idea to investors and industry leaders. Get mentorship, networking opportunities, and a shot at seed funding.",
        venue: "Seminar Hall A",
        price: 200,
        participants: 80,
        date: 25,
        genre: "business",
        university: "IIT Delhi",
        icon: "🚀",
        likes: 52
    },
    {
        id: 4,
        title: "Sports Carnival",
        description: "Inter-university sports competition across 10 disciplines — cricket, football, badminton, and more. Show your athletic talent.",
        venue: "Sports Complex",
        price: 150,
        participants: 300,
        date: 20,
        genre: "sports",
        university: "Jamia Millia",
        icon: "🏆",
        likes: 61
    },
    {
        id: 5,
        title: "AI & ML Summit",
        description: "Industry experts talk on AI trends, hands-on workshops on LLMs and computer vision, and a live model deployment challenge.",
        venue: "Innovation Hub",
        price: 400,
        participants: 95,
        date: 15,
        genre: "tech",
        university: "IIT Delhi",
        icon: "🤖",
        likes: 78
    },
    {
        id: 6,
        title: "Cultural Nite",
        description: "Annual cultural extravaganza with dance performances, drama, and fashion shows representing cultures from across India.",
        venue: "Open-Air Theatre",
        price: 100,
        participants: 450,
        date: 22,
        genre: "cultural",
        university: "Jamia Millia",
        icon: "🎭",
        likes: 120
    }
];

let likedEvents  = JSON.parse(localStorage.getItem("likedEvents") || "[]");
let currentFilter  = "";
let currentSearch  = "";
let currentTickets = 1;

// ── TOAST ──────────────────────────────────────
function showToast(msg) {
    const toast = document.getElementById("toast") || createToastEl();
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function createToastEl() {
    const t = document.createElement("div");
    t.className = "toast";
    t.id = "toast";
    document.body.appendChild(t);
    return t;
}


// LOGIN PAGE
function login() {
    const name  = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    if (!name || !email) return;
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    window.location.href = "dashboard.html";
}


// DASHBOARD — load & render events

function loadEvents() {
    const feed = document.getElementById("event-feed");
    if (!feed) return;

    // Greeting
    const greetingEl = document.getElementById("heroGreeting");
    if (greetingEl) {
        const name = localStorage.getItem("userName") || "there";
        const h    = new Date().getHours();
        const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
        greetingEl.textContent = `${greet}, ${name}! 👋`;
    }

    // Avatar initial
    const avatar = document.getElementById("userAvatar");
    if (avatar) {
        const name = localStorage.getItem("userName") || "U";
        avatar.textContent = name.charAt(0).toUpperCase();
    }

    renderEvents();

    // Genre chip filter
    document.querySelectorAll(".chip").forEach(chip => {
        chip.addEventListener("click", () => {
            document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            currentFilter = chip.dataset.genre;
            renderEvents();
        });
    });

    // Search
    const searchInput = document.getElementById("universitySearch");
    if (searchInput) {
        searchInput.addEventListener("input", e => {
            currentSearch = e.target.value.toLowerCase().trim();
            renderEvents();
        });
    }
}

function renderEvents() {
    const feed = document.getElementById("event-feed");
    if (!feed) return;

    const filtered = events.filter(ev => {
        const matchGenre  = !currentFilter || ev.genre === currentFilter;
        const matchSearch = !currentSearch ||
            ev.university.toLowerCase().includes(currentSearch) ||
            ev.title.toLowerCase().includes(currentSearch);
        return matchGenre && matchSearch;
    });

    if (!filtered.length) {
        feed.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🔍</span>
                <h3>No events found</h3>
                <p>Try a different filter or search term</p>
            </div>`;
        return;
    }

    const genreLabel = { tech: "Tech", cultural: "Cultural", sports: "Sports", business: "Business" };

    feed.innerHTML = filtered.map(ev => {
        const liked = likedEvents.includes(ev.id);
        return `
        <div class="event-card">
            <div class="event-card-header">
                <div class="event-card-accent"></div>
                <div class="event-icon">${ev.icon}</div>
                <span class="event-badge badge-${ev.genre}">${genreLabel[ev.genre] || ev.genre}</span>
                <h3>${ev.title}</h3>
                <div class="event-meta">🏛️ ${ev.university}</div>
            </div>
            <div class="event-card-body">
                <p>${ev.description}</p>
                <div class="event-info-row">
                    <div class="info-chip">📅 March ${ev.date}</div>
                    <div class="info-chip">💰 ₹${ev.price}</div>
                    <div class="info-chip">👥 ${ev.participants}</div>
                </div>
            </div>
            <div class="event-card-footer">
                <div class="card-actions">
                    <button
                        class="action-btn like-btn ${liked ? "liked" : ""}"
                        onclick="event.stopPropagation(); toggleLike(${ev.id}, this)"
                    >${liked ? "❤️" : "🤍"} <span>${ev.likes + (liked ? 1 : 0)}</span></button>
                    <button
                        class="action-btn share-btn"
                        onclick="event.stopPropagation(); shareEvent('${ev.title}')"
                    >🔗 Share</button>
                </div>
                <button class="view-btn" onclick="selectEvent(${ev.id})">View Details →</button>
            </div>
        </div>`;
    }).join("");
}

function toggleLike(eventId, btn) {
    const ev = events.find(e => e.id === eventId);
    if (!ev) return;
    const idx = likedEvents.indexOf(eventId);
    if (idx === -1) {
        likedEvents.push(eventId);
        btn.classList.add("liked");
        btn.innerHTML = `❤️ <span>${ev.likes + 1}</span>`;
    } else {
        likedEvents.splice(idx, 1);
        btn.classList.remove("liked");
        btn.innerHTML = `🤍 <span>${ev.likes}</span>`;
    }
    localStorage.setItem("likedEvents", JSON.stringify(likedEvents));
}

function shareEvent(title) {
    if (navigator.share) {
        navigator.share({ title: "Eventoo — " + title, text: "Check out " + title + " on Eventoo!" });
    } else {
        navigator.clipboard.writeText(window.location.href)
            .then(() => showToast("Link copied to clipboard! 🔗"))
            .catch(() => showToast("Copy the URL from your browser 🔗"));
    }
}

// ── SELECT EVENT ───────────────────────────────
function selectEvent(eventId) {
    const ev = events.find(e => e.id === eventId);
    if (!ev) return;
    localStorage.setItem("selectedEvent", JSON.stringify(ev));
    window.location.href = "event-details.html";
}

// EVENT DETAILS PAGE

function loadEventDetails() {
    if (!document.getElementById("event-title")) return;
    const ev = JSON.parse(localStorage.getItem("selectedEvent"));
    if (!ev) { window.location.href = "dashboard.html"; return; }

    document.getElementById("event-title").textContent       = ev.title;
    document.getElementById("event-description").textContent = ev.description;
    document.getElementById("event-venue").textContent       = ev.venue;
    document.getElementById("event-date").textContent        = `March ${ev.date}, 2026`;
    document.getElementById("event-price").textContent       = `₹${ev.price} per ticket`;
    document.getElementById("event-participants").textContent = `${ev.participants} registered`;

    const iconEl = document.getElementById("event-icon");
    if (iconEl) iconEl.textContent = ev.icon || "🎉";

    document.title = `${ev.title} — Eventoo`;
}

// ── NAVIGATION ─────────────────────────────────
function goToPayment() {
    window.location.href = "payment.html";
}

function joinChat() {
    window.location.href = "chat.html";
}

function openCalendar() {
    window.location.href = "calendar.html";
}

function goBack() {
    window.location.href = "dashboard.html";
}


// PAYMENT PAGE

function loadPaymentPage() {
    if (!document.getElementById("eventName")) return;

    const ev = JSON.parse(localStorage.getItem("selectedEvent"));
    if (!ev) { window.location.href = "dashboard.html"; return; }

    currentTickets = 1;
    document.getElementById("eventName").textContent       = ev.title;
    document.getElementById("ticketCountDisplay").textContent = currentTickets;
    updateTotal(ev.price);

    // Payment method toggle
    document.querySelectorAll(".method-card").forEach(card => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".method-card").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            const val = card.querySelector("input").value;
            document.getElementById("cardDetails").style.display = val === "card" ? "block" : "none";
            document.getElementById("upiDetails").style.display  = val === "upi"  ? "block" : "none";
        });
    });

    // Card number auto-format with spaces
    const cardInput = document.getElementById("cardNumber");
    if (cardInput) {
        cardInput.addEventListener("input", function () {
            const digits = this.value.replace(/\D/g, "").substring(0, 16);
            this.value = digits.replace(/(.{4})/g, "$1 ").trim();
        });
    }
}

function changeTickets(delta) {
    const ev = JSON.parse(localStorage.getItem("selectedEvent"));
    if (!ev) return;
    currentTickets = Math.max(1, Math.min(10, currentTickets + delta));
    document.getElementById("ticketCountDisplay").textContent = currentTickets;
    updateTotal(ev.price);
}

function updateTotal(pricePerTicket) {
    const total = pricePerTicket * currentTickets;
    const el = document.getElementById("totalPrice");
    if (el) el.textContent = `₹${total}`;
    localStorage.setItem("ticketCount", currentTickets);
    localStorage.setItem("totalPrice", total);
}

function completePayment() {
    const btn = document.getElementById("payNowBtn");
    if (btn) {
        btn.textContent = "Processing…";
        btn.disabled = true;
    }
    setTimeout(() => {
        window.location.href = "qr.html";
    }, 1600);
}


// QR PAGE

function loadQRPage() {
    const qrImg = document.getElementById("qr-image");
    if (!qrImg) return;

    const ev = JSON.parse(localStorage.getItem("selectedEvent"));
    if (!ev) return;

    const nameEl = document.getElementById("qrEventName");
    if (nameEl) nameEl.textContent = `${ev.title} · ${localStorage.getItem("ticketCount") || 1} ticket(s)`;

    const userName = localStorage.getItem("userName") || "Guest";
    const qrText   = encodeURIComponent(`${ev.title} | ${userName} | EntryPass`);
    qrImg.src = `https://quickchart.io/qr?size=200&text=${qrText}`;
}


// CHAT PAGE

const seedMessages = [
    { sender: "Priya S.",  text: "So excited for this event! 🎉",         time: "10:02 AM" },
    { sender: "Arjun K.",  text: "Same here! Anyone else from SRCC?",      time: "10:05 AM" },
    { sender: "Neha M.",   text: "Me! Already got 2 tickets 🙋",           time: "10:07 AM" },
    { sender: "Rohit D.",  text: "What's the entry requirement?",           time: "10:10 AM" },
    { sender: "Priya S.",  text: "Just show the QR at the gate 👍",        time: "10:11 AM" },
];

function loadChat() {
    const container = document.getElementById("chatMessages");
    if (!container) return;

    const ev = JSON.parse(localStorage.getItem("selectedEvent"));
    const nameEl = document.getElementById("chatEventName");
    if (ev && nameEl) nameEl.textContent = `${ev.title} — Chat`;

    seedMessages.forEach(m => appendMessage(m.sender, m.text, m.time, false));
    scrollChat();
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const userName = localStorage.getItem("userName") || "You";
    const now  = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    appendMessage(userName, text, time, true);
    input.value = "";
    scrollChat();
}

function appendMessage(sender, text, time, isSent) {
    const container = document.getElementById("chatMessages");
    if (!container) return;

    const div = document.createElement("div");
    div.className = `chat-message ${isSent ? "sent" : "received"}`;
    div.innerHTML = `
        ${!isSent ? `<div class="message-sender">${sender}</div>` : ""}
        <div class="message-bubble">${escapeHtml(text)}</div>
        <div class="message-time">${time}</div>
    `;
    container.appendChild(div);
}

function scrollChat() {
    const c = document.getElementById("chatMessages");
    if (c) c.scrollTop = c.scrollHeight;
}

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}


// CALENDAR PAGE

function generateCalendar() {
    const grid = document.getElementById("calendarGrid");
    if (!grid) return;

    grid.innerHTML = "";

    const monthSelect = document.getElementById("monthSelect");
    const monthVal    = parseInt(monthSelect ? monthSelect.value : new Date().getMonth());
    const year        = 2026;
    const today       = new Date();
    const daysInMonth = new Date(year, monthVal + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, monthVal, 1).getDay(); // 0=Sun

    // Empty filler cells for offset
    for (let i = 0; i < firstDayOfWeek; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-day empty-day";
        grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement("div");
        cell.className = "calendar-day";
        cell.innerHTML = `<span>${d}</span>`;

        // Highlight today
        const isToday = today.getFullYear() === year &&
                        today.getMonth()    === monthVal &&
                        today.getDate()     === d;
        if (isToday) cell.classList.add("today");

        // Check events
        const matchedEvent = events.find(ev => ev.date === d);
        if (matchedEvent) {
            cell.classList.add("has-event");
            cell.title = matchedEvent.title;

            const dot = document.createElement("div");
            dot.className = "event-dot";
            cell.appendChild(dot);

            cell.addEventListener("click", () => selectEvent(matchedEvent.id));
        }

        grid.appendChild(cell);
    }
}

// AUTO-INIT on every page

document.addEventListener("DOMContentLoaded", () => {
    // Set current month in calendar dropdown
    const monthSelect = document.getElementById("monthSelect");
    if (monthSelect) monthSelect.value = new Date().getMonth();

    loadEvents();
    loadEventDetails();
    loadPaymentPage();
    loadQRPage();
    loadChat();
    generateCalendar();
});