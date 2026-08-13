# 🍲 AduanePa Fie ("Good Food, Home")
### *University Food Delivery Marketplace — Ghanaian Campus Network*

> **"Enjoy the Taste in Every Bite"**  
> A multi-sided campus food delivery platform connecting Ghanaian university students, campus chop bars & restaurants, and local delivery couriers, with full platform governance and Pay on Delivery protection.

---

## 🌟 Key Features & Ecosystem Portals

### 1. 🎓 Student / Customer Experience
- **University-Scoped Vendor Discovery**: Vendors are strictly filtered by selected Ghanaian institution (University of Ghana - Legon, KNUST - Kumasi, UCC - Cape Coast, UPSA, Ashesi, ATU, and more).
- **Popular Landmark Pinpointing**: One-click selection of halls, hostels, libraries, and custom room delivery instructions (e.g. *Pentagon Block B Room 314*, *Night Market*, *Unity Hall Conti*, *Casford*).
- **Single-Vendor Cart Enforcement**: Built strictly according to the PRD business rule to guarantee timely deliveries.
- **Pay on Delivery (PoD) Guarantee**: Cash or direct Mobile Money (MTN / Telecel / AT) at physical handoff.
- **4-Digit Delivery Confirmation Code**: Every order automatically generates a secure OTP code (e.g., `6824`) required by the rider to close the delivery and collect funds.
- **Live Visual Order Tracker**: Real-time step progress (`Placed` $\rightarrow$ `Vendor Accepted` $\rightarrow$ `Preparing` $\rightarrow$ `Ready for Pickup` $\rightarrow$ `Out for Delivery` $\rightarrow$ `Delivered`).

### 2. 🏪 Campus Vendor Hub
- **Vendor Onboarding**: Business registration with simulated hygiene permit / certificate document upload.
- **Store Status Toggle & Scheduled Hours**: Instant manual Open/Closed switch + configured operating hours.
- **Live Kitchen Queue**: Stage transition triggers (*Accept Order* $\rightarrow$ *Start Kitchen Preparation* $\rightarrow$ *Mark Ready for Pickup*).
- **Menu & Pricing Catalog (CRUD)**: Create, edit, and delete dishes with photos, discount badges, preparation times, and dietary tags.

### 3. 🛵 Delivery Rider Fleet
- **Vehicle Mode Onboarding**: Bicycle, Motorbike, or Car with DVLA driver's license and vehicle document verification.
- **Campus Job Board**: Available orders filtered by the rider's active university/city zone.
- **Secure Code Verification**: Prompts the rider to enter the student's 4-digit code to finalize the order and confirm payment.

### 4. 🛡️ Admin Platform Governance
- **Account Verification Queue**: Review submitted business certificates and rider licenses, approve/reject, and issue unique platform identification codes (e.g. `ADP-VND-8101`, `ADP-RDR-3001`, `ADP-CUST-1001`).
- **Master Order Oversight & Dispute Handling**: Monitor platform-wide order status and resolve student/vendor dispute reports.
- **Ghanaian University Taxonomy**: Manage institutions, regions, cities, and campus landmarks.
- **Real-Time Analytics**: Gross order volume, completed trips, active vendors, and per-campus metrics.

---

## 🛠️ Technology Stack

- **Frontend & Core**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite 6
- **Styling**: Tailwind CSS with custom Ghanaian culinary themes, glassmorphism, and responsive design
- **Iconography**: Lucide React
- **Micro-Interactions**: Canvas-Confetti & CSS animations
- **State Management**: Reactive state store with persistent LocalStorage synchronization across tabs and roles

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📦 Pushing to GitHub & Deployment

To deploy this project to GitHub:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add files and commit
git add .
git commit -m "Initial commit: AduanePa Fie university food delivery platform"

# 3. Create your GitHub repository and link it
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git

# 4. Push to GitHub
git push -u origin main
```

### One-Click Cloud Deployment
- **Vercel**: Import your GitHub repository, framework preset *Vite*, root directory `./`.
- **Netlify**: Connect your repository, build command `npm run build`, publish directory `dist`.
- **GitHub Pages**: Use Vite's `base` config and GitHub Actions to deploy static `dist`.

---

## 📄 License & Attribution
Designed and built for **AduanePa Fie Technologies Ltd.**  
Built for universities across the Republic of Ghana 🇬🇭.
