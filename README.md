# SK Solar Bikaner — Official Multi-Page Website

A high-performance, modern, multi-page solar energy website for **SK SOLAR**, Bikaner, Rajasthan. Registered vendor under the central government's **PM Surya Ghar: Muft Bijli Yojana**.

## Business Information (Justdial Listing)
- **Business Name:** SK Solar (एस के सोलर / SK Solar Company)
- **Address:** B/48, Norwa House, Near Baba Ramdev Mandir, Indira Colony, Major Purnasingh Nagar, Bikaner, Rajasthan — 334001
- **Landmark:** Near Baba Ramdev Mandir, Indira Colony / FCI Godown Road
- **Phone / Mobile:** `+91 90013 19866` / `090013 19866`
- **WhatsApp Direct:** `https://wa.me/919001319866`
- **Justdial Profile:** [SK Solar Justdial Listing](https://www.justdial.com/Bikaner/SK-SOLAR-Near-Baba-Ramdev-Mandir-Indira-Colony/9999PX151-X151-250303113528-Y3F2_BZDET)
- **Rating:** 4.8 / 5.0 (Verified Vendor)
- **Working Hours:** Monday to Saturday: 9:00 AM – 7:00 PM (Sunday: On-Call)

---

## Theme Colors & Fonts (कलर व फॉन्ट)

To customize the website theme, edit the CSS variables inside `:root` in [assets/styles.css](assets/styles.css):

```css
:root {
  --primary: #064e3b;          /* Main brand color */
  --primary-dark: #022c22;     /* Dark shade for header/footer */
  --accent: #10b981;           /* Buttons & high-visibility highlights */
  --accent-hover: #059669;     /* Button hover state */
  --bg-page: #f4f8f6;          /* Page background */
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --radius-card: 18px;         /* Corner roundness */
}
```

---

## Pages Included
- **Home (`index.html`):** Hero section with PM Surya Ghar preview, stats counter, core services, why choose SK Solar, Justdial verified reviews, interactive FAQ, and CTA.
- **About Us (`about.html`):** Company background in Bikaner, technical standards, component quality, and values.
- **Services (`services.html`):** 5 detailed service cards with direct WhatsApp enquiry buttons.
- **Projects (`projects.html`):** Installation gallery with interactive filter tabs (All, Residential, Commercial, Agricultural) and lightbox modal.
- **Solar Calculator (`calculator.html`):** PM Surya Ghar subsidy calculator (₹33k for 1kW, ₹66k for 2kW, ₹78k for 3kW+), 25-year ROI, monthly savings, and direct WhatsApp estimate generator.
- **Contact Us (`contact.html`):** Complete address, phone, directions guide, and WhatsApp enquiry form.
- **404 Page (`404.html`):** Clean page-not-found layout.

---

## Run Locally

```powershell
# In PowerShell:
python -m http.server 8000
# or
npx serve .
```
Then open `http://localhost:8000` in your web browser.
