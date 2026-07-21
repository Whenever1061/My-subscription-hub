// Menu toggle
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");

    if (sidebar) {
        sidebar.classList.toggle("open");
    }
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle("light-mode");
}

// Clock
function updateClock() {
    const now = new Date();

    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");

    if (!hoursElement || !minutesElement) {
        return;
    }

    hoursElement.textContent = now.getHours().toString().padStart(2, "0");
    minutesElement.textContent = now.getMinutes().toString().padStart(2, "0");
}

setInterval(updateClock, 1000);
updateClock();


// Underwater sidebar animation
const sidebarCanvas = document.getElementById("sidebarOcean");
const sideCtx = sidebarCanvas ? sidebarCanvas.getContext("2d") : null;

const fish = [];
const bubbles = [];
const seaweed = [];

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function resizeSidebarOcean() {
    if (!sidebarCanvas) {
        return;
    }

    const sidebar = document.getElementById("sidebar");

    if (!sidebar) {
        return;
    }

    sidebarCanvas.width = sidebar.clientWidth;
    sidebarCanvas.height = sidebar.clientHeight;

    buildOcean();
}

function buildOcean() {
    if (!sidebarCanvas) {
        return;
    }

    fish.length = 0;
    bubbles.length = 0;
    seaweed.length = 0;

    const w = sidebarCanvas.width;
    const h = sidebarCanvas.height;

    const fishCount = Math.max(8, Math.floor(h / 95));
    const bubbleCount = Math.max(18, Math.floor(h / 28));
    const weedCount = Math.max(8, Math.floor(w / 28));

    for (let i = 0; i < fishCount; i++) {
        fish.push({
            x: rand(0, w),
            y: rand(70, h - 90),
            size: rand(10, 24),
            speed: rand(0.2, 0.7),
            direction: Math.random() > 0.5 ? 1 : -1,
            bob: rand(0, Math.PI * 2)
        });
    }

    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push({
            x: rand(0, w),
            y: rand(0, h),
            r: rand(1.5, 5),
            speed: rand(0.3, 1.1),
            sway: rand(0.2, 0.9),
            offset: rand(0, Math.PI * 2)
        });
    }

    for (let i = 0; i < weedCount; i++) {
        seaweed.push({
            x: (i / Math.max(weedCount - 1, 1)) * w + rand(-6, 6),
            height: rand(55, 130),
            sway: rand(0.8, 1.8),
            offset: rand(0, Math.PI * 2)
        });
    }
}

function drawOcean(time) {
    if (!sidebarCanvas || !sideCtx) {
        return;
    }

    const w = sidebarCanvas.width;
    const h = sidebarCanvas.height;

    sideCtx.clearRect(0, 0, w, h);

    drawWaterBackground(w, h);
    drawLightRays(time, w, h);
    drawWaterLines(time, w);
    drawSeaweed(time, h);
    drawBubbles(time, w, h);
    drawFish(time, w, h);
}

function drawWaterBackground(w, h) {
    const waterGradient = sideCtx.createLinearGradient(0, 0, 0, h);

    waterGradient.addColorStop(0, "rgba(35, 142, 190, 0.95)");
    waterGradient.addColorStop(0.35, "rgba(18, 111, 161, 0.92)");
    waterGradient.addColorStop(1, "rgba(6, 42, 84, 0.98)");

    sideCtx.fillStyle = waterGradient;
    sideCtx.fillRect(0, 0, w, h);
}

function drawLightRays(time, w, h) {
    for (let i = 0; i < 4; i++) {
        const rayX = w * (0.15 + i * 0.2) + Math.sin(time * 0.0004 + i) * 24;

        sideCtx.fillStyle = "rgba(193, 240, 255, 0.08)";
        sideCtx.beginPath();
        sideCtx.moveTo(rayX, 0);
        sideCtx.lineTo(rayX + 55, 0);
        sideCtx.lineTo(rayX + 130, h);
        sideCtx.lineTo(rayX + 30, h);
        sideCtx.closePath();
        sideCtx.fill();
    }
}

