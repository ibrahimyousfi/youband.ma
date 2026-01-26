function initCountdown(config) {
    const { timeLeft: initialTime, mainContentSelector, videoEffectSelector } = config;
    
    let timeLeft = initialTime;
    const mainContent = document.querySelector(mainContentSelector);
    const videoEffect = document.querySelector(videoEffectSelector);
    
    if (mainContent) mainContent.classList.add('d-none');
    
    const interval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(interval);
            if (mainContent) {
                mainContent.classList.remove('d-none');
                window.scrollTo({ top: mainContent.offsetTop - 50, behavior: 'smooth' });
            }
        }
    }, 1000);
    
    setTimeout(() => videoEffect?.classList.add('show-effect'), 3000);
}

function initMultiStepForm(config) {
    const { formId, redirectUrl, formName } = config;
    
    const form = document.getElementById(formId);
    if (!form) return;
    
    let currentStep = 0;
    const stepIndicator = document.querySelector('.step-indicator-circle');
    
    function getCurrentSteps() {
        const currentForm = document.getElementById(formId);
        return currentForm ? currentForm.querySelectorAll('.form-step') : [];
    }
    
    function updateProgress() {
        const totalSteps = getCurrentSteps().length;
        if (stepIndicator) stepIndicator.textContent = `${currentStep + 1} / ${totalSteps}`;
    }
    
    function showStep(stepIndex) {
        const currentSteps = getCurrentSteps();
        currentSteps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        updateProgress();
    }
    
    function validateStep() {
        const currentSteps = getCurrentSteps();
        if (!currentSteps[currentStep]) return false;
        
        const fields = currentSteps[currentStep].querySelectorAll('[required]');
        let isValid = true;
        fields.forEach(field => {
            const isEmpty = !field.value.trim();
            field.classList.toggle('is-invalid', isEmpty);
            if (isEmpty) isValid = false;
        });
        return isValid;
    }
    
    function nextStep() {
        if (!validateStep()) return;
        const totalSteps = getCurrentSteps().length;
        if (currentStep < totalSteps - 1) {
            showStep(++currentStep);
        } else {
            submitForm();
        }
    }
    
    function prevStep() {
        if (currentStep > 0) showStep(--currentStep);
    }
    
    function closeModal() {
        const modalElement = document.getElementById('formModal');
        if (modalElement) {
            modalElement.style.display = 'none';
            document.body.classList.remove('modal-open');
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
            }
        }
    }
    
    function submitForm() {
        const currentForm = document.getElementById(formId);
        if (!currentForm) return;
        
        const submitBtn = currentForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Envoi en cours...';
        }
        
        const formData = new FormData(currentForm);
        const params = new URLSearchParams();
        
        params.append('form_name', formName || 'Form');
        for (const [key, value] of formData.entries()) {
            if (value) params.append(key, value);
        }
        params.append('timestamp', new Date().toLocaleString('en-US'));
        params.append('device_type', /iPad/.test(navigator.userAgent) ? 'Tablet' : /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'Mobile' : 'Desktop');
        params.append('user_agent', navigator.userAgent || 'Unknown');
        
        const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwRH0mKWU_4WnjOPG1jKUNCUKhIkkzIYZz4XJ_WSDcViwWSGv92YEJ66wjNlaR5UZRg/exec';
        
        fetch(googleScriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        }).finally(() => {
            closeModal();
            window.location.href = redirectUrl;
        });
    }
    
    const handleClick = (selector, handler) => {
        form.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                handler();
            });
        });
    };
    
    handleClick('.btn-next', nextStep);
    handleClick('.btn-prev', prevStep);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        submitForm();
    });
    
    showStep(0);
}


