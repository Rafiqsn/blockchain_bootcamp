# Lanjutan Dokumentasi — Frontend (Quiz-Chain)

Dokumentasi lanjutan ini menjelaskan langkah instalasi lengkap, konfigurasi environment, cara menjalankan aplikasi secara lokal, build untuk produksi, tips troubleshooting, dan panduan kontribusi.

---

## 3. Instalasi & Menjalankan (Development)

1. Pastikan backend API sudah jalan (contoh: `http://127.0.0.1:8000/api/v1`).
2. Masuk ke folder frontend (jika project monorepo):
   ```bash
   cd blockchain_bootcamp/frontend
   ```
   Jika project hanya frontend, pastikan kamu berada di root repo.

3. Install dependency:
   ```bash
   npm install
   ```
   atau jika menggunakan pnpm/yarn:
   ```bash
   pnpm install
   # atau
   yarn install
   ```

4. Buat file konfigurasi environment (lihat bagian 4). Setelah konfigurasi selesai, jalankan development server:
   ```bash
   npm run dev
   ```
   Perintah pasti (nama script) dapat berbeda — cek `package.json` untuk memastikan (umumnya `dev` atau `start`).

Server default development biasanya berjalan di `http://localhost:5173` (Vite) atau `http://localhost:3000` (Create React App). Cek output konsol setelah `npm run dev`.

---

## 4. Konfigurasi Environment (.env)

Salin file contoh (jika tersedia):
```bash
cp .env.example .env.local
```
atau buat `.env.local` baru jika tidak ada.

Contoh minimal variabel environment (project ini umumnya memakai prefix `VITE_` bila menggunakan Vite):
```env
# URL base ke backend API (pastikan trailing path sesuai API)
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1

# RPC / provider untuk smart contract (RPC HTTP)
VITE_CHAIN_RPC_URL=https://sepolia.infura.io/v3/<INFURA_KEY>

# Chain ID numeric (mis. 11155111 untuk Sepolia)
VITE_CHAIN_ID=11155111

# Alamat kontrak certificate yang sudah dideploy
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere

# Optional: nama aplikasi untuk tampilan/signature
VITE_APP_NAME=Quiz-Chain
```

Catatan:
- Jika project memakai Create React App, prefix mungkin `REACT_APP_` — cek dokumentasi/paketnya atau `.env.example`.
- Jangan commit file `.env.local` ke repository jika berisi secret.

---

## 5. Penggunaan (alur pengguna)

- Register & Login:
  - Daftar via form Register. Backend mengembalikan token/session.
  - Login akan menyimpan token (biasanya di localStorage atau httpOnly cookie tergantung implementasi).

- Melihat daftar Course & Chapter:
  - Dari halaman utama, pilih course untuk melihat chapter-nya.
  - Data diambil dari backend via endpoint `GET /courses` atau serupa.

- Kerjakan Quiz per Chapter:
  - Pilih chapter, kerjakan soal, submit jawaban.
  - Backend mengevaluasi dan menyimpan progress.

- Claim Certificate (on-chain):
  - Setelah memenuhi syarat (mis. lulus quiz), klik "Claim Certificate".
  - Aplikasi akan memicu transaksi ke smart contract:
    - Sambungkan wallet (MetaMask/dapp browser).
    - Aksi memerlukan signing tx oleh user.
    - Tampilkan status tx (pending / confirmed / failed).
  - Setelah berhasil, certificate dapat dilihat on-chain melalui explorer (Etherscan) atau halaman profil.

---

## 6. Integrasi Wallet & Smart Contract

- Pastikan user memiliki wallet web3 (MetaMask) terinstall.
- Pastikan network RPC dan chain ID sesuai environment (jika deploy ke testnet/mainnet).
- Umumnya alur:
  1. Hubungkan wallet (connect).
  2. Periksa jaringan; jika tidak cocok, minta user switch network.
  3. Panggil method kontrak (claim) via library seperti ethers.js atau web3.js.
  4. Tangani error (user reject, insufficient funds, gas, dll).

---

## 7. Build & Deploy (Produksi)

1. Build:
   ```bash
   npm run build
   ```
   Output biasanya di folder `dist` (Vite) atau `build` (CRA).

2. Preview (opsional):
   ```bash
   npm run preview
   ```
   atau gunakan static server pilihanmu:
   ```bash
   npx serve dist
   ```

3. Deploy:
   - Deploy hasil build ke hosting static: Netlify, Vercel, GitHub Pages, S3 + CloudFront, dll.
   - Pastikan `VITE_API_BASE_URL`/`REACT_APP_API_BASE_URL` diarahkan ke endpoint backend produksi.
   - Pastikan CORS backend mengizinkan origin frontend produksi.

---

## 8. Testing, Linting & Formatting

Periksa `package.json` untuk script yang tersedia. Contoh yang umum:
- Jalankan unit/integration tests:
  ```bash
  npm test
  ```
- Lint (ESLint):
  ```bash
  npm run lint
  ```
- Format (Prettier):
  ```bash
  npm run format
  ```
- Pre-commit hooks (husky) bisa otomatis menjalankan lint/format saat commit.

---

## 9. Troubleshooting Umum

- Backend unreachable / 401 Unauthorized:
  - Periksa `VITE_API_BASE_URL`.
  - Periksa apakah backend berjalan dan CORS mengizinkan origin.

- MetaMask not detected / window.ethereum undefined:
  - Pastikan MetaMask terpasang di browser.
  - Jangan jalankan pada private/incognito mode yang memblokir ekstensi.

- Transaksi on-chain gagal:
  - Periksa network/chain yang aktif di wallet.
  - Pastikan kontrak address dan ABI benar.
  - Cek balance ETH/Token untuk gas.

- Error saat build:
  - Pastikan versi Node.js sesuai rekomendasi.
  - Hapus `node_modules` + lockfile lalu instal ulang:
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```

---

## 10. Struktur Project (singkat)
- src/
  - components/   — komponen UI reusable
  - pages/        — halaman (routes)
  - api/          — panggilan ke backend
  - hooks/        — React hooks custom
  - services/     — integrasi wallet & smart contract (ethers)
  - stores/       — state management (Context / Redux / Zustand)
  - types/        — definisi TypeScript
  - utils/        — helper
  - assets/       — gambar / ikon / font

---

## 11. Cara Berkontribusi

1. Fork repository.
2. Buat branch baru:
   ```bash
   git checkout -b feat/nama-fitur
   ```
3. Buat perubahan, jalankan lint & test lokal.
4. Commit dengan pesan jelas dan buat PR ke branch `main`/`develop`.
5. Sertakan deskripsi perubahan dan screenshot/steps untuk testing jika UI terpengaruh.

Branch naming suggestion: `feat/...`, `fix/...`, `chore/...`.

---

## 12. Kontak & Bantuan

Jika ada masalah:
- Buka issue di repository dengan langkah reproduce dan log error.
- Sertakan versi Node, OS, dan langkah yang sudah dicoba.

---

Jika mau, saya bisa:
- Membuat file `.env.example` template berdasarkan konfigurasi di repo.
- Menambahkan instruksi spesifik dari `package.json` (jika kamu kirimkan isi `package.json` saya bisa menyesuaikan perintah).
- Menulis panduan integrasi kontrak (contoh kode ethers.js untuk claim certificate).

Mau saya tambahkan .env.example atau cek `package.json` sekarang?