function drawWaterLines(time, w) {
    sideCtx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    sideCtx.lineWidth = 1.1;

    for (let row = 0; row < 12; row++) {
        const baseY = 30 + row * 42;

        sideCtx.beginPath();

        for (let x = -10; x <= w + 10; x += 6) {
            const y =
                baseY +
                Math.sin(x * 0.06 + time * 0.0013 + row) * 6 +
                Math.cos(x * 0.025 + row) * 3;

            if (x === -10) {
                sideCtx.moveTo(x, y);
            } else {
                sideCtx.lineTo(x, y);
            }
        }

        sideCtx.stroke();
    }
}

function drawSeaweed(time, h) {
    sideCtx.strokeStyle = "rgba(102, 203, 170, 0.45)";
    sideCtx.lineWidth = 3;

    seaweed.forEach((weed) => {
        sideCtx.beginPath();
        sideCtx.moveTo(weed.x, h + 5);

        for (let step = 0; step <= 5; step++) {
            const progress = step / 5;

            const sway =
                Math.sin(time * 0.0012 * weed.sway + weed.offset + progress * 2.2) *
                (12 * progress);

            sideCtx.lineTo(weed.x + sway, h - weed.height * progress);
        }

        sideCtx.stroke();
    });
}

function drawBubbles(time, w, h) {
    bubbles.forEach((bubble) => {
        bubble.y -= bubble.speed;
        bubble.x += Math.sin(time * 0.001 * bubble.sway + bubble.offset) * 0.35;

        if (bubble.y < -10) {
            bubble.y = h + 10;
            bubble.x = rand(0, w);
        }

        sideCtx.fillStyle = "rgba(255, 255, 255, 0.18)";
        sideCtx.strokeStyle = "rgba(255, 255, 255, 0.35)";

        sideCtx.beginPath();
        sideCtx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
        sideCtx.fill();
        sideCtx.stroke();
    });
}

function drawFish(time, w, h) {
    fish.forEach((oneFish) => {
        oneFish.x += oneFish.speed * oneFish.direction;

        if (oneFish.direction > 0 && oneFish.x > w + 40) {
            oneFish.x = -40;
            oneFish.y = rand(60, h - 90);
        }

        if (oneFish.direction < 0 && oneFish.x < -40) {
            oneFish.x = w + 40;
            oneFish.y = rand(60, h - 90);
        }

        drawFishShape(oneFish, time);
    });
}

function drawFishShape(oneFish, time) {
    const dir = oneFish.direction;
    const x = oneFish.x;
    const y = oneFish.y + Math.sin(time * 0.001 + oneFish.bob) * 6;
    const size = oneFish.size;

    sideCtx.save();
    sideCtx.translate(x, y);

    if (dir < 0) {
        sideCtx.scale(-1, 1);
    }

    const fishGradient = sideCtx.createLinearGradient(-size, 0, size, 0);

    fishGradient.addColorStop(0, "rgba(255, 230, 150, 0.82)");
    fishGradient.addColorStop(0.6, "rgba(255, 150, 110, 0.9)");
    fishGradient.addColorStop(1, "rgba(255, 120, 105, 0.82)");

    sideCtx.fillStyle = fishGradient;

    sideCtx.beginPath();
    sideCtx.moveTo(-size, 0);
    sideCtx.quadraticCurveTo(-size * 0.15, -size * 0.7, size * 0.85, 0);
    sideCtx.quadraticCurveTo(-size * 0.15, size * 0.7, -size, 0);
    sideCtx.fill();

    sideCtx.beginPath();
    sideCtx.moveTo(-size * 0.9, 0);
    sideCtx.lineTo(-size * 1.45, -size * 0.55);
    sideCtx.lineTo(-size * 1.45, size * 0.55);
    sideCtx.closePath();
    sideCtx.fill();

    sideCtx.fillStyle = "rgba(255, 255, 255, 0.82)";
    sideCtx.beginPath();
    sideCtx.arc(size * 0.42, -size * 0.09, Math.max(1.8, size * 0.1), 0, Math.PI * 2);
    sideCtx.fill();

    sideCtx.fillStyle = "rgba(8, 23, 46, 0.8)";
    sideCtx.beginPath();
    sideCtx.arc(size * 0.45, -size * 0.09, Math.max(0.9, size * 0.05), 0, Math.PI * 2);
    sideCtx.fill();

    sideCtx.restore();
}

