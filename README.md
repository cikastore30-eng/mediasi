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

## 3. Pakai
Buka web -> klik "Admin" -> tempel token -> isi link MediaFire -> Simpan.
Publik melihat link baru dalam +-1 menit (GitHub Pages perlu memperbarui situs).
Klik "Keluar Admin" untuk menghapus token dari perangkat.
