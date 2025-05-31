/**
 * Configuration Loader for MyResume Website
 * 
 * This script loads the configuration from config.json and applies it to the website.
 * It updates all configurable elements like text, images, and settings across the site.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Fetch the configuration file
    fetch('config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load configuration file');
            }
            return response.json();
        })
        .then(config => {
            // Apply the configuration to the website
            applyConfiguration(config);
        })
        .catch(error => {
            console.error('Error loading configuration:', error);
        });

    /**
     * Apply the loaded configuration to the website
     * @param {Object} config - The configuration object
     */
    function applyConfiguration(config) {
        // Apply site metadata
        applySiteMetadata(config.site);

        // Apply personal information
        applyPersonalInfo(config.personal);

        // Apply navigation
        applyNavigation(config.navigation);

        // Apply social links
        applySocialLinks(config.social);

        // Apply sections
        applySections(config.sections);

        // Apply footer
        applyFooter(config.footer);

        console.log('Configuration successfully applied to the website');
    }

    /**
     * Apply site metadata
     * @param {Object} siteConfig - The site metadata configuration
     */    function applySiteMetadata(siteConfig) {
        // Update page title
        document.title = siteConfig.title;

        // Update meta tags
        document.querySelector('meta[name="description"]').content = siteConfig.description;
        document.querySelector('meta[name="keywords"]').content = siteConfig.keywords;

        // Update favicon and apple touch icon
        document.querySelector('link[rel="icon"]').href = siteConfig.favicon;
        document.querySelector('link[rel="apple-touch-icon"]').href = siteConfig.appleTouchIcon;

        // Set language and text direction
        if (siteConfig.language) {
            document.documentElement.lang = siteConfig.language;
        }

        if (siteConfig.direction) {
            document.documentElement.dir = siteConfig.direction;
            // If RTL, ensure Bootstrap RTL is loaded
            if (siteConfig.direction === 'rtl') {
                // Check if RTL CSS is already loaded
                const rtlCssLoaded = Array.from(document.querySelectorAll('link'))
                    .some(link => link.href.includes('bootstrap.rtl.min.css'));

                if (!rtlCssLoaded) {
                    // Replace standard Bootstrap with RTL version
                    const bootstrapLink = document.querySelector('link[href*="bootstrap.min.css"]');
                    if (bootstrapLink) {
                        bootstrapLink.href = bootstrapLink.href.replace('bootstrap.min.css', 'bootstrap.rtl.min.css');
                    }
                }
            }
        }
    }

    /**
     * Apply personal information
     * @param {Object} personalConfig - The personal information configuration
     */
    function applyPersonalInfo(personalConfig) {
        // Update name and profession
        document.querySelectorAll('.hero h2, .sitename').forEach(element => {
            element.textContent = personalConfig.name;
        });

        // Update typed items
        const typedElement = document.querySelector('.typed');
        if (typedElement) {
            typedElement.dataset.typedItems = personalConfig.profession.typedItems.join(', ');

            // Reinitialize Typed.js if it's already initialized
            if (window.typedInstance) {
                window.typedInstance.destroy();
            }

            // Create a new Typed instance
            window.typedInstance = new Typed('.typed', {
                strings: personalConfig.profession.typedItems,
                loop: true,
                typeSpeed: 100,
                backSpeed: 50,
                backDelay: 2000
            });
        }

        // Update hero background image
        const heroSection = document.querySelector('#hero');
        if (heroSection) {
            heroSection.querySelector('img').src = personalConfig.heroBgImage;
        }

        // Update profile image
        const profileImage = document.querySelector('.about .img-fluid');
        if (profileImage) {
            profileImage.src = personalConfig.profileImage;
        }

        // Update about section content
        const aboutContent = document.querySelector('.about .content');
        if (aboutContent) {
            aboutContent.querySelector('h2').textContent = personalConfig.about.title;
            aboutContent.querySelector('.fst-italic').textContent = personalConfig.about.subtitle;
            aboutContent.querySelector('p.py-3').textContent = personalConfig.about.description;
        }

        // Update personal details
        personalConfig.details.forEach(detail => {
            const detailElement = document.querySelector(`.about .content li strong:contains("${detail.label}")`);
            if (detailElement) {
                detailElement.nextElementSibling.textContent = detail.value;
            }
        });

        // Update contact information
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            // Address
            const addressItem = contactSection.querySelector('.info-item i.bi-geo-alt').parentElement;
            addressItem.querySelector('p').textContent = personalConfig.contactInfo.address;

            // Phone
            const phoneItem = contactSection.querySelector('.info-item i.bi-telephone').parentElement;
            phoneItem.querySelector('p').textContent = personalConfig.contactInfo.phone;

            // Email
            const emailItem = contactSection.querySelector('.info-item i.bi-envelope').parentElement;
            emailItem.querySelector('p').textContent = personalConfig.contactInfo.email;

            // Update PHP email receiving address by modifying contact.php
            updateContactFormEmail(personalConfig.contactInfo.receivingEmail);
        }
    }

    /**
     * Apply navigation configuration
     * @param {Array} navConfig - The navigation configuration
     */
    function applyNavigation(navConfig) {
        const navMenu = document.querySelector('#navmenu ul');
        if (navMenu) {
            // Clear existing navigation
            navMenu.innerHTML = '';

            // Add navigation items
            navConfig.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${item.link}" class="${index === 0 ? 'active' : ''}">
                    <i class="bi ${item.icon} navicon"></i><span>${item.name}</span>
                </a>`;
                navMenu.appendChild(li);
            });
        }
    }

    /**
     * Apply social links configuration
     * @param {Object} socialConfig - The social links configuration
     */
    function applySocialLinks(socialConfig) {
        const heroSocialLinks = document.querySelector('.hero .social-links');
        const footerSocialLinks = document.querySelector('footer .social-links');

        if (heroSocialLinks) {
            heroSocialLinks.innerHTML = '';

            // Add enabled social links to hero
            Object.keys(socialConfig).forEach(platform => {
                if (socialConfig[platform].enabled) {
                    heroSocialLinks.innerHTML += `<a href="${socialConfig[platform].link}"><i class="bi ${socialConfig[platform].icon}"></i></a>`;
                }
            });
        }

        if (footerSocialLinks) {
            footerSocialLinks.innerHTML = '';

            // Add enabled social links to footer
            Object.keys(socialConfig).forEach(platform => {
                if (socialConfig[platform].enabled) {
                    footerSocialLinks.innerHTML += `<a href="${socialConfig[platform].link}"><i class="bi ${socialConfig[platform].icon}"></i></a>`;
                }
            });
        }
    }

    /**
     * Apply sections configuration
     * @param {Object} sectionsConfig - The sections configuration
     */
    function applySections(sectionsConfig) {
        // Apply About section
        applyAboutSection(sectionsConfig.about);

        // Apply Stats section
        applyStatsSection(sectionsConfig.stats);

        // Apply Skills section
        applySkillsSection(sectionsConfig.skills);

        // Apply Resume section
        applyResumeSection(sectionsConfig.resume);

        // Apply Portfolio section
        applyPortfolioSection(sectionsConfig.portfolio);

        // Apply Services section
        applyServicesSection(sectionsConfig.services);

        // Apply Testimonials section
        applyTestimonialsSection(sectionsConfig.testimonials);

        // Apply Contact section
        applyContactSection(sectionsConfig.contact);
    }

    /**
     * Apply About section configuration
     * @param {Object} aboutConfig - The About section configuration
     */
    function applyAboutSection(aboutConfig) {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            // Toggle section visibility
            aboutSection.style.display = aboutConfig.enabled ? 'block' : 'none';

            // Update section title and description
            const sectionTitle = aboutSection.querySelector('.section-title');
            if (sectionTitle) {
                sectionTitle.querySelector('h2').textContent = aboutConfig.title;
                sectionTitle.querySelector('p').textContent = aboutConfig.description;
            }
        }
    }

    /**
     * Apply Stats section configuration
     * @param {Object} statsConfig - The Stats section configuration
     */
    function applyStatsSection(statsConfig) {
        const statsSection = document.querySelector('#stats');
        if (statsSection) {
            // Toggle section visibility
            statsSection.style.display = statsConfig.enabled ? 'block' : 'none';

            // Update stats items
            const statsItems = statsSection.querySelectorAll('.col-lg-3');
            if (statsItems.length > 0 && statsConfig.items) {
                statsConfig.items.forEach((item, index) => {
                    if (index < statsItems.length) {
                        const statsItem = statsItems[index];
                        statsItem.querySelector('i').className = `bi ${item.icon}`;
                        const counterElement = statsItem.querySelector('.purecounter');
                        counterElement.dataset.purecounterEnd = item.count;
                        statsItem.querySelector('p').textContent = item.label;
                    }
                });
            }
        }
    }

    /**
     * Apply Skills section configuration
     * @param {Object} skillsConfig - The Skills section configuration
     */
    function applySkillsSection(skillsConfig) {
        const skillsSection = document.querySelector('#skills');
        if (skillsSection) {
            // Toggle section visibility
            skillsSection.style.display = skillsConfig.enabled ? 'block' : 'none';

            // Update section title and description
            const sectionTitle = skillsSection.querySelector('.section-title');
            if (sectionTitle) {
                sectionTitle.querySelector('h2').textContent = skillsConfig.title;
                sectionTitle.querySelector('p').textContent = skillsConfig.description;
            }

            // Update skills
            const skillsItems = skillsSection.querySelectorAll('.progress');
            if (skillsItems.length > 0 && skillsConfig.items) {
                skillsConfig.items.forEach((item, index) => {
                    if (index < skillsItems.length) {
                        const skillItem = skillsItems[index];
                        skillItem.querySelector('.skill span').textContent = item.name;
                        skillItem.querySelector('.val').textContent = `${item.value}%`;
                        skillItem.querySelector('.progress-bar').setAttribute('aria-valuenow', item.value);
                        skillItem.querySelector('.progress-bar').style.width = `${item.value}%`;
                    }
                });
            }
        }
    }

    /**
     * Apply Resume section configuration
     * @param {Object} resumeConfig - The Resume section configuration
     */
    function applyResumeSection(resumeConfig) {
        const resumeSection = document.querySelector('#resume');
        if (resumeSection) {
            // Toggle section visibility
            resumeSection.style.display = resumeConfig.enabled ? 'block' : 'none';

            // Update section title and description
            const sectionTitle = resumeSection.querySelector('.section-title');
            if (sectionTitle) {
                sectionTitle.querySelector('h2').textContent = resumeConfig.title;
                sectionTitle.querySelector('p').textContent = resumeConfig.description;
            }

            // Update resume summary
            const summaryContent = resumeSection.querySelector('.resume-item p');
            if (summaryContent) {
                summaryContent.textContent = resumeConfig.summary;
            }

            // Update education items
            const educationContainer = resumeSection.querySelector('.col-lg-6:first-child');
            if (educationContainer && resumeConfig.education) {
                // Clear existing items (except the title)
                const educationTitle = educationContainer.querySelector('h3');
                educationContainer.innerHTML = '';
                educationContainer.appendChild(educationTitle);

                // Add education items
                resumeConfig.education.forEach(edu => {
                    const item = document.createElement('div');
                    item.className = 'resume-item';
                    item.innerHTML = `
                        <h4>${edu.degree}</h4>
                        <h5>${edu.period}</h5>
                        <p><em>${edu.institution}</em></p>
                        <p>${edu.description}</p>
                    `;
                    educationContainer.appendChild(item);
                });
            }

            // Update experience items
            const experienceContainer = resumeSection.querySelector('.col-lg-6:last-child');
            if (experienceContainer && resumeConfig.experience) {
                // Clear existing items (except the title)
                const experienceTitle = experienceContainer.querySelector('h3');
                experienceContainer.innerHTML = '';
                experienceContainer.appendChild(experienceTitle);

                // Add experience items
                resumeConfig.experience.forEach(exp => {
                    const item = document.createElement('div');
                    item.className = 'resume-item';
                    item.innerHTML = `
                        <h4>${exp.position}</h4>
                        <h5>${exp.period}</h5>
                        <p><em>${exp.company}</em></p>
                    `;

                    // Add bullet points if available
                    if (exp.bullets && exp.bullets.length > 0) {
                        const ul = document.createElement('ul');
                        exp.bullets.forEach(bullet => {
                            const li = document.createElement('li');
                            li.textContent = bullet;
                            ul.appendChild(li);
                        });
                        item.appendChild(ul);
                    } else {
                        // Add description as paragraph
                        const p = document.createElement('p');
                        p.textContent = exp.description;
                        item.appendChild(p);
                    }

                    experienceContainer.appendChild(item);
                });
            }
        }
    }

    /**
     * Apply Portfolio section configuration
     * @param {Object} portfolioConfig - The Portfolio section configuration
     */
    function applyPortfolioSection(portfolioConfig) {
        const portfolioSection = document.querySelector('#portfolio');
        if (portfolioSection) {
            // Toggle section visibility
            portfolioSection.style.display = portfolioConfig.enabled ? 'block' : 'none';

            // Update section title and description
            const sectionTitle = portfolioSection.querySelector('.section-title');
            if (sectionTitle) {
                sectionTitle.querySelector('h2').textContent = portfolioConfig.title;
                sectionTitle.querySelector('p').textContent = portfolioConfig.description;
            }

            // Update portfolio filters
            const filtersContainer = portfolioSection.querySelector('.portfolio-flters');
            if (filtersContainer && portfolioConfig.filters) {
                filtersContainer.innerHTML = '';

                portfolioConfig.filters.forEach((filter, index) => {
                    const li = document.createElement('li');
                    li.textContent = filter;
                    if (index === 0) li.className = 'filter-active';
                    li.dataset.filter = index === 0 ? '*' : `.filter-${filter.toLowerCase()}`;
                    filtersContainer.appendChild(li);
                });
            }

            // Update portfolio items
            const portfolioContainer = portfolioSection.querySelector('.portfolio-container');
            if (portfolioContainer && portfolioConfig.items) {
                portfolioContainer.innerHTML = '';

                portfolioConfig.items.forEach(item => {
                    const portfolioItem = document.createElement('div');
                    portfolioItem.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-${item.category.toLowerCase()}`;
                    portfolioItem.innerHTML = `
                        <img src="${item.image}" class="img-fluid" alt="">
                        <div class="portfolio-info">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                            <a href="${item.image}" title="${item.title}" data-gallery="portfolio-gallery-${item.category.toLowerCase()}" class="glightbox preview-link"><i class="bi bi-zoom-in"></i></a>
                            <a href="${item.detailsLink}" title="More Details" class="details-link"><i class="bi bi-link-45deg"></i></a>
                        </div>
                    `;
                    portfolioContainer.appendChild(portfolioItem);
                });

                // Reinitialize isotope if it's already initialized
                if (window.portfolioIsotope) {
                    window.portfolioIsotope.destroy();
                    initPortfolio();
                }
            }
        }
    }

    /**
     * Apply Services section configuration
     * @param {Object} servicesConfig - The Services section configuration
     */
    function applyServicesSection(servicesConfig) {
        const servicesSection = document.querySelector('#services');
        if (servicesSection) {
            // Toggle section visibility
            servicesSection.style.display = servicesConfig.enabled ? 'block' : 'none';

            // Update section title and description
            const sectionTitle = servicesSection.querySelector('.section-title');
            if (sectionTitle) {
                sectionTitle.querySelector('h2').textContent = servicesConfig.title;
                sectionTitle.querySelector('p').textContent = servicesConfig.description;
            }

            // Update services items
            const servicesContainer = servicesSection.querySelector('.row.gy-4');
            if (servicesContainer && servicesConfig.items) {
                servicesContainer.innerHTML = '';

                servicesConfig.items.forEach((item, index) => {
                    const serviceItem = document.createElement('div');
                    serviceItem.className = 'col-lg-4 col-md-6';
                    serviceItem.setAttribute('data-aos', 'fade-up');
                    serviceItem.setAttribute('data-aos-delay', (index + 1) * 100);

                    serviceItem.innerHTML = `
                        <div class="service-item ${item.color} position-relative">
                            <div class="icon">
                                <svg width="100" height="100" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke="none" stroke-width="0" fill="#f5f5f5" d="M300,521.0016835830174C376.1290562159157,517.8887921683347,466.0731472004068,529.7835943286574,510.70327084640275,468.03025145048787C554.3714126377745,407.6079735673963,508.03601936045806,328.9844924480964,491.2728898941984,256.3432110539036C474.5976632858925,184.082847569629,479.9380746630129,96.60480741107993,416.23090153303,58.64404602377083C348.86323505073057,18.502131276798302,261.93793281208167,40.57373210992963,193.5410806939664,78.93577620505333C130.42746243093433,114.334589627462,98.30271207620316,179.96522072025542,76.75703585869454,249.04625023123273C51.97151888228291,328.5150500222984,13.704378332031375,421.85034740162234,66.52175969318436,486.19268352777647C119.04800174914682,550.1803526380478,217.28368757567262,524.383925680826,300,521.0016835830174"></path>
                                </svg>
                                <i class="bi ${item.icon}"></i>
                            </div>
                            <a href="#" class="stretched-link">
                                <h3>${item.title}</h3>
                            </a>
                            <p>${item.description}</p>
                        </div>
                    `;

                    servicesContainer.appendChild(serviceItem);
                });
            }
        }
    }

    /**
     * Apply Testimonials section configuration
     * @param {Object} testimonialsConfig - The Testimonials section configuration
     */
    function applyTestimonialsSection(testimonialsConfig) {
        const testimonialsSection = document.querySelector('#testimonials');
        if (testimonialsSection) {
            // Toggle section visibility
            testimonialsSection.style.display = testimonialsConfig.enabled ? 'block' : 'none';

            // Update section title and description
            const sectionTitle = testimonialsSection.querySelector('.section-title');
            if (sectionTitle) {
                sectionTitle.querySelector('h2').textContent = testimonialsConfig.title;
                sectionTitle.querySelector('p').textContent = testimonialsConfig.description;
            }

            // Update testimonial items
            const testimonialsContainer = testimonialsSection.querySelector('.testimonials-slider .swiper-wrapper');
            if (testimonialsContainer && testimonialsConfig.items) {
                testimonialsContainer.innerHTML = '';

                testimonialsConfig.items.forEach(item => {
                    const testimonialItem = document.createElement('div');
                    testimonialItem.className = 'swiper-slide';
                    testimonialItem.innerHTML = `
                        <div class="testimonial-item">
                            <img src="${item.image}" class="testimonial-img" alt="">
                            <h3>${item.name}</h3>
                            <h4>${item.position}</h4>
                            <div class="stars">
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                            </div>
                            <p>
                                <i class="bi bi-quote quote-icon-left"></i>
                                ${item.testimonial}
                                <i class="bi bi-quote quote-icon-right"></i>
                            </p>
                        </div>
                    `;

                    testimonialsContainer.appendChild(testimonialItem);
                });

                // Reinitialize Swiper if it's already initialized
                if (window.testimonialsSlider) {
                    window.testimonialsSlider.destroy();
                    initTestimonialsSlider();
                }
            }
        }
    }

    /**
     * Apply Contact section configuration
     * @param {Object} contactConfig - The Contact section configuration
     */
    function applyContactSection(contactConfig) {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            // Toggle section visibility
            contactSection.style.display = contactConfig.enabled ? 'block' : 'none';

            // Update section title and description
            const sectionTitle = contactSection.querySelector('.section-title');
            if (sectionTitle) {
                sectionTitle.querySelector('h2').textContent = contactConfig.title;
                sectionTitle.querySelector('p').textContent = contactConfig.description;
            }

            // Update contact form submit path
            const contactForm = contactSection.querySelector('form.php-email-form');
            if (contactForm) {
                contactForm.action = contactConfig.formSubmitPath;
            }
        }
    }

    /**
     * Apply footer configuration
     * @param {Object} footerConfig - The footer configuration
     */
    function applyFooter(footerConfig) {
        const footer = document.querySelector('#footer');
        if (footer) {
            // Update copyright info
            const copyright = footer.querySelector('.copyright strong');
            if (copyright) {
                copyright.textContent = footerConfig.copyright;
            }

            // Update footer description
            const description = footer.querySelector('p');
            if (description) {
                description.textContent = footerConfig.description;
            }
        }
    }

    /**
     * Update the email address in the contact.php file
     * Note: This function can only indicate a need to update the file,
     * actual file modification would require server-side code
     * @param {string} email - The new receiving email address
     */
    function updateContactFormEmail(email) {
        console.log(`Note: To update the receiving email in contact.php to "${email}", you'll need to manually edit the file or use a server-side script.`);
    }

    /**
     * jQuery-like selector for text content
     * @param {string} selector - The selector to match
     * @param {string} text - The text to match
     * @returns {Element} - The found element
     */
    Element.prototype.contains = function (text) {
        return this.textContent.includes(text);
    };

    /**
     * Initialize portfolio isotope and lightbox
     */
    function initPortfolio() {
        if (document.querySelector('.portfolio-container')) {
            // Initialize isotope
            window.portfolioIsotope = new Isotope('.portfolio-container', {
                itemSelector: '.portfolio-item',
                layoutMode: 'masonry'
            });

            // Filter portfolio items on click
            document.querySelectorAll('.portfolio-flters li').forEach(filter => {
                filter.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelectorAll('.portfolio-flters li').forEach(f => {
                        f.classList.remove('filter-active');
                    });
                    this.classList.add('filter-active');
                    window.portfolioIsotope.arrange({
                        filter: this.getAttribute('data-filter')
                    });
                });
            });
        }

        // Initialize GLightbox
        if (document.querySelector('.glightbox')) {
            const portfolioLightbox = GLightbox({
                selector: '.glightbox'
            });
        }
    }

    /**
     * Initialize testimonials slider
     */
    function initTestimonialsSlider() {
        if (document.querySelector('.testimonials-slider')) {
            window.testimonialsSlider = new Swiper('.testimonials-slider', {
                speed: 600,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false
                },
                slidesPerView: 'auto',
                pagination: {
                    el: '.swiper-pagination',
                    type: 'bullets',
                    clickable: true
                },
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    }
                }
            });
        }
    }
});
