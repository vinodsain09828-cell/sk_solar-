/**
 * SK SOLAR BIKANER - Main Website Script
 * Handles navigation, FAQ accordions, lightbox, contact form WhatsApp integration, and year updates.
 */
(() => {
  // Update all copyright years
  document.querySelectorAll('.year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Mobile Navigation Toggle
  const menuButton = document.querySelector('.menu-btn');
  const navigation = document.querySelector('.nav-links');

  if (menuButton && navigation) {
    const setMenuOpen = (open) => {
      navigation.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menuButton.innerHTML = open ? '&times;' : '&#9776;';
    };

    menuButton.addEventListener('click', () => {
      setMenuOpen(!navigation.classList.contains('open'));
    });

    navigation.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenuOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navigation.classList.contains('open')) {
        setMenuOpen(false);
        menuButton.focus();
      }
    });
  }

  // Back to Top Button
  const topButton = document.querySelector('.to-top');
  if (topButton) {
    window.addEventListener('scroll', () => {
      topButton.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    topButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');

      // Close other open items
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-button').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !wasOpen);
      btn.setAttribute('aria-expanded', String(!wasOpen));
    });
  });

  // Project Gallery Filter (on projects.html)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.gallery-card');

  if (filterButtons.length && projectItems.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        projectItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightbox for Project Images
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close') || lightbox.querySelector('button');

    const openLightbox = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt || 'SK Solar Installation';
      lightboxImg.hidden = false;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.hidden = true;
      document.body.style.overflow = '';
    };

    document.querySelectorAll('[data-lightbox]').forEach(el => {
      el.addEventListener('click', () => {
        const img = el.querySelector('img');
        if (img) openLightbox(img.src, img.alt);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  // Contact Form - Direct WhatsApp Lead Submission for SK Solar Bikaner (+91 90013 19866)
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    // Check URL parameters if redirected from solar calculator
    const params = new URLSearchParams(window.location.search);
    if (params.has('system') && contactForm.elements.requirement) {
      contactForm.elements.requirement.value = `Namaste SK Solar, maine apni property ke liye ${params.get('system')} kW solar system calculate kiya hai. Mera monthly bill: ₹${params.get('bill') || ''}. Kripya exact subsidy estimate aur site survey ki jaankari dein.`;
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.elements.name ? contactForm.elements.name.value.trim() : '';
      const phone = contactForm.elements.phone ? contactForm.elements.phone.value.trim() : '';
      const service = contactForm.elements.service ? contactForm.elements.service.value : 'Rooftop Solar';
      const requirement = contactForm.elements.requirement ? contactForm.elements.requirement.value.trim() : '';
      const statusDiv = document.querySelector('#formStatus');

      // Validation
      const phoneDigits = phone.replace(/\D/g, '');
      if (!name) {
        showStatus('कृपया अपना पूरा नाम दर्ज करें।', 'error');
        contactForm.elements.name?.focus();
        return;
      }
      if (!phoneDigits || phoneDigits.length < 10) {
        showStatus('कृपया 10 अंकों का valid mobile number दर्ज करें।', 'error');
        contactForm.elements.phone?.focus();
        return;
      }

      showStatus('WhatsApp में आपका message तैयार है—भेजने के लिए Send दबाएं।', 'success');

      // Build structured message for SK Solar Bikaner
      const msg = [
        '⚡ *नई SOLAR ENQUIRY - SK SOLAR BIKANER*',
        '━━━━━━━━━━━━━━━━━━━━━━━━━',
        `👤 *नाम / Name:* ${name}`,
        `📞 *फोन / Phone:* ${phone}`,
        `☀️ *सेवा / Service:* ${service}`,
        `📍 *जगह / Location:* Bikaner / Rajasthan`,
        requirement ? `📝 *जरूरत / Requirement:* ${requirement}` : '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━',
        '_SK Solar website के contact form से भेजा गया_'
      ].filter(Boolean).join('\n');

      const waUrl = `https://wa.me/919001319866?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    });

    function showStatus(text, type) {
      const statusDiv = document.querySelector('#formStatus');
      if (!statusDiv) return;
      statusDiv.textContent = text;
      statusDiv.className = type === 'error' ? 'error-text' : 'success-text';
      statusDiv.style.display = 'block';
    }
  }
})();
