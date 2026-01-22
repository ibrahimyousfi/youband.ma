function createHeader(config) {
    const { 
        linkText = null, 
        linkHref = '#contactFormForm',
        showLink = true 
    } = config || {};
    
    if (document.querySelector('.fixed-header')) {
        return;
    }
    
    const header = document.createElement('header');
    header.className = 'fixed-header';
    
    const container = document.createElement('div');
    container.className = 'container';
    
    const logoContainer = document.createElement('div');
    logoContainer.style.cssText = 'display: flex; align-items: center; gap: 10px;';
    
    const logo = document.createElement('img');
    logo.src = 'youbrand-logo.webp';
    logo.alt = 'Logo';
    logo.className = 'fixed-header-logo';
    logo.fetchPriority = 'high';
    logo.loading = 'eager';
    logo.width = 215;
    logo.height = 70;
    
    logoContainer.appendChild(logo);
    container.appendChild(logoContainer);
    
    if (showLink && linkText) {
        const link = document.createElement('a');
        link.href = linkHref;
        link.className = 'fixed-header-link';
        link.textContent = linkText;
        container.appendChild(link);
    }
    
    header.appendChild(container);
    
    const body = document.body;
    if (body.firstChild) {
        body.insertBefore(header, body.firstChild);
    } else {
        body.appendChild(header);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.headerConfig) {
        createHeader(window.headerConfig);
    }
});

