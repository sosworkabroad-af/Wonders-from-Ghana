Wonders from Ghana - registration page
=======================================

index.html
  The registration page. Single file; the four book covers are built in.
  Upload it to any web host (GitHub Pages, Netlify, wondersfromghana.com).
  Registrations go to the "Wonders Registrations" Google Sheet, and
  confirmation emails are sent from info@nekotechcenter.org.

wonders-google-sheet-script.gs
  Copy of the Apps Script already installed in the Google Sheet.
  Keep it as a backup. If you change the script, redeploy with
  Deploy > Manage deployments > edit > Version: New version
  so the web app URL stays the same.

Settings inside index.html (search for "contact:")
  Email shown to visitors:  info@nekotechcenter.org
  WhatsApp fallback:        +1 940 977 1707
  Sheet web app URL:        endpoint: "https://script.google.com/macros/s/.../exec"

Hosting
  The same index.html works on computers, tablets and phones.
  GitHub Pages: upload index.html (and .nojekyll) to a public repository,
  then Settings > Pages > Branch: main, folder: /(root) > Save.
  Other hosts: upload index.html to the folder where the page should live.
