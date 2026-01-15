# 🚀 Mamboro-Ai Pro Studio

![Mamboro-Ai Banner](https://img.shields.io/badge/AI-Gemini_2.5_Flash-blueviolet?style=for-the-badge&logo=google-gemini)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**Mamboro-Ai Pro Studio** adalah platform penyuntingan gambar tingkat lanjut yang ditenagai oleh model AI terbaru **Gemini 2.5 Flash Image (Nano Banana)**. Aplikasi ini memungkinkan pengguna untuk melakukan manipulasi gambar yang kompleks melalui instruksi bahasa alami yang sederhana.

## ✨ Fitur Unggulan

- 🎨 **Edit Umum (General Edit)**: Tambahkan objek, ubah latar belakang, atau modifikasi elemen gambar hanya dengan teks.
- 👔 **Ganti Pakaian (Outfit Swap)**: Ubah pakaian subjek menggunakan preset (Jas, Batik, Denim, dll) atau gunakan **Gambar Referensi** milik Anda sendiri.
- 📐 **Rasio Aspek Kustom**: Pilih format output mulai dari 1:1 (Square), 16:9 (Landscape), hingga 9:16 (Portrait).
- ⚡ **Real-time Processing**: Antarmuka responsif dengan indikator pemrosesan yang halus.
- 🎟️ **Sistem Token Harian**: Manajemen kuota penggunaan harian untuk optimasi akses.

## 🛠 Cara Penggunaan

1. **Langkah 1: Unggah Gambar**
   - Pilih gambar sumber yang ingin Anda edit (PNG, JPG, WEBP).
2. **Langkah 2: Atur Parameter**
   - Masukkan instruksi edit di mode **Edit Umum**, atau pilih gaya di mode **Ganti Pakaian**.
3. **Langkah 3: Preview & Unduh**
   - Tunggu AI memproses gambar, bandingkan dengan aslinya, lalu unduh hasilnya dalam resolusi tinggi.

## 🚀 Panduan Deployment (GitHub Pages)

Jika Anda ingin meng-host aplikasi ini sendiri di GitHub:

1. **Push Code**: Pastikan semua kode sudah di-push ke branch `main`.
2. **Ubah Settings di GitHub**:
   - Buka Repository -> **Settings** -> **Pages**.
   - Ubah **Source** dari "Deploy from a branch" menjadi **"GitHub Actions"**.
3. **Tunggu Deployment**: GitHub Actions akan otomatis melakukan build (Vite) dan menayangkan aplikasi Anda di URL `https://username.github.io/repository-name/`.

## ⚙️ Teknis
- **Model**: `gemini-2.5-flash-image`
- **SDK**: `@google/genai`
- **Styling**: Tailwind CSS dengan tema "Slate-Neon"
- **Environment**: Menggunakan `process.env.API_KEY` otomatis dari lingkungan eksekusi AI Studio.

---
Dibuat dengan ❤️ oleh [andrymamboro](https://github.com/andrymamboro). © 2025 MAMBORO-AI STUDIO. INDONESIA.
