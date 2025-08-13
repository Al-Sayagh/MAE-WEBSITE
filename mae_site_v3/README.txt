This folder contains the third version of the Mae Basiratmand website.

To run locally:
1. Open `index.html` in your browser. All styling and scripts are self‑contained.
2. Replace the placeholders in `index.html` and `script.js`:
   - Replace `https://calendly.com/your-calendly/intro-call` and `guest-lecture` with your own Calendly links.
   - Replace the `action` attributes in the newsletter and contact forms with your FormSubmit email (or another backend). The current address will show a demo message instead of submitting.
3. Edit the texts in English/French via the translation object in `script.js` or by changing the HTML defaults.
4. Deploy the folder to any static hosting (Netlify, GitHub Pages, Vercel) by uploading all files.

Customization:
- Colors can be adjusted in `styles.css` by editing the CSS variables under `:root`.
- Add or remove resources by adding files into the `assets` folder and updating the links in `index.html`.

Accessibility and performance have been considered: the site includes skip links, high contrast colors, ARIA attributes for the language switcher, and lazy reveal animations using IntersectionObserver.