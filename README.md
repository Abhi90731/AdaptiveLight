# Eye Protector Chrome Extension

Eye Protector is a Chrome extension that automatically adjusts your screen's color temperature and brightness based on the type of content you are viewing.  
It detects reading-heavy pages, video pages, and generic landing pages, and applies a warm overlay to protect your eyes.

---

## ✨ Features

- **Automatic Content Detection**:
  - Reading mode for articles, blogs, and text-heavy pages.
  - Video mode for YouTube, Vimeo, and other video-heavy pages.
  - Generic mode for homepages and image-heavy landing pages.
- **Night Reading Mode**:
  - Warmer tint at night for text-heavy pages.
- **Fullscreen & Screen Sharing Detection**:
  - Automatically disables filter during fullscreen videos or active screen sharing.
- **Smooth Animations**:
  - Fade-in when enabling the filter.
  - Fade-out when disabling.
- **Two-Stage Detection**:
  - Initial detection after 500ms.
  - Final detection after 5s to account for dynamically loaded content.
- **Customizable Opacity** via popup UI.

---
EyeProtector/
│
├── manifest.json # Extension manifest (Manifest V3)
├── content.js # Core logic for detection & filter application
├── popup.html # Popup UI
├── popup.js # Popup logic & user controls
├── icons/ # Extension icons
│ ├── icon16.png
│ ├── icon48.png
│ └── icon128.png
└── README.md # Project documentation

---

## 🔧 Installation (For Development)

1. Clone or download this repository.
2. Open **Google Chrome** and go to: chrome://extensions/
3. 3. Enable **Developer mode** (toggle in top right).
4. Click **Load unpacked** and select the project folder.
5. The extension will appear in your Chrome toolbar. Pin it for quick access.

---

## 📜 Usage

1. Click the extension icon to open the popup.
2. Use the toggle to enable/disable Eye Protector globally.
3. Adjust the filter opacity using the slider.
4. The filter automatically changes based on page type and time of day.

---

## 🚀 Publishing to Chrome Web Store

1. Create a ZIP file of your extension files.
2. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
3. Pay the one-time developer registration fee ($5).
4. Upload your ZIP, add descriptions, screenshots, and icons.
5. Publish!

---

## 🛠️ Tech Stack

- **Manifest V3**
- **JavaScript** (Vanilla)
- **HTML/CSS**

---

## 📄 License

This project is licensed under the MIT License. You are free to use, modify, and distribute this extension.



## 📂 Project Structure

