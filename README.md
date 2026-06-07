# Jurnal Keuangan Bersama

Aplikasi web pengelolaan keuangan keluarga mandiri berbasis seluler yang terintegrasi langsung dengan Google Sheets sebagai basis data.

## Struktur Repositori

- `index.html`: Berkas pembungkus iFrame utama untuk mendeploy aplikasi pada GitHub Pages.
- `appscript_CatKeu/`: Direktori yang berisi kode sumber utama Google Apps Script:
  - `Kode.gs`: Logika backend/server-side untuk CRUD data ke Google Sheets, otentikasi data, dan perhitungan anggaran.
  - `index.html`: Antarmuka riwayat transaksi.
  - `anggaran.html`: Antarmuka manajemen batasan anggaran bulanan & sisa hari.
  - `kategori.html`: Antarmuka pengelolaan kategori pengeluaran.
  - `aset.html`: Antarmuka pemantauan saldo aset & dompet keuangan.
