# EmailJS Setup Guide for Visit Notifications

This guide will help you set up automatic email notifications when someone visits your portfolio website.

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month free)
3. Verify your email address

## Step 2: Add an Email Service

1. Go to [Email Services](https://dashboard.emailjs.com/admin/integration) in your dashboard
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. **Copy your Service ID** (you'll need this later)

## Step 3: Create an Email Template

1. Go to [Email Templates](https://dashboard.emailjs.com/admin/template) in your dashboard
2. Click "Create New Template"
3. Use the following template:

**Subject:**
```
{{subject}}
```

**Content:**
```
{{message}}
```

Or use this more detailed template:

**Subject:**
```
{{subject}}
```

**Content:**
```
{{message}}

---
Visit Details:
- Time: {{visit_time}}
- Page URL: {{page_url}}
- Referrer: {{referrer}}
- Browser: {{user_agent}}
- Screen Resolution: {{screen_resolution}}
- Language: {{language}}
```

4. **Copy your Template ID** (you'll need this later)

## Step 4: Get Your Public Key

1. Go to [Account](https://dashboard.emailjs.com/admin) in your dashboard
2. Find your **Public Key** (also called API Key)
3. **Copy your Public Key** (you'll need this later)

## Step 5: Update Your Code

1. Open `script.js`
2. Find the `sendVisitNotification()` function (around line 665)
3. Replace the following placeholders with your actual values:

```javascript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your Template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your Public Key
```

**Example:**
```javascript
const EMAILJS_SERVICE_ID = 'service_abc123';
const EMAILJS_TEMPLATE_ID = 'template_xyz789';
const EMAILJS_PUBLIC_KEY = 'abcdefghijklmnop';
```

## Step 6: Test It

1. Save your changes
2. Open your portfolio website in a browser
3. Check your email inbox - you should receive a notification!
4. Check the browser console (F12) for any error messages

## Troubleshooting

- **No email received?** Check the browser console for errors
- **EmailJS not loaded?** Make sure the EmailJS script is included in your HTML
- **Invalid credentials?** Double-check your Service ID, Template ID, and Public Key
- **Rate limit exceeded?** Free tier allows 200 emails/month. Upgrade if needed.

## Security Note

The Public Key is safe to use in client-side code. It's designed to be public and has limited permissions. Never share your Private Key or Service credentials.

## Need Help?

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: Check their support page or community forums

