import fs from 'fs';
import path from 'path';

const directory = '.'; // Kök dizin

// Değiştirilecek tehlikeli kelimeler ve yerlerine gelecek zararsız kelimeler
const replacements = {
  "OpenClaw CLI": "OpenClaw CLI",
  "openclaw-cli": "openclaw-cli",
  "OpenClaw Team": "OpenClaw Team",
  "custom": "custom",
  "release": "release",
  "community": "community",
  "topluluk sürümü": "topluluk sürümü",
  "açık kaynaktan derlenmiş": "açık kaynaktan derlenmiş",
  "This is a community build": "This is a community build",
  "The full source code of OpenClaw Team's OpenClaw CLI CLI": "OpenClaw CLI Source Code",
};

// Klasörleri tarayan fonksiyon
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    // node_modules, .git veya derlenmiş klasörleri atla
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist') && !file.includes('build')) {
        results = results.concat(walk(file));
      }
    } else {
      // Sadece kod ve metin dosyalarını seç
      if (file.match(/\.(md|json|ts|tsx|js|jsx|txt|yml|yaml|sh)$/)) {
        results.push(file);
      }
    }
  });
  return results;
}

console.log("Dosyalar taranıyor...");
const files = walk(directory);
let degisenDosyaSayisi = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  for (const [key, value] of Object.entries(replacements)) {
    // Büyük/küçük harf duyarsız arama yap (gi)
    const regex = new RegExp(key, 'gi');
    if (regex.test(content)) {
      content = content.replace(regex, value);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✔️ Güncellendi: ${path.basename(file)}`);
    degisenDosyaSayisi++;
  }
});

console.log(`\n🎉 İşlem tamamlandı! Toplam ${degisenDosyaSayisi} dosya temizlendi.`);