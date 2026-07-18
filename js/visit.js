/* =====================
   蒙顶山茶线上博物馆 - Visit Guide
   ===================== */

// --- Form Validation ---
function validateForm() {
    const form = document.getElementById('visitForm');
    if (!form) return true;

    const name = form.querySelector('#formName');
    const message = form.querySelector('#formMessage');
    const email = form.querySelector('#formEmail');

    let isValid = true;

    if (!name.value.trim()) {
        showError(name, getNestedTranslation('visit.form_required') || '此字段为必填项');
        isValid = false;
    } else {
        clearError(name);
    }

    if (!message.value.trim()) {
        showError(message, getNestedTranslation('visit.form_required') || '此字段为必填项');
        isValid = false;
    } else {
        clearError(message);
    }

    if (email.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            showError(email, getNestedTranslation('visit.form_invalid_email') || '请输入有效的邮箱地址');
            isValid = false;
        } else {
            clearError(email);
        }
    }

    return isValid;
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    const errorMsg = formGroup.querySelector('.error-msg');
    if (errorMsg) errorMsg.textContent = message;
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
}

// --- Handle Form Submit ---
function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const form = e.target;
    const formContent = form.querySelector('.form-content');
    const successMsg = form.querySelector('.form-success');
    const submitBtn = form.querySelector('.btn-primary');

    const originalText = submitBtn.textContent;
    submitBtn.textContent = '发送中...';
    submitBtn.disabled = true;

    setTimeout(() => {
        formContent.style.display = 'none';
        successMsg.style.display = 'block';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
    }, 1000);
}

// --- Helper ---
function getNestedTranslation(key) {
    const keys = key.split('.');
    let value = window.translations;
    for (const k of keys) {
        if (value) value = value[k];
    }
    return typeof value === 'string' ? value : null;
}

// --- FAQ Toggle ---
function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
                // Toggle current
                if (!isActive) item.classList.add('active');
            });
        }
    });
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();

    const form = document.getElementById('visitForm');
    if (form) {
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim()) clearError(input);
            });
        });
        form.addEventListener('submit', handleSubmit);
    }
});