function animate(time) {
    drawOcean(time);
    requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeSidebarOcean);

resizeSidebarOcean();
animate(0);

// =========================================================
// Compact GNOME-style clock + calendar
// =========================================================
(function () {
    const clockDate = document.getElementById('clockDate');
    const meridiem = document.getElementById('clockMeridiem');
    const clockButton = document.getElementById('glassClock');
    const calendarDialog = document.getElementById('calendarDialog');
    const closeCalendarBtn = document.getElementById('closeCalendarBtn');
    const calendarPrev = document.getElementById('calendarPrev');
    const calendarNext = document.getElementById('calendarNext');
    const calendarToday = document.getElementById('calendarToday');
    const calendarMonthLabel = document.getElementById('calendarMonthLabel');
    const calendarGrid = document.getElementById('calendarGrid');
    const accountToggle = document.getElementById('accountHubToggle');
    const sidebar = document.getElementById('sidebar');

    function updateCompactClock() {
        const now = new Date();
        const h = document.getElementById('hours');
        const m = document.getElementById('minutes');
        const rawHour = now.getHours();
        if (h) h.textContent = String(rawHour % 12 || 12);
        if (m) m.textContent = String(now.getMinutes()).padStart(2, '0');
        if (meridiem) meridiem.textContent = rawHour >= 12 ? 'PM' : 'AM';
        if (clockDate) clockDate.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    updateCompactClock();
    setInterval(updateCompactClock, 1000);

    // Keep the same icon attached to the panel and make it a true toggle.
    accountToggle?.addEventListener('click', () => {
        requestAnimationFrame(() => {
            accountToggle.setAttribute('aria-expanded', String(sidebar?.classList.contains('open')));
        });
    });

    let shownMonth = new Date();
    shownMonth = new Date(shownMonth.getFullYear(), shownMonth.getMonth(), 1);

    function renderCalendar() {
        if (!calendarGrid || !calendarMonthLabel) return;
        calendarGrid.innerHTML = '';
        calendarMonthLabel.textContent = shownMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const year = shownMonth.getFullYear();
        const month = shownMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const previousMonthDays = new Date(year, month, 0).getDate();
        const today = new Date();

        for (let i = 0; i < 42; i += 1) {
            const cell = document.createElement('div');
            cell.className = 'calendar-day';
            let day;
            let cellMonth = month;
            let cellYear = year;
            if (i < firstDay) {
                day = previousMonthDays - firstDay + i + 1;
                cellMonth = month - 1;
                cell.classList.add('is-muted');
            } else if (i >= firstDay + daysInMonth) {
                day = i - firstDay - daysInMonth + 1;
                cellMonth = month + 1;
                cell.classList.add('is-muted');
            } else {
                day = i - firstDay + 1;
            }
            const date = new Date(cellYear, cellMonth, day);
            if (
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate()
            ) cell.classList.add('is-today');
            cell.textContent = String(day);
            calendarGrid.appendChild(cell);
        }
    }

    clockButton?.addEventListener('click', () => {
        renderCalendar();
        if (calendarDialog && !calendarDialog.open) calendarDialog.showModal();
    });
    closeCalendarBtn?.addEventListener('click', () => calendarDialog?.close());
    calendarPrev?.addEventListener('click', () => {
        shownMonth = new Date(shownMonth.getFullYear(), shownMonth.getMonth() - 1, 1);
        renderCalendar();
    });
    calendarNext?.addEventListener('click', () => {
        shownMonth = new Date(shownMonth.getFullYear(), shownMonth.getMonth() + 1, 1);
        renderCalendar();
    });
    calendarToday?.addEventListener('click', () => {
        const now = new Date();
        shownMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        renderCalendar();
    });
})();
