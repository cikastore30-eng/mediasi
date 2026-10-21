# MediaFire APK Center — Firebase Edition (tanpa Pterodactyl)

Versi statis untuk GitHub Pages + Firebase Authentication + Cloud Firestore. Pengunjung bisa melihat daftar link publik tanpa login; hanya akun admin yang emailnya ditentukan dalam konfigurasi dan Firestore Rules yang dapat menambah, mengubah, atau menghapus posting.

## File penting
- `index.html` — halaman website (gunakan file ini di GitHub Pages).
- `firebase-config.js` — konfigurasi Firebase Web App dan email admin.
- `firestore.rules` — aturan keamanan database.
- `public/` — salinan aset halaman jika ingin tetap memakai struktur folder lama.

## Bagian A — Buat proyek Firebase
1. Buka https://console.firebase.google.com/ dan pilih **Create a project / Tambahkan project**.
2. Setelah proyek jadi, buka **Project settings** (ikon roda gigi) → **General** → **Your apps** → ikon web `</>`.
3. Daftarkan aplikasi web. Salin nilai konfigurasi yang ditampilkan Firebase.
4. Di folder website, buka `firebase-config.js`. Ganti nilai `GANTI_...` dengan nilai dari Firebase. Jangan mengubah nama properti.
5. Ganti `GANTI_DENGAN_EMAIL_ADMIN` dengan email yang akan dipakai login. Email harus sama persis dengan email di Firestore Rules.

Contoh bentuk konfigurasi (gunakan nilai milik proyekmu, bukan contoh ini):
```js
export const firebaseConfig = {
  apiKey: "nilai-dari-firebase",
  authDomain: "nama-proyek.firebaseapp.com",
  projectId: "nama-proyek",
  storageBucket: "nama-proyek.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
export const adminEmail = "email-admin-kamu@example.com";
```

## Bagian B — Aktifkan login admin
1. Firebase Console → **Authentication** → **Get started**.
2. **Sign-in method** → aktifkan **Email/Password** → Save.
3. Tab **Users** → **Add user**. Buat akun dengan email admin yang sama seperti di `firebase-config.js` dan password kuat.
4. Login website menggunakan email dan password akun ini. Tombol Admin akan meminta email dan password.
5. Untuk mengganti password, buka Authentication → Users → pilih akun → reset password sesuai opsi yang tersedia.

## Bagian C — Buat database dan aturan keamanan
1. Firebase Console → **Firestore Database** → **Create database**.
2. Pilih lokasi database yang sesuai. Untuk setup awal boleh mulai dalam production mode.
3. Buka tab **Rules**. Salin isi file `firestore.rules` ke editor Rules.
4. Di file Rules, ganti `GANTI_DENGAN_EMAIL_ADMIN` dengan email admin yang sama, lalu tekan **Publish**.
5. Aturan ini mengizinkan publik membaca daftar, tetapi hanya akun dengan email admin yang ditentukan yang dapat menulis. Jangan mengganti aturan menjadi `allow write: if true`.

## Bagian D — Upload ke GitHub Pages
1. Buat repository GitHub baru. Untuk website publik, repository boleh Public.
2. Upload `index.html`, `firebase-config.js`, dan `public/` (opsional untuk salinan aset). Pastikan `index.html` ada di root repository.
3. Repository → **Settings** → **Pages** → pilih **Deploy from a branch**, pilih branch `main` dan folder `/ (root)`, lalu Save.
4. Tunggu deployment selesai. Buka URL Pages yang diberikan GitHub dan uji daftar publik serta login admin.

## Bagian E — Hubungkan domain `mediaas.site.web.id`
1. GitHub repository → Settings → Pages → **Custom domain**, masukkan `mediaas.site.web.id`, lalu Save.
2. Pada DNS provider yang mengelola zona `site.web.id`, buat record **CNAME**: Name/Host `mediaas`, Target `<USERNAME-GITHUB>.github.io` (ganti dengan username GitHub yang benar). Gunakan DNS only saat awal konfigurasi jika memakai Cloudflare.
3. Setelah DNS terdeteksi GitHub, aktifkan **Enforce HTTPS** pada Settings → Pages. Propagasi DNS/sertifikat dapat memerlukan waktu.
4. Jangan mengarahkan domain ke IP Pterodactyl untuk versi ini karena website di-host di GitHub Pages.

## Cara menambahkan link MediaFire
1. Buka website publik.
2. Tekan tombol **🔒 Admin**.
3. Masukkan email admin dan password akun Firebase Authentication.
4. Isi **Link MediaFire APK**, **Nama APK**, dan **Catatan/Keterangan**.
5. Tekan **Simpan APK**. Postingan akan tersimpan di Firestore dan tampil untuk semua pengunjung.
6. Saat login admin, tombol **Ubah** dan **Hapus** tersedia di kartu posting.
7. Tekan **Keluar Admin** setelah selesai.

## Catatan keamanan dan batasan
- File `firebase-config.js` berisi konfigurasi publik Firebase, bukan password. Jangan pernah memasukkan password admin ke file website.
- Keamanan penulisan dilakukan oleh Firestore Rules. Pastikan email di Rules cocok dengan akun admin.
- `database.json` tidak digunakan dalam versi Firebase; Firestore adalah database online permanen.
- Website statis tidak memerlukan Node.js atau Pterodactyl.
- Firebase memiliki kuota/ketentuan paket; pantau penggunaan di Firebase Console.
- Bagikan hanya link APK yang berhak kamu distribusikan dan aman untuk pengguna.
