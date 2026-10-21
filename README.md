# MediaFire APK Center — Admin password + posting global

Pengunjung bisa melihat semua link tanpa login. Admin cukup membuka menu Admin di website dan memasukkan password. Link disimpan online melalui Cloudflare Worker + KV, bukan di browser pengunjung.

## 1) Buat penyimpanan Cloudflare (sekali saja)
1. Masuk ke https://dash.cloudflare.com/ lalu buka **Workers & Pages**.
2. Buat Worker baru, misalnya `mediafire-api`.
3. Buka editor Worker dan ganti isi kode dengan file `worker.js` dari ZIP ini. Deploy.
4. Di pengaturan Worker, buka **Settings → Variables and Secrets** lalu tambahkan secret bernama `ADMIN_PASSWORD`. Isi dengan password kuat milikmu (minimal 14 karakter). Jangan bagikan password ini.
5. Buat KV namespace di **Storage & databases → Workers KV**, misalnya `MEDIAFIRE_LINKS`.
6. Pada Worker → Settings → Bindings, tambahkan **KV namespace binding**: Variable name `LINKS_KV`, pilih namespace `MEDIAFIRE_LINKS`. Deploy ulang.
7. URL Worker biasanya seperti `https://mediafire-api.NAMA-AKUN.workers.dev`. Buka `worker.js` tidak perlu diubah lagi.

## 2) Sambungkan website ke Worker
1. Buka `index.html`, cari baris `var API_BASE = "https://GANTI-NAMA-WORKER.GANTI-AKUN.workers.dev";`.
2. Ganti URL contoh itu dengan URL Worker milikmu (tanpa garis miring di akhir).
3. Upload `index.html`, `links.json`, `robots.txt`, `sitemap.xml`, dan `og-image.png` ke repository website GitHub Pages.
4. Pastikan `index.html` dan Worker sudah ter-deploy. Buka website lalu refresh.

## 3) Cara menggunakan
- Semua orang bisa melihat/cari link MediaFire tanpa login.
- Tekan **Admin**, masukkan nilai secret `ADMIN_PASSWORD`.
- Tambahkan nama APK, link MediaFire, catatan opsional, lalu **Simpan APK**.
- Posting akan langsung tersimpan online dan terlihat oleh pengunjung lain. Admin juga bisa mengubah/menghapus postingan.
- Untuk keluar, tekan tombol **Keluar Admin**. Sesi admin berlaku sekitar 8 jam; login ulang jika habis.
- Untuk mengganti password, ubah secret `ADMIN_PASSWORD` di Cloudflare Worker lalu deploy/restart bila diminta.

## Catatan keamanan
Jangan letakkan password admin di `index.html` atau repository. Password hanya disimpan sebagai secret di Cloudflare. Worker memakai sesi bertanda tangan dan memeriksa izin untuk setiap perubahan. Endpoint mengizinkan pembacaan publik dan hanya menerima perubahan dengan sesi admin valid.
