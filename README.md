# 🎬 Scriptavo.AI — Upload Guide

**Owner:** You | **Version:** 2.0 | **© 2026 Scriptavo.AI**

---

## YOUR FILE STRUCTURE (Upload exactly like this)

```
scriptavo-ai/               ← your GitHub repository name
├── index.html
├── package.json
├── vite.config.js
├── api/
│   └── chat.js             ← YOUR SECRET BACKEND (hides API key)
└── src/
    ├── main.jsx
    └── App.jsx             ← THE FULL APP
```

---

## STEP 1 — Get Your Free Gemini API Key

1. Go to **aistudio.google.com**
2. Sign in with Google
3. Click **Get API Key** → **Create API Key**
4. Copy the key (starts with AIza...)
5. Save it — you need it in Step 4

---

## STEP 2 — Upload to GitHub

1. Go to **github.com** → Sign up free
2. Click **"+"** → **New repository**
3. Name it: `scriptavo-ai` → Make it **Public** → Create
4. Click **"uploading an existing file"**
5. Upload ALL files keeping the exact folder structure above
6. Click **Commit changes** ✅

---

## STEP 3 — Deploy on Vercel (Free)

1. Go to **vercel.com** → Sign up with GitHub
2. Click **Add New Project** → Import **scriptavo-ai**
3. Leave all settings default → Click **Deploy**
4. Wait 2 minutes → Your site is LIVE ✅

---

## STEP 4 — Add Your Secret API Key (IMPORTANT)

This is how you hide your API key from users:

1. In Vercel → Go to your project → Click **Settings**
2. Click **Environment Variables**
3. Add new variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** paste your key from Step 1
4. Click **Save**
5. Go to **Deployments** → Click **Redeploy** ✅

Done! Users now use your tool without ever seeing your API key.

---

## STEP 5 — Connect PayPal Payments

1. Go to **paypal.com/business** → Create free account
2. Go to **Tools** → **PayPal Buttons** → **Subscriptions**
3. Set price: **$0.89 USD/month**
4. Copy the subscription link
5. Replace `YOUR_PAYPAL_LINK` in App.jsx pricing button with your link
6. Redeploy on Vercel ✅

---

## YOUR WEBSITE IS LIVE AT:
**https://scriptavo-ai.vercel.app**

Google will index it automatically within 1-2 weeks.

---

## OWNERSHIP PROOF

- GitHub repository is in **YOUR account** = you own the code
- Vercel deployment is in **YOUR account** = you own the hosting  
- PayPal payments go to **YOUR account** = you own the revenue
- © 2026 Scriptavo.AI = your copyright notice is in the code

---

## TOTAL COST: $0

| Item | Cost |
|---|---|
| Gemini API (free tier) | $0 |
| GitHub hosting | $0 |
| Vercel hosting | $0 |
| PayPal business | $0 |
| **Total** | **$0** |

---

*© 2026 Scriptavo.AI. All Rights Reserved.*
*Platform software owned by Scriptavo.AI.*
*User-generated scripts are owned by the user.*
