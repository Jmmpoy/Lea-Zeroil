# Léa Zéroil

Custom HTML, CSS and JS assets for the Léa Zéroil website. Live: [lea-zeroil.vercel.app](https://lea-zeroil.vercel.app)

## Structure

- `public/`: stylesheets and scripts per page (Homepage, Product, Collection, Collaboration, About, Contact, Cart, Galerie-Oasis...), served as static files from Vercel.
- `footer.html`, `onlineFooter.css`, `onlineFooter.js`: the site footer.

The site loads these files by URL (for example `https://lea-zeroil.vercel.app/footer.css`), so a push to `main` updates the live styling.
