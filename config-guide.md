# Configuration System for MyResume Website

This document explains how to use the configuration system to easily customize all aspects of your MyResume website.

## Overview

The configuration system allows you to modify all aspects of your website by editing a single JSON file (`config.json`) rather than having to modify multiple HTML files. This makes it easy to:

- Change personal information and contact details
- Modify section content and visibility
- Update skills, experience, and education
- Customize portfolio items and categories
- Modify services offered
- Update testimonials
- Change images throughout the site
- And much more!

## How It Works

1. The website loads the `config.json` file when it starts
2. The configuration is applied to all parts of the website
3. Any changes you make to the configuration file will be reflected when you refresh the page

## How to Edit the Configuration

To customize your website, simply edit the `config.json` file using any text editor. The file is structured into logical sections:

### Site Settings

```json
"site": {
  "title": "MyResume - Personal Resume Website",
  "description": "Professional resume and portfolio website",
  "keywords": "resume, portfolio, personal website",
  "favicon": "assets/img/favicon.png",
  "appleTouchIcon": "assets/img/apple-touch-icon.png"
}
```

This section controls the basic site metadata like title, description, and favicon.

### Personal Information

```json
"personal": {
  "name": "Brandon Johnson",
  "profession": {
    "typedItems": ["Designer", "Developer", "Freelancer", "Photographer"]
  },
  "heroBgImage": "assets/img/hero-bg.jpg",
  "profileImage": "assets/img/profile-img.jpg",
  "about": {
    "title": "UI/UX Designer & Web Developer",
    "subtitle": "Lorem ipsum dolor sit amet...",
    "description": "Officiis eligendi itaque labore et dolorum..."
  },
  "details": [
    {
      "label": "Birthday",
      "value": "1 May 1995"
    },
    // Additional personal details...
  ],
  "contactInfo": {
    "address": "A108 Adam Street, New York, NY 535022",
    "phone": "+1 5589 55488 55",
    "email": "info@example.com",
    "receivingEmail": "contact@example.com"
  }
}
```

This section controls your personal information, including name, profession, images, and contact details.

### Navigation Menu

```json
"navigation": [
  {
    "name": "Home",
    "link": "#hero",
    "icon": "bi-house"
  },
  // Additional navigation items...
]
```

This section controls the navigation menu items, their links, and icons.

### Social Media Links

```json
"social": {
  "twitter": {
    "link": "#",
    "icon": "bi-twitter-x",
    "enabled": true
  },
  // Additional social media platforms...
}
```

This section controls your social media links. You can enable/disable specific platforms and update their links.

### Content Sections

The `sections` object contains configuration for each section of the website:

- `about`: About section with your bio
- `stats`: Statistics and numbers
- `skills`: Skills and proficiency levels
- `resume`: Education, experience, and qualifications
- `portfolio`: Your project portfolio
- `services`: Services you offer
- `testimonials`: Client testimonials
- `contact`: Contact information and form

For each section, you can:
- Enable/disable the section with `enabled: true/false`
- Change the section title and description
- Update the content specific to that section

### Footer

```json
"footer": {
  "copyright": "Alex Smith",
  "description": "Et aut eum quis fuga eos sunt ipsa nihil..."
}
```

This section controls the footer content, including copyright information.

## Changing Images

To change images, update the file paths in the configuration. For example:

```json
"heroBgImage": "assets/img/hero-bg.jpg",
"profileImage": "assets/img/profile-img.jpg",
```

You can replace these images by:
1. Placing your new images in the appropriate folder
2. Updating the path in the configuration file

## Enabling/Disabling Sections

To show or hide entire sections, set the `enabled` property:

```json
"portfolio": {
  "title": "Portfolio",
  "description": "My latest works",
  "enabled": false  // This will hide the portfolio section
}
```

## Contact Form

The contact form submits to the PHP file specified in:

```json
"formSubmitPath": "forms/contact.php"
```

Note: To change the receiving email address for form submissions, you'll need to also update the PHP file manually.

## Troubleshooting

If your changes don't take effect:
1. Make sure your JSON is valid (no syntax errors)
2. Clear your browser cache and reload the page
3. Check the browser console for any JavaScript errors
