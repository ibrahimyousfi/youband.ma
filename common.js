function initCountdown(config) {
    const { timeLeft: initialTime, mainContentSelector, videoEffectSelector } = config;
    const mainContent = document.querySelector(mainContentSelector);
    const videoEffect = document.querySelector(videoEffectSelector);
    
    if (mainContent) mainContent.classList.add('hidden');
    
    const startTime = Date.now();
    const targetTime = startTime + (initialTime * 1000);
    
    function checkTime() {
        const elapsed = Date.now() - startTime;
        const remaining = targetTime - Date.now();
        
        if (remaining <= 0) {
            if (mainContent) {
                mainContent.classList.remove('hidden');
                window.scrollTo({ top: mainContent.offsetTop - 50, behavior: 'smooth' });
            }
        } else {
            setTimeout(checkTime, Math.min(1000, remaining));
        }
    }
    
    checkTime();
    setTimeout(() => videoEffect?.classList.add('show-effect'), 3000);
}

function initMultiStepForm(config) {
    const { formId, redirectUrl, formName } = config;
    const form = document.getElementById(formId);
    if (!form) return;
    
    let currentStep = 0;
    const stepIndicator = document.querySelector('.step-indicator-circle');
    const steps = form.querySelectorAll('.form-step');
    const totalSteps = steps.length;
    
    function updateProgress() {
        if (stepIndicator) stepIndicator.textContent = `${currentStep + 1} / ${totalSteps}`;
    }
    
    function showStep(stepIndex) {
        steps.forEach((step, i) => {
            step.classList.toggle('hidden', i !== stepIndex);
            step.classList.toggle('block', i === stepIndex);
        });
        updateProgress();
    }
    
    function validateStep() {
        const fields = steps[currentStep]?.querySelectorAll('[required]') || [];
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
        const modal = document.getElementById('formModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
    
    function submitForm() {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⟳</span>Envoi en cours...';
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        }
        
        if (typeof fbq !== 'undefined') fbq('track', 'Lead');
    }
    
    form.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', e => { e.preventDefault(); nextStep(); });
    });
    
    form.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', e => { e.preventDefault(); prevStep(); });
    });
    
    form.addEventListener('submit', e => {
        submitForm();
    });
    
    showStep(0);
}