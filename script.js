// Icon SVGs for projects
const icons = {
    chart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>`,
    health: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    code: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    default: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`
};

// Mobile menu toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Load projects from JSON
async function loadProjects() {
    try {
        const res = await fetch('/json/projects.json');
        const data = await res.json();
        const grid = document.getElementById('projects-grid');
        
        grid.innerHTML = data.projects.map(project => {
            const icon = icons[project.icon] || icons.default;
            const linkUrl = project.url || '#';
            const linkText = project.linkText || 'Learn more';
            const hasIcon = project.image && project.image !== '';
            
            const iconHtml = hasIcon 
                ? `<div class="project-icon has-img"><img src="${project.image}" alt="${project.title} icon" loading="lazy"></div>`
                : `<div class="project-icon">${icon}</div>`;
            
            const githubHtml = project.github 
                ? `<a href="${project.github}" target="_blank" rel="noopener" class="project-link project-link-github">GitHub</a>`
                : '';
            
            return `
                <article class="project-card">
                    ${iconHtml}
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    ${project.tags ? `<div class="project-tags">${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
                    <div class="project-links">
                        <a href="${linkUrl}" ${linkUrl !== '#' ? 'target="_blank" rel="noopener"' : ''} class="project-link">${linkText} &rarr;</a>
                        ${githubHtml}
                    </div>
                </article>
            `;
        }).join('');
    } catch (err) {
        console.error('Failed to load projects:', err);
    }
}

// Load footer projects from JSON
async function loadFooterProjects() {
    try {
        const res = await fetch('/json/projects.json');
        const data = await res.json();
        const container = document.getElementById('footer-projects');
        
        container.innerHTML = data.projects.map(project => {
            const linkUrl = project.url || '#';
            return `<a href="${linkUrl}" target="_blank" rel="noopener" class="footer-link">${project.title}</a>`;
        }).join('');
    } catch (err) {
        console.error('Failed to load footer projects:', err);
    }
}

// Load research from JSON
async function loadResearch() {
    try {
        const res = await fetch('/json/research.json');
        const data = await res.json();
        const list = document.getElementById('writing-list');
        
        list.innerHTML = data.research.map(item => {
            const linkUrl = item.file || item.url || '#';
            return `
                <article class="writing-item">
                    <div class="writing-content">
                        <h3 class="writing-title">${item.title}</h3>
                        <p class="writing-summary">${item.summary}</p>
                    </div>
                    <a href="${linkUrl}" ${linkUrl !== '#' ? 'target="_blank" rel="noopener"' : ''} class="btn btn-small">View PDF</a>
                </article>
            `;
        }).join('');
    } catch (err) {
        console.error('Failed to load research:', err);
    }
}

// Load photos from JSON
async function loadPhotos() {
    try {
        const res = await fetch('/json/photos.json');
        const data = await res.json();
        const grid = document.getElementById('photo-grid');
        
        grid.innerHTML = data.photos.map(photo => `
            <div class="photo-item" tabindex="0" data-src="${photo.src}">
                <img src="${photo.src}" alt="${photo.alt}" loading="lazy">
                ${photo.caption ? `<div class="photo-caption">${photo.caption}</div>` : ''}
            </div>
        `).join('');
        
        // Attach lightbox events after loading
        initPhotoLightbox();
    } catch (err) {
        console.error('Failed to load photos:', err);
    }
}

// Photo lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('.lightbox-img');
const lightboxClose = lightbox.querySelector('.lightbox-close');

function initPhotoLightbox() {
    document.querySelectorAll('.photo-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar background on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Load skills from JSON
async function loadSkills() {
    try {
        const res = await fetch('/json/skills.json');
        const data = await res.json();
        const grid = document.getElementById('skills-grid');
        
        grid.innerHTML = data.categories.map(category => `
            <div class="skill-category">
                <h3 class="skill-category-title">${category.name}</h3>
                <div class="skill-tags">
                    ${category.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load skills:', err);
    }
}

// Load education from JSON
async function loadEducation() {
    try {
        const res = await fetch('/json/education.json');
        const data = await res.json();
        const scroll = document.getElementById('education-scroll');
        
        scroll.innerHTML = data.education.map(edu => {
            const graduatedDisplay = edu.expected ? `${edu.graduated} (expected)` : edu.graduated;
            const linkHtml = edu.url ? `<a href="${edu.url}" target="_blank" rel="noopener" class="education-link">Learn more →</a>` : '';
            
            return `
                <article class="education-card">
                    <div class="education-card-header">
                        <h3 class="education-title">${edu.title}</h3>
                        <p class="education-school">${edu.school}</p>
                        ${edu.location ? `<p class="education-location">${edu.location}</p>` : ''}
                    </div>
                    <div class="education-dates">${edu.enrolled} – ${graduatedDisplay}</div>
                    ${linkHtml}
                </article>
            `;
        }).join('');
    } catch (err) {
        console.error('Failed to load education:', err);
    }
}

// Load config and show/hide sections
async function loadConfig() {
    try {
        const res = await fetch('/json/config.json');
        const data = await res.json();
        
        // Define section order for consistent iteration
        const sectionOrder = ['projects', 'writing', 'photography', 'skills', 'education', 'about', 'footer'];
        
        // Show/hide each section based on config
        sectionOrder.forEach(sectionId => {
            // Skip config processing for footer (always shown)
            if (sectionId === 'footer') {
                // Ensure footer element exists
                const footer = document.getElementById(sectionId);
                if (footer) {
                    footer.classList.remove('section-hidden');
                }
                return;
            }
            
            const config = data.sections[sectionId];
            if (!config) return;
            
            const section = document.getElementById(sectionId);
            const navLink = document.querySelector(`a[href="#${sectionId}"]`);
            
            if (section) {
                if (config.show) {
                    section.classList.remove('section-hidden');
                } else {
                    section.classList.add('section-hidden');
                }
                
                // Update section title if provided
                if (config.title) {
                    const titleEl = section.querySelector('.section-title');
                    if (titleEl) {
                        titleEl.textContent = config.title;
                    }
                }
                
                // Handle resume button visibility for about section
                if (sectionId === 'about') {
                    const resumeBtn = section.querySelector('.resume-btn');
                    if (resumeBtn) {
                        resumeBtn.style.display = config.showResume === false ? 'none' : '';
                    }
                }
            }
            
            // Hide nav link if section is hidden
            if (navLink) {
                navLink.style.display = config.show ? '' : 'none';
            }
        });
        
        // Apply alternating backgrounds to visible sections
        const visibleSections = sectionOrder
            .filter(id => id === 'footer' || data.sections[id]?.show)
            .map(id => document.getElementById(id))
            .filter(Boolean);
        
        visibleSections.forEach((section, index) => {
            if (index % 2 === 1) {
                section.classList.add('section-alt');
            } else {
                section.classList.remove('section-alt');
            }
        });
        
    } catch (err) {
        console.error('Failed to load config:', err);
        // On error, show all sections as fallback
        document.querySelectorAll('.section-hidden').forEach(section => {
            section.classList.remove('section-hidden');
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    loadProjects();
    loadFooterProjects();
    loadResearch();
    loadPhotos();
    loadSkills();
    loadEducation();
});
