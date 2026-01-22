function initCountdown(config) {
    const { timeLeft: initialTime, countdownSelector, progressBarSelector, countdownBoxSelector, mainContentSelector, videoEffectSelector } = config;
    
    let timeLeft = initialTime;
    const elements = {
        countdown: document.querySelector(countdownSelector),
        progressBar: document.querySelector(progressBarSelector),
        countdownBox: document.querySelector(countdownBoxSelector),
        mainContent: document.querySelector(mainContentSelector),
        videoEffect: document.querySelector(videoEffectSelector)
    };
    
    if (elements.mainContent) elements.mainContent.classList.add('d-none');
    
    const updateDisplay = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        if (elements.countdown) {
            elements.countdown.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        if (elements.progressBar) {
            elements.progressBar.style.width = `${((initialTime - timeLeft) / initialTime * 100)}%`;
        }
    };
    
    const interval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
            clearInterval(interval);
            if (elements.progressBar) elements.progressBar.style.width = '100%';
            setTimeout(() => {
                if (elements.countdownBox) elements.countdownBox.style.display = 'none';
                if (elements.mainContent) {
                    elements.mainContent.classList.remove('d-none');
                    requestAnimationFrame(() => {
                        window.scrollTo({ top: elements.mainContent.offsetTop - 50, behavior: 'smooth' });
                    });
                }
            }, 300);
        }
    }, 1000);
    
    setTimeout(() => elements.videoEffect?.classList.add('show-effect'), 3000);
}

function preventVideoPause(videoId) {
    window._wq = window._wq || [];
    window._wq.push({
        id: videoId,
        onReady: function(video) {
            video.play();
            video.bind('pause', function() {
                video.play();
            });
            video.bind('play', function() {
                video.play();
            });
            setInterval(function() {
                if (video.state() !== 'playing') {
                    video.play();
                }
            }, 500);
        }
    });
}

function initMultiStepForm(config) {
    const { formId, googleScriptUrl, redirectUrl, formName } = config;
    
    const form = document.getElementById(formId);
    if (!form) return;
    
    const steps = form.querySelectorAll('.form-step');
    let currentStep = 0;
    const totalSteps = steps.length;
    
    const stepIndicator = document.querySelector('.step-indicator-circle');
    
    function updateProgress() {
        if (stepIndicator) stepIndicator.textContent = `${currentStep + 1} / ${totalSteps}`;
    }
    
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        updateProgress();
        
        const currentStepElement = steps[stepIndex];
        if (currentStepElement) {
            const input = currentStepElement.querySelector('input, select, textarea');
            if (input && input.type !== 'hidden') {
                setTimeout(() => input.focus(), 100);
            }
        }
    }
    
    function validateStep() {
        const fields = steps[currentStep].querySelectorAll('[required]');
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
    
    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/iPad/.test(ua)) return 'Tablet';
        return /Mobile|Android|iPhone/.test(ua) ? 'Mobile' : 'Desktop';
    }
    
    function submitForm() {
        const formData = new FormData(form);
        const params = new URLSearchParams();
        
        params.append('form_name', formName || 'Form');
        for (const [key, value] of formData.entries()) {
            if (value) params.append(key, value);
        }
        params.append('timestamp', new Date().toLocaleString('en-US'));
        params.append('device_type', getDeviceType());
        params.append('user_agent', navigator.userAgent || 'Unknown');
        
        if (googleScriptUrl) {
            fetch(googleScriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString()
            }).catch(() => {});
        }
        
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 100);
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
        submitForm();
    });
    
    showStep(0);
}


