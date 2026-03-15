const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace standard mojibake
html = html.replace(/â€"/g, '—');
html = html.replace(/â€“/g, '—');
html = html.replace(/â€”/g, '—');
html = html.replace(/Â·/g, '•');
html = html.replace(/Â©/g, '©');
html = html.replace(/A\s*/g, '•');
html = html.replace(/\?"/g, '—');

// Also explicitly fix known badly encoded strings based on previous PS output
html = html.replace(/Kutumb A IGNOU/g, 'Kutumb • IGNOU');
html = html.replace(/Creative Illustrator A Brand Designer/g, 'Creative Illustrator & Brand Designer');
html = html.replace(/Ac 2026/g, '© 2026');
html = html.replace(/&nbsp;A&nbsp;/g, '&nbsp;•&nbsp;');

// Replace broken Behance image on Ad & Banner Design 
// User mentioned Behance thumbnail was broken on one of the items
// Wait, the actual issue was that one link didn't get updated properly.
// Let's fix the Behance icon string universally again just in case
let bImgMatch = html.match(/<img src="data:image\/png;base64,[^"]+" alt="Behance" class="icon-img">/);
if(bImgMatch) {
    let bImg = bImgMatch[0];
    html = html.replace(/<img src="" alt="Behance" class="icon-img">/g, bImg);
    html = html.replace(/<img src="icon_behance.png" alt="Behance" class="icon-img">/g, bImg);
    // User had a broken img element with alt="Behance" maybe?
    html = html.replace(/<img src="[^"]*" alt="Behance"[^>]*>/g, bImg);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done');
