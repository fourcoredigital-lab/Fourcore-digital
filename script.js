/* ==========================================================================
   FOURCORE DIGITAL — Interactive Behavior & Email Delivery
   ========================================================================== */

const AGENCY_EMAIL = 'fourcoredigital@gmail.com';
const SALON_URL = 'https://salon-demo-taupe.vercel.app';
const CAFE_URL = 'https://cafe-demo-rho-self.vercel.app/';
const HOSPITAL_URL = 'https://hospital-demo-wine.vercel.app/';
const JEWELLERY_URL = 'https://jewellery-shop-demo-zeta.vercel.app/';

// Optional: Paste a free Web3Forms Access Key linked to fourcoredigital@gmail.com
// (same instant engine used by the café demo). If left blank, FormSubmit is used.
const WEB3FORMS_ACCESS_KEY = '007204d4-fdde-4fc0-a6e0-f0b86933b027';

const initialReviews = [
    {
        name: 'Meera Joshi',
        role: 'Salon Owner • Sample Review',
        rating: 5,
        comment: 'Clients easily check our services on their phones and book appointments without confusion. Clean layout and fast loading.'
    },
    {
        name: 'Aarav Mehta',
        role: 'Café Owner • Sample Review',
        rating: 5,
        comment: 'The menu filter and table ordering tray are simple for guests to use, and order messages go straight to email.'
    },
    {
        name: 'Chirag Patel',
        role: 'Local Business Owner • Sample Review',
        rating: 5,
        comment: 'Clear communication, easy-to-read pages, and quick turnaround from the FourCore Digital team.'
    }
];

function escapeText(text) {
    const span = document.createElement('span');
    span.textContent = text;
    return span.innerHTML;
}

function renderReviews() {
    const container = document.getElementById('reviewsList');
    if (!container) return;

    let savedReviews = [];
    try {
        savedReviews = JSON.parse(localStorage.getItem('fc_reviews') || '[]');
    } catch (e) {
        savedReviews = [];
    }

    const allReviews = [...savedReviews, ...initialReviews];

    container.innerHTML = allReviews.map((item) => {
        const initials = item.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join('');

        const stars = Array.from({ length: 5 }, (_, i) =>
            `<i class="bi ${i < item.rating ? 'bi-star-fill' : 'bi-star'}" style="color:#D97706;"></i>`
        ).join('');

        return `
            <div class="col-md-4">
                <div class="fc-review-card h-100 d-flex flex-column justify-content-between">
                    <div>
                        <div class="mb-2">${stars}</div>
                        <p class="text-muted small mb-4">"${escapeText(item.comment)}"</p>
                    </div>
                    <div class="d-flex align-items-center gap-3 pt-3 border-top">
                        <span class="fc-avatar">${escapeText(initials || 'FC')}</span>
                        <div>
                            <div class="fw-semibold small text-dark">${escapeText(item.name)}</div>
                            <div class="text-muted" style="font-size:0.78rem;">${escapeText(item.role)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function sendToAgencyEmail(subject, fieldsObject) {
    // 1. Web3Forms (same instant engine as the Café demo)
    if (WEB3FORMS_ACCESS_KEY.trim()) {
        try {
            const formData = new FormData();
            formData.append('access_key', WEB3FORMS_ACCESS_KEY.trim());
            formData.append('subject', subject);
            formData.append('from_name', 'FourCore Digital Website');
            Object.entries(fieldsObject).forEach(([key, val]) => {
                formData.append(key, val);
            });

            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const json = await res.json();
            if (res.ok && json.success) {
                return { sent: true };
            }
        } catch (err) {
            // Fall through to FormSubmit
        }
    }

    // 2. FormSubmit AJAX (works on live https:// URL after one-time inbox activation)
    try {
        const res = await fetch(`https://formsubmit.co/ajax/${AGENCY_EMAIL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: subject,
                _template: 'table',
                ...fieldsObject
            })
        });
        const json = await res.json();
        if (res.ok && (json.success === 'true' || json.success === true)) {
            return { sent: true };
        }
        return { sent: false, reason: json.message || 'Activate FormSubmit in fourcoredigital@gmail.com on your live site.' };
    } catch (err) {
        return { sent: false, reason: 'Open on a live https:// link to send automatically.' };
    }
}

function copyLink(url, button) {
    navigator.clipboard.writeText(url).then(() => {
        const prev = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check2"></i> Copied';
        setTimeout(() => {
            button.innerHTML = prev;
        }, 1800);
    });
}

