# Deploying to Netlify

## Quick Deploy (Recommended)

### Option 1: Deploy via Netlify Dashboard

1. **Go to:** https://app.netlify.com/
2. **Sign up/Login** with GitHub
3. **Click:** "Add new site" → "Import an existing project"
4. **Connect to GitHub** and select your repository: `Resume--Portfilio`
5. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Click:** "Deploy site"

### Option 2: Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify in your project
netlify init

# Deploy
netlify deploy --prod
```

## Custom Domain Setup

After deployment:

1. Go to your Netlify site dashboard
2. Click **"Domain settings"**
3. Click **"Add custom domain"**
4. Enter: `mukprabhakar.in`
5. Follow the DNS configuration instructions
6. Add these DNS records at your registrar (Hostinger):

```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600

Type: CNAME
Name: www
Value: your-site-name.netlify.app
TTL: 3600
```

Replace `your-site-name` with your actual Netlify subdomain.

## Environment Variables

If you need to set environment variables (like Google Analytics ID):

1. Go to Netlify dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add your variables:
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

## Automatic Deploys

Netlify automatically deploys when you push to your main branch! 🚀

Just push your changes:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Netlify will build and deploy automatically within 1-2 minutes.
