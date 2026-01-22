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
        if (elements.countdown) elements.countdown.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        if (elements.progressBar) elements.progressBar.style.width = `${((initialTime - timeLeft) / initialTime * 100)}%`;
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
                        requestAnimationFrame(() => {
                            window.scrollTo({ top: elements.mainContent.offsetTop - 50, behavior: 'smooth' });
                        });
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
            video.bind('pause', function() {
                video.play();
            });
        }
    });
}

function initFormSubmission(config) {
    const { formId, googleScriptUrl, redirectUrl, formName, getFormData } = config;
    
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = new URLSearchParams();
        data.append('form_name', formName || 'Form');
        
        // Add form data first
        if (getFormData) {
            const customData = getFormData(formData);
            for (const [key, value] of Object.entries(customData)) {
                if (value) data.append(key, value);
            }
        }
        
        // Add timestamp, device type, and user agent at the end
        data.append('timestamp', new Date().toLocaleString('en-US'));
        data.append('device_type', /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? (/iPad/.test(navigator.userAgent) ? 'Tablet' : 'Mobile') : 'Desktop');
        data.append('user_agent', navigator.userAgent || 'Unknown');
        
        if (googleScriptUrl) {
            fetch(googleScriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data.toString()
            });
        }
        
        form.reset();
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 200);
    });
}

