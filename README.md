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

## 3. Konfigurasi Environment (.env)

Salin contoh:
```bash
cp .env.example .env.local
```

Contoh `.env.example` (tambahan file dibuat di repo):
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_CHAIN_RPC_URL=https://sepolia.infura.io/v3/<INFURA_KEY>
VITE_CHAIN_ID=11155111
VITE_CONTRACT_ADDRESS=0xYourContractAddress
VITE_APP_NAME=Quiz-Chain

Catatan:
- Jika menggunakan Vite gunakan prefix VITE_. Untuk CRA gunakan REACT_APP_.
- Jangan commit file .env.local ke repo publik.

---

## 4. Mapping Endpoint BE (Asumsi / Template)

Berikut daftar endpoint BE yang umum dipakai oleh frontend ini. Sesuaikan path/response sesuai BE asli.

Autentikasi
- POST /auth/register
  - Body: { name, email, password }
  - Response: { user, access_token }
- POST /auth/login
  - Body: { email, password }
  - Response: { user, access_token }
- POST /auth/logout
  - Header: Authorization: Bearer <token>

User
- GET /users/me
  - Header: Authorization: Bearer <token>
  - Response: { id, name, email, profile, certificates: [] }

Course & Chapter
- GET /courses
  - Response: [{ id, title, description, chapters: [...] }, ...]
- GET /courses/{course_id}
  - Response: detail course + chapters
- GET /chapters/{chapter_id}
  - Response: { id, title, quiz_id, content }

Quiz
- GET /quizzes/{quiz_id}
  - Response: { id, questions: [{ id, text, options: [...] }], passing_score }
- POST /quizzes/{quiz_id}/submit
  - Body: { answers: [{ question_id, answer }] }
  - Response: { score, passed: true/false, progress }

Certificate (off-chain BE record)
- GET /users/{user_id}/certificates
  - Response: [{ id, course_id, claimed_on_chain, tx_hash?, token_id? }, ...]

Notes:
- Jika BE mengekspose event atau webhook untuk on-chain, frontend bisa subscribe notifikasi via WebSocket atau polling.

---

## 5. Contoh Integrasi API (axios)

File contoh: src/api/index.ts (lihat file contoh di bawah). Intinya:
- Buat axios instance dengan baseURL dari env
- Tambah interceptor untuk menyisipkan token Authorization
- Tangani error 401 -> redirect ke login

Contoh request:
- Ambil courses: GET `${VITE_API_BASE_URL}/courses`
- Submit quiz: POST `${VITE_API_BASE_URL}/quizzes/${id}/submit` body answers

---

## 6. Auth Flow & Penyimpanan Token

Pilihan penyimpanan token:
- localStorage: mudah namun rentan XSS
- httpOnly cookie: lebih aman (but requires BE support / CORS config)

Rekomendasi: jika BE memberikan httpOnly cookie, gunakan itu. Jika tidak, gunakan localStorage dengan pengamanan (escape output, CSP).

Flow:
1. Register -> BE mengembalikan token
2. Simpan token dan user data di state/global (context/zustand/redux)
3. Pada load app, panggil GET /users/me untuk refresh user
4. Jika 401, redirect ke login

---

## 7. Claim Certificate — On-Chain (ethers.js contoh)

Alur:
1. Pastikan user terhubung ke wallet (window.ethereum)
2. Pastikan network chainId sesuai env
3. Panggil fungsi kontrak (mis: claimCertificate(courseId, metadataHash))
4. Tampilkan status tx (pending -> confirmed)
5. Setelah tx konfirmasi, kirim bukti ke BE untuk menandai claimed_on_chain (mis. POST /certificates/confirm dengan tx_hash & token_id)

Contoh fungsi claim (lihat file contoh src/services/contract.ts di bawah).

---

## 8. TypeScript Types (contoh)

Sertakan type interface untuk user, course, chapter, quiz, certificate (file contoh src/types/api.ts di bawah). Ini membantu sinkronisasi dengan response BE.

Jika BE menggunakan OpenAPI/Swagger, kita bisa generate types otomatis (openapi-generator / swagger-codegen / openapi-typescript). Kalau kamu mau, kirim spec BE dan aku buatkan tipe otomatis.

---

## 9. Handling Edge Cases

- User menolak signature: berikan pesan jelas dan opsi retry
- Gas mahal / insufficient funds: tangani error dari provider dan tampilkan instruksi top-up testnet ETH
- BE dan kontrak mismatch: pastikan BE menyimpan token_id & tx_hash setelah on-chain minting, dan frontend memverifikasi status via Etherscan/API provider jika perlu

---

## 10. Testing & Linting

Cek script di package.json. Jika belum ada, tambahkan:
- lint (eslint)
- format (prettier)
- test (vitest/jest)

Contoh:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext .ts,.tsx",
  "format": "prettier --write ."
}
```

---

## 11. Sinkronisasi dengan BE — Checklist

1. Dapatkan base API BE (contoh: http://127.0.0.1:8000/api/v1)
2. Minta docs/Swagger/OpenAPI dari BE
3. Cocokkan:
   - Nama endpoint & path
   - Field response (mis. course.id vs course.course_id)
   - Auth method (Bearer vs cookie)
4. Update file `src/types/api.ts` agar tipe sesuai dengan BE
5. Uji tiap endpoint manual (Postman) lalu integrasikan ke frontend
6. Jika kontrak smart contract diubah, update ABI & VITE_CONTRACT_ADDRESS

---

## 12. Next Steps (aku bisa bantu)

- Generate `.env.example` (sudah disediakan file contoh di repo jika kamu mau aku buatkan file)
- Sesuaikan dokumentasi otomatis dari package.json / API spec bila kamu kirimkan:
  - package.json
  - URL atau OpenAPI/Swagger backend
- Buatkan PR ke repo (kalau mau aku push file dokumentasi langsung)

Mau aku:
- (A) Buat file `.env.example` dan contoh file TS (api & contract) sekarang?
- (B) Atau kamu kirim URL/OpenAPI BE agar aku sinkronkan tipe & endpoint persis?

Balas A atau B atau kirim file/package.json/OpenAPI. Terima kasih!
