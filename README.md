# HostScout

A zero-cost, serverless web application that tracks domain registration promos, web hosting coupons, and free hosting providers in a single searchable dashboard.

![Node.js](https://img.shields.io/badge/Node.js-20-43853D?style=flat-square&logo=node.js&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Automated-2088FF?style=flat-square&logo=github-actions&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-UI-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Live-222222?style=flat-square&logo=github&logoColor=white)

**Live Application:** [https://abirboss8055.github.io/hostscout/](https://abirboss8055.github.io/hostscout/)

---

## Overview

Finding reliable domain discounts, verified hosting coupons, and ad-free free hosting tiers usually means digging through cluttered coupon sites. **HostScout** combines a curated directory of verified offers and free hosting providers with a daily automated feed of community hosting deals, served through a fast static interface on GitHub Pages.

## Data Sources

HostScout uses a hybrid data pipeline that merges curated offers with live automated RSS ingestion:

| Source | Type | Data Collected |
| :--- | :--- | :--- |
| **`curated-deals.json`** | Curated Local Catalog | Verified domain promos (Namecheap, Porkbun, Spaceship), hosting discounts (Hostinger), and free hosting specs (InfinityFree, ProFreeHost, Cloudflare Pages, GitHub Pages, AwardSpace). |
| **LowEndBox RSS** | Live Public Feed (`lowendbox.com/feed/`) | Daily community VPS, shared hosting, and server offers parsed automatically using native Node.js `fetch` with zero external dependencies. |

## Key Features

* **Daily Automated Updates:** Runs on a scheduled GitHub Actions cron job (`0 0 * * *` UTC) with manual trigger support (`workflow_dispatch`).
* **Dedicated Free Hosting Directory:** Highlights free tiers with clear spec badges (disk space, PHP/MySQL support, free SSL, and no credit card required).
* **One-Click Coupon Copy:** Instant clipboard copy buttons on all promo code cards.
* **Real-Time Search & Filtering:** Filter across All, Free Hosting, Domain Deals, Hosting Deals, and Live Community Feed, or search by provider, TLD, and specs.
* **Zero Infrastructure Cost:** Built with zero npm dependencies and hosted entirely on GitHub Actions and GitHub Pages.

## System Architecture

```text
hostscout/
├── .github/
│   └── workflows/
│       └── update-deals.yml   # Daily cron automation (00:00 UTC)
├── curated-deals.json         # Curated coupons, domain deals, and free hosts
├── fetch-deals.js             # Zero-dependency Node.js RSS parser & merger
├── deals.json                 # Auto-generated combined datastore
├── index.html                 # Searchable, filterable frontend (Tailwind + Vanilla JS)
└── README.md                  # Project documentation
```

