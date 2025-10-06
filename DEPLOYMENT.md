# 🚀 GitHub Pages Deployment Guide

This guide will help you deploy your portfolio website to GitHub Pages.

## 📋 Prerequisites

- GitHub account
- Git installed on your local machine
- All website files ready

## 🛠️ Step-by-Step Deployment

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click "New repository" or the "+" icon
3. Repository name: `portopolio` (or your preferred name)
4. Description: "Professional Portfolio Website"
5. Set to **Public** (required for free GitHub Pages)
6. Don't initialize with README (we already have files)
7. Click "Create repository"

### 2. Upload Files to GitHub

#### Option A: Using GitHub Web Interface
1. Go to your new repository
2. Click "uploading an existing file"
3. Drag and drop all your files:
   - `index.html`
   - `project-detail.html`
   - `blog-detail.html`
   - `rahadi-cv.html`
   - `cvmmorpg.html`
   - `c4pedia.html`
   - `kafka-simulator.html`
   - `kafkapedia.html`
   - `kibana.html`
   - `mongopedia.html`
   - `redispedia.html`
   - `images/` folder
   - `CV ATS RAHADI.pdf`
   - All other files created

#### Option B: Using Git Command Line
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Portfolio website"

# Add remote repository
git remote add origin https://github.com/YOURUSERNAME/portopolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Select "main" branch
6. Select "/ (root)" folder
7. Click "Save"

### 4. Wait for Deployment

- GitHub will build and deploy your site
- This usually takes 1-10 minutes
- You'll see a green checkmark when ready

### 5. Access Your Website

Your website will be available at:
- `https://YOURUSERNAME.github.io/portopolio`
- Or `https://rahadisampurna.com` (if you set up custom domain)

## 🌐 Custom Domain Setup (Optional)

### 1. Update CNAME File
1. Edit the `CNAME` file in your repository
2. Replace `rahadisampurna.com` with your domain
3. Commit the changes

### 2. Configure DNS
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add a CNAME record:
   - Type: CNAME
   - Name: www (or @)
   - Value: YOURUSERNAME.github.io
3. Add an A record:
   - Type: A
   - Name: @
   - Value: 185.199.108.153 (GitHub's IP)

### 3. Enable Custom Domain in GitHub
1. Go to repository Settings > Pages
2. Enter your custom domain
3. Check "Enforce HTTPS"

## 🔧 Troubleshooting

### Common Issues

#### 1. 404 Error
- Check if all files are in the root directory
- Ensure `index.html` exists
- Wait a few minutes for deployment

#### 2. Images Not Loading
- Check file paths in HTML
- Ensure images are in the `images/` folder
- Use relative paths: `images/filename.jpg`

#### 3. CSS Not Loading
- Check if Tailwind CSS CDN is accessible
- Ensure internet connection
- Check browser console for errors

#### 4. PDF Not Opening
- Ensure PDF file is in root directory
- Check file name matches exactly
- Try opening PDF directly in browser

### Debug Steps

1. **Check Repository Structure**
   ```
   portopolio/
   ├── index.html
   ├── project-detail.html
   ├── blog-detail.html
   ├── images/
   ├── CV ATS RAHADI.pdf
   └── other files...
   ```

2. **Test Locally**
   ```bash
   # Install http-server
   npm install -g http-server
   
   # Run local server
   http-server . -p 3000
   
   # Open http://localhost:3000
   ```

3. **Check GitHub Pages Logs**
   - Go to repository Actions tab
   - Check deployment logs for errors

## 📱 Testing

### Desktop Testing
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Portfolio projects display
- [ ] Blog posts load
- [ ] CV PDF opens
- [ ] Project details work
- [ ] Responsive design works

### Mobile Testing
- [ ] Mobile menu works
- [ ] Touch interactions work
- [ ] Images load properly
- [ ] Text is readable
- [ ] Buttons are tappable

## 🔄 Updates and Maintenance

### Making Changes
1. Edit files locally
2. Test changes
3. Commit and push to GitHub
4. GitHub Pages will auto-deploy

### Regular Maintenance
- Update project information
- Add new blog posts
- Update CV when needed
- Check for broken links
- Monitor site performance

## 📊 Analytics (Optional)

### Google Analytics
1. Create Google Analytics account
2. Get tracking code
3. Add to `<head>` section of `index.html`
4. Deploy changes

### GitHub Pages Analytics
1. Go to repository Settings
2. Scroll to "Pages" section
3. Enable "GitHub Pages analytics"

## 🎯 SEO Optimization

### Meta Tags
- Update title tags
- Add meta descriptions
- Include keywords
- Add Open Graph tags

### Performance
- Optimize images
- Minify CSS/JS
- Enable compression
- Use CDN for assets

## 📞 Support

If you encounter issues:
1. Check GitHub Pages documentation
2. Review repository settings
3. Check file permissions
4. Contact GitHub support

---

**Happy Deploying! 🚀**
