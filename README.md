# Quiz-Chain — Frontend (Rafiqsn/blockchain_bootcamp)

Dokumentasi ini khusus untuk frontend "Quiz-Chain" milik Rafiq (repo: Rafiqsn/blockchain_bootcamp). Tujuannya: mendokumentasikan cara menjalankan, konfigurasi, dan integrasi dengan Backend (BE) agar sinkron. Dokumen ini berisi asumsi endpoint BE umum; sesuaikan dengan dokumentasi BE atau beritahu aku URL/API spec BE supaya aku bisa perbarui otomatis.

Ringkasan:
- Bahasa: TypeScript + React
- Fitur: register/login, daftar course & chapter, kerjakan quiz, claim & lihat certificate on-chain
- Library umum: axios (HTTP), react-router, ethers.js (web3), zustand/context/Redux (state), Vite/CRA

---

## 1. Prasyarat

- Git
- Node.js (≥ 18)
- npm / pnpm / yarn
- Backend API Blockchain Bootcamp sudah berjalan (misal: http://127.0.0.1:8000/api/v1) — wajib untuk sinkronisasi data
- Wallet web3 (MetaMask) untuk fitur on-chain

---

## 2. Clone & Install

```bash
git clone https://github.com/Rafiqsn/blockchain_bootcamp.git
cd blockchain_bootcamp
# jika monorepo, masuk folder frontend:
cd frontend

npm install
# atau
pnpm install
# atau
yarn install
```

Jalankan dev server:
```bash
npm run dev
# atau cek package.json: npm run start / npm run dev
```

---

## 3. Set Config CORS di BE

```bash
main.py
```
set url ke localhost