function openDemoPreview(title, url) {
    document.getElementById('previewTitle').textContent = `${title} — ${url}`;
    document.getElementById('previewNewTabBtn').href = url;
    document.getElementById('previewFrame').src = url;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('demoPreviewModal')).show();
}

document.addEventListener('DOMContentLoaded', () => {
    renderReviews();

    const navbar = document.getElementById('fcNavbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    document.getElementById('copySalonBtn').addEventListener('click', function () {
        copyLink(SALON_URL, this);
    });

    document.getElementById('copyCafeBtn').addEventListener('click', function () {
        copyLink(CAFE_URL, this);
    });

    document.getElementById('previewSalonBtn').addEventListener('click', () => {
        openDemoPreview('Salon & Spa Booking Website', SALON_URL);
    });

    document.getElementById('previewCafeBtn').addEventListener('click', () => {
        openDemoPreview('DEMO CAFÉ Website', CAFE_URL);
    });

    document.getElementById('copyHospitalBtn').addEventListener('click', function () {
        copyLink(HOSPITAL_URL, this);
    });

    document.getElementById('previewHospitalBtn').addEventListener('click', () => {
        openDemoPreview("Women's Hospital & Clinic Website", HOSPITAL_URL);
    });

    document.getElementById('copyJewelleryBtn').addEventListener('click', function () {
        copyLink(JEWELLERY_URL, this);
    });

    document.getElementById('previewJewelleryBtn').addEventListener('click', () => {
        openDemoPreview("Jewellery Showroom & Collection Website", JEWELLERY_URL);
    });

    // Star rating selector
    const stars = document.querySelectorAll('#starSelector i');
    const ratingInput = document.getElementById('revRating');
    stars.forEach((star) => {
        star.addEventListener('click', () => {
            const val = parseInt(star.getAttribute('data-value'), 10);
            ratingInput.value = val;
            stars.forEach((s, idx) => {
                s.className = idx < val ? 'bi bi-star-fill' : 'bi bi-star';
            });
        });
    });

    // Review form handler
    const reviewForm = document.getElementById('reviewForm');
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameEl = document.getElementById('revName');
        const roleEl = document.getElementById('revRole');
        const emailEl = document.getElementById('revEmail');
        const commentEl = document.getElementById('revComment');
        const ratingVal = parseInt(ratingInput.value, 10) || 5;

        let ok = true;
        if (nameEl.value.trim().length < 2) { nameEl.classList.add('is-invalid'); ok = false; } else { nameEl.classList.remove('is-invalid'); }
        if (roleEl.value.trim().length < 2) { roleEl.classList.add('is-invalid'); ok = false; } else { roleEl.classList.remove('is-invalid'); }
        if (commentEl.value.trim().length < 10) { commentEl.classList.add('is-invalid'); ok = false; } else { commentEl.classList.remove('is-invalid'); }
        if (!ok) return;

        const submitBtn = document.getElementById('revSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const entry = {
            name: nameEl.value.trim(),
            role: roleEl.value.trim(),
            rating: ratingVal,
            comment: commentEl.value.trim()
        };

        const existing = JSON.parse(localStorage.getItem('fc_reviews') || '[]');
        existing.unshift(entry);
        localStorage.setItem('fc_reviews', JSON.stringify(existing));
        renderReviews();

        const result = await sendToAgencyEmail(`New Review (${ratingVal}★) — ${entry.name}`, {
            Name: entry.name,
            Business_or_Role: entry.role,
            Email: emailEl.value.trim() || 'Not provided',
            Rating: `${ratingVal} / 5`,
            Review: entry.comment
        });

        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Review <i class="bi bi-send ms-1"></i>';
        reviewForm.reset();
        ratingInput.value = '5';
        stars.forEach((s) => { s.className = 'bi bi-star-fill'; });

        const msgText = document.getElementById('revSuccessText');
        msgText.innerHTML = result.sent
            ? `Thank you! Your review has been posted and sent to <strong>${AGENCY_EMAIL}</strong>.`
            : `Review saved on page! (${result.reason})`;
        document.getElementById('revSuccessMsg').classList.remove('d-none');
    });

    // Contact form handler
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameEl = document.getElementById('cName');
        const bizEl = document.getElementById('cBusiness');
        const emailEl = document.getElementById('cEmail');
        const phoneEl = document.getElementById('cPhone');
        const msgEl = document.getElementById('cMessage');

        let ok = true;
        if (nameEl.value.trim().length < 2) { nameEl.classList.add('is-invalid'); ok = false; } else { nameEl.classList.remove('is-invalid'); }
        if (bizEl.value.trim().length < 2) { bizEl.classList.add('is-invalid'); ok = false; } else { bizEl.classList.remove('is-invalid'); }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) { emailEl.classList.add('is-invalid'); ok = false; } else { emailEl.classList.remove('is-invalid'); }
        if (msgEl.value.trim().length < 6) { msgEl.classList.add('is-invalid'); ok = false; } else { msgEl.classList.remove('is-invalid'); }
        if (!ok) return;

        const btn = document.getElementById('cSubmitBtn');
        btn.disabled = true;
        btn.textContent = 'Sending...';

        const subject = `Website Inquiry: ${bizEl.value.trim()} (${nameEl.value.trim()})`;
        const bodyText = `Name: ${nameEl.value.trim()}\nBusiness: ${bizEl.value.trim()}\nEmail: ${emailEl.value.trim()}\nPhone: ${phoneEl.value.trim() || 'Not provided'}\n\nMessage:\n${msgEl.value.trim()}`;

        document.getElementById('cMailtoLink').href =
            `mailto:${AGENCY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

        const result = await sendToAgencyEmail(subject, {
            Name: nameEl.value.trim(),
            Business: bizEl.value.trim(),
            Email: emailEl.value.trim(),
            Phone: phoneEl.value.trim() || 'Not provided',
            Message: msgEl.value.trim()
        });

        btn.disabled = false;
        btn.innerHTML = 'Send Message <i class="bi bi-send ms-1"></i>';
        contactForm.reset();

        const successText = document.getElementById('cSuccessText');
        successText.innerHTML = result.sent
            ? `<strong>Message sent!</strong> Your inquiry has been delivered to <strong>${AGENCY_EMAIL}</strong>.`
            : `<strong>Almost ready!</strong> ${result.reason} You can also tap below to open your email app.`;
        document.getElementById('cSuccessBox').classList.remove('d-none');
    });

    // Modal "Start a Project" form handler
    const modalForm = document.getElementById('modalProjectForm');
    modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameEl = document.getElementById('mName');
        const emailEl = document.getElementById('mEmail');
        const phoneEl = document.getElementById('mPhone');
        const typeEl = document.getElementById('mType');
        const detailsEl = document.getElementById('mDetails');

        let ok = true;
        if (nameEl.value.trim().length < 2) { nameEl.classList.add('is-invalid'); ok = false; } else { nameEl.classList.remove('is-invalid'); }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) { emailEl.classList.add('is-invalid'); ok = false; } else { emailEl.classList.remove('is-invalid'); }
        if (detailsEl.value.trim().length < 6) { detailsEl.classList.add('is-invalid'); ok = false; } else { detailsEl.classList.remove('is-invalid'); }
        if (!ok) return;

        const btn = document.getElementById('mSubmitBtn');
        btn.disabled = true;
        btn.textContent = 'Sending...';

        const subject = `Project Request (${typeEl.value}) — ${nameEl.value.trim()}`;
        const bodyText = `Name: ${nameEl.value.trim()}\nEmail: ${emailEl.value.trim()}\nPhone: ${phoneEl.value.trim() || 'Not provided'}\nType: ${typeEl.value}\n\nDetails:\n${detailsEl.value.trim()}`;

        document.getElementById('mMailtoLink').href =
            `mailto:${AGENCY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

        const result = await sendToAgencyEmail(subject, {
            Name: nameEl.value.trim(),
            Email: emailEl.value.trim(),
            Phone: phoneEl.value.trim() || 'Not provided',
            Website_Type: typeEl.value,
            Details: detailsEl.value.trim()
        });

        btn.disabled = false;
        btn.innerHTML = 'Submit Request <i class="bi bi-check2 ms-1"></i>';
        modalForm.reset();

        const mSuccessText = document.getElementById('mSuccessText');
        mSuccessText.innerHTML = result.sent
            ? `<strong>Request sent!</strong> Your project note has been delivered to <strong>${AGENCY_EMAIL}</strong>.`
            : `<strong>Almost ready!</strong> ${result.reason}`;
        document.getElementById('mSuccessBox').classList.remove('d-none');
    });
});