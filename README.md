# Sleep-Well Finance

Sleep-Well Finance adalah "Sistem Pertahanan Kas" dan aplikasi pencatatan keuangan pribadi yang minimalis, super cepat, dan beroperasi layaknya aplikasi native. Aplikasi ini dibangun dengan prinsip no-bloatware dan difokuskan pada manajemen kas, surplus, mutasi, dan pagu piutang.

## 🚀 Fitur Utama

- **Sistem Pertahanan Kas**: Pantau Uang Dingin (Threshold) dan Surplus (Amunisi).
- **Peta Kas & Mutasi**: Lacak perpindahan uang antar dompet/rekening.
- **Manajemen Pagu Piutang**: Batasi dan pantau piutang berdasarkan kategori (Keluarga, Teman, B2B).
- **Progressive Web App (PWA)**: Dapat diinstal di HP/Desktop dan mendukung caching offline.
- **Dark/Light Mode**: Tampilan bersih dan nyaman di mata.
- **Export/Import Excel**: Amankan data Anda kapan saja.
- **Firebase Sync**: Sinkronisasi data real-time yang dioptimalkan untuk menghemat kuota (Granular Updates).

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Library UI**: React JS 19
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (dengan IndexedDB persistence)
- **Database/Auth**: Firebase Realtime Database & Firebase Auth
- **PWA**: `@ducanh2912/next-pwa`

## 📦 Cara Instalasi & Menjalankan di Lokal

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/sleep-well-financial.git
   cd sleep-well-financial
   ```

2. **Install Dependencies**
   Pastikan Anda menggunakan Node.js versi terbaru (v18+ direkomendasikan).
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Buat file `.env.local` di root direktori dan isi dengan konfigurasi Firebase Anda:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 🌐 Cara Deploy ke GitHub Pages

Aplikasi ini sudah dikonfigurasi agar sangat mudah di-deploy ke GitHub Pages dengan subpath `/sleep-well-financial`.

### Menggunakan GitHub Actions (Direkomendasikan)

1. Buka repository GitHub Anda, pergi ke **Settings > Pages**.
2. Pada bagian **Source**, pilih **GitHub Actions**.
3. Buat file workflow di `.github/workflows/deploy.yml` dengan isi berikut:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Install dependencies
        run: npm ci
      - name: Build with Next.js
        env:
          GITHUB_ACTIONS: true
          # Tambahkan env Firebase Anda di GitHub Secrets dan panggil di sini jika diperlukan
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Catatan Penting:** 
Variabel `GITHUB_ACTIONS=true` akan otomatis terdeteksi oleh `next.config.ts`. Konfigurasi ini akan secara otomatis:
- Mengubah `output` menjadi `export` (Static HTML).
- Mengatur `basePath` menjadi `/sleep-well-financial`.
- Menonaktifkan optimasi gambar bawaan Next.js yang tidak didukung dalam mode export.

## 📱 Setup PWA (Ikon)

Agar PWA berjalan sempurna saat diinstal, Anda perlu menambahkan ikon aplikasi:
1. Siapkan logo aplikasi berukuran `192x192` dan `512x512` pixel (format PNG).
2. Simpan di dalam folder `public/icons/` dengan nama:
   - `icon-192x192.png`
   - `icon-512x512.png`

---
*Dibuat untuk menjaga kesehatan finansial dan kualitas tidur Anda.* 🌙
