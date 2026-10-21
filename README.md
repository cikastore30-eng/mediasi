# MediaFire APK Center (GitHub Pages)

Admin tambah link lewat web -> tersimpan ke repo GitHub -> tampil untuk publik. Tanpa edit kode.

## 1. Pasang di GitHub
1. Buat repo PUBLIC baru di GitHub (contoh: apk-center).
2. Upload `index.html` dan `links.json` ke root repo.
3. Repo -> Settings -> Pages -> Source: "Deploy from a branch" -> Branch: main, folder: / (root) -> Save.
4. Tunggu 1-2 menit. Web aktif di https://USERNAME.github.io/apk-center/

## 2. Buat token admin (sekali saja)
GitHub -> foto profil -> Settings -> Developer settings -> Personal access tokens
-> Fine-grained tokens -> Generate new token
- Repository access: Only select repositories -> pilih repo apk-center
- Permissions -> Repository permissions -> Contents: Read and write
- Generate, lalu salin token (github_pat_...). Simpan di tempat aman.

## 3. Setup admin (sekali saja, langsung dari web)
Buka web -> klik "Admin" -> ikuti petunjuk:
1. Tempel token GitHub tadi.
2. Buat password admin (minimal 12 karakter, panjang dan unik).
Web otomatis menyimpan token TERENKRIPSI ke file database.json di repo. Tidak perlu upload manual.

## 4. Pakai sehari-hari
Klik "Admin" -> masukkan PASSWORD (bukan token) -> isi link MediaFire -> Simpan.
Publik melihat link baru dalam +-1 menit.
Tombol "Ganti Password Admin" ada di panel admin.
Jika token kedaluwarsa, web akan menawarkan token baru saat login.

PENTING: database.json bisa dibuka siapa saja (repo public). Isinya token yang dienkripsi,
jadi KEKUATAN password = keamanan repo kamu. Pakai password panjang dan unik,
jangan password yang pernah dipakai di tempat lain.

## 5. SEO (agar mudah ditemukan)
1. Ganti `https://GANTI-USERNAME.github.io/apk-center/` dengan alamat web kamu di 3 file:
   `index.html`, `robots.txt`, `sitemap.xml` (pakai Find & Replace).
2. Upload semua file ke repo: index.html, links.json, robots.txt, sitemap.xml, og-image.png.
3. Daftarkan di Google Search Console (search.google.com/search-console):
   tambah properti URL prefix -> verifikasi (pilih "HTML tag", tempel meta tag ke <head> index.html)
   -> menu Sitemaps -> isi `sitemap.xml` -> Submit. Lalu "URL Inspection" -> "Request indexing".
4. Lakukan hal yang sama di Bing Webmaster Tools (bing.com/webmasters).
5. Bagikan link web di sosial media/grup agar ada backlink.
