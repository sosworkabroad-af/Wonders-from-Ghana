/**
 * Wonders from Ghana — registration receiver
 * Saves each registration from the "Join the Wonders Family" page into this
 * Google Sheet, emails a confirmation to the person who registered, and
 * emails a copy to the team.
 *
 * Paste this into Extensions → Apps Script of the Google Sheet, then deploy
 * as a Web app (Execute as: Me, Who has access: Anyone).
 */

const ORG_NAME    = 'Wonders from Ghana';
const TEAM_EMAIL  = 'info@nekotechcenter.org';   // gets a copy of every registration
const WHATSAPP    = '+1 (940) 977-1707';
const SHEET_NAME  = 'Registrations';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    const fields = d.fields || {};

    // 1. Save to the sheet (adds new columns automatically when needed)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    let headers = sh.getLastRow() > 0
      ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0]
      : [];
    if (headers.length === 0) {
      headers = ['Received', 'Reference', 'Registering as', 'Status'];
      sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
    Object.keys(fields).forEach(function (k) {
      if (headers.indexOf(k) === -1) {
        headers.push(k);
        sh.getRange(1, headers.length).setValue(k).setFontWeight('bold');
      }
    });
    const row = headers.map(function (h) {
      if (h === 'Received') return new Date();
      if (h === 'Reference') return d.ref || '';
      if (h === 'Registering as') return d.type || '';
      if (h === 'Status') return 'New';
      return fields[h] || '';
    });
    sh.appendRow(row);

    // 2. Confirmation email to the person who registered
    if (d.email) {
      const greeting = d.name ? 'Dear ' + d.name + ',' : 'Hello,';
      const body =
        greeting + '\n\n' +
        'Thank you for registering with ' + ORG_NAME + '. We have received your registration.\n\n' +
        'Your reference number: ' + d.ref + '\n' +
        'Registering as: ' + d.type + '\n\n' +
        'What happens next\n' +
        '1. Our team reviews your registration.\n' +
        '2. We send you an invoice for your books or ARISE sets, with delivery details. Nothing is charged before you approve it.\n' +
        '3. We welcome you into the Wonders community.\n\n' +
        'Your details\n' +
        Object.keys(fields).map(function (k) { return k + ': ' + fields[k]; }).join('\n') + '\n\n' +
        'Questions? Reply to this email or message us on WhatsApp at ' + WHATSAPP + '.\n' +
        'Please quote your reference number ' + d.ref + '.\n\n' +
        'With warm regards,\n' + ORG_NAME + '\nwondersfromghana.com';
      MailApp.sendEmail({
        to: d.email,
        replyTo: TEAM_EMAIL,
        name: ORG_NAME,
        subject: ORG_NAME + ': registration ' + d.ref + ' received',
        body: body
      });
    }

    // 3. Copy to the team
    MailApp.sendEmail({
      to: TEAM_EMAIL,
      replyTo: d.email || TEAM_EMAIL,
      name: ORG_NAME + ' registrations',
      subject: 'New registration ' + d.ref + ' (' + d.type + ')',
      body: d.text || JSON.stringify(d, null, 2)
    });

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/** Run this once from the editor to grant permissions and test the setup. */
function testSetup() {
  doPost({ postData: { contents: JSON.stringify({
    ref: 'WFG-TEST01', type: 'School', email: TEAM_EMAIL, name: 'Test',
    fields: { 'School name': 'Test School', 'Country': 'Ghana', 'Email': TEAM_EMAIL },
    text: 'Test registration'
  }) } });
}
