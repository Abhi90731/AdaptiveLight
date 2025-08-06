function getColorByType(type, opacity) {
  const hour = new Date().getHours();

  if (type === "nightReading") return `rgba(255, 210, 150, ${opacity})`; // warmest
  if (type === "reading") return `rgba(255, 220, 180, ${opacity})`;      // warm
  if (type === "video") {
    if (hour >= 6 && hour <= 18) {
      return `rgba(255, 240, 220, ${opacity})`;  // very light during day
    } else {
      return `rgba(255, 225, 190, ${opacity})`;  // medium tint at night
    }
  }
  return `rgba(255, 230, 200, ${opacity})`;      // fallback
}

function detectContentType() {
  const hostname = window.location.hostname;
  const bodyText = document.body?.innerText?.trim() || "";
  const bodyHasContent = bodyText.length > 30 || document.querySelector("section, article, main, div");

  if (!bodyHasContent) {
    return {
      rawType: "generic",
      stats: {
        hostname,
        readingBlocks: 0,
        videoCards: 0,
        imageHeavyBlocks: 0,
        totalImages: 0
      }
    };
  }

  const knownGenericSites = ["google.com", "amazon.com", "flipkart.com"];
  const knownVideoSites = ["youtube.com", "vimeo.com", "dailymotion.com","primevideo.com","netflix.com","hotstar.com"];

  const blocks = document.querySelectorAll("section, article, div, main");
  let readingBlocks = 0;
  let videoCards = 0;
  let imageHeavyBlocks = 0;
  let totalImages = document.querySelectorAll("img").length;

  blocks.forEach((block) => {
    const textLength = block.innerText?.length || 0;
    const images = block.querySelectorAll("img").length;
    const videos = block.querySelectorAll("video").length;
    const hasEmbeddedVideo = !!block.querySelector("iframe[src*='youtube.com/embed']");

    if (textLength > 1000 && images < 20) readingBlocks++;
    if (videos >= 1 || hasEmbeddedVideo) videoCards++;
    if (images >= 10) imageHeavyBlocks++;
  });

  let resultType = "generic";

  if (document.fullscreenElement) {
    resultType = "fullscreenVideo";
  } else if (knownVideoSites.some(domain => hostname.includes(domain))) {
    resultType = "video";
  } else if (videoCards >= 15) {
    resultType = "video";
  } else if (readingBlocks >= 8 && imageHeavyBlocks <= 10 && !knownGenericSites.some(domain => hostname.includes(domain))) {
    resultType = "reading";
  } else if (imageHeavyBlocks >= 8 && totalImages >= 100) {
    resultType = "generic";
  } else if (knownGenericSites.some(domain => hostname.includes(domain))) {
    resultType = "generic";
  }

  return {
    rawType: resultType,
    stats: {
      hostname,
      readingBlocks,
      videoCards,
      imageHeavyBlocks,
      totalImages
    }
  };
}

function isScreenSharingActive() {
  const screenShareKeywords = [
    "you are presenting", "you're presenting", "you're sharing your screen",
    "screen sharing", "presentation is live", "presenting to everyone",
    "stop presenting", "stop sharing", "view options", "is sharing their screen"
  ];

  const pageText = document.body.innerText.toLowerCase();
  return screenShareKeywords.some(keyword => pageText.includes(keyword));
}

function applyFilter(type, opacity = 0.25) {
  const existingFilter = document.getElementById("eye-filter");
  const bgColor = getColorByType(type, opacity);

  if (existingFilter) {
    existingFilter.style.transition = "background-color 0.6s ease, opacity 1s ease";
    existingFilter.style.backgroundColor = bgColor;
    existingFilter.style.opacity = "1";
    return;
  }

  const filter = document.createElement("div");
  filter.id = "eye-filter";
  filter.style.position = "fixed";
  filter.style.top = "0";
  filter.style.left = "0";
  filter.style.width = "100vw";
  filter.style.height = "100vh";
  filter.style.zIndex = "2147483647";
  filter.style.pointerEvents = "none";
  filter.style.opacity = "0";
  filter.style.backgroundColor = bgColor;
  filter.style.transition = "background-color 0.6s ease, opacity 1s ease";
  document.body.appendChild(filter);

  requestAnimationFrame(() => {
    filter.style.opacity = "1";
  });
}

function removeFilterWithFade() {
  const existingFilter = document.getElementById("eye-filter");
  if (existingFilter) {
    existingFilter.style.transition = "opacity 1s ease";
    existingFilter.style.opacity = "0";
    setTimeout(() => existingFilter.remove(), 1000);
  }
}

// ---- NEW unified detection runner ----
function runEyeDetection(stage = "Initial") {
  chrome.storage.local.get(["eyeProtectorEnabled", "filterOpacity"], (result) => {
    const isEnabled = result.eyeProtectorEnabled !== false;
    const opacity = result.filterOpacity || 0.25;
    const hour = new Date().getHours();
    const isNight = hour >= 20 || hour <= 6;

    const { rawType, stats } = detectContentType();
    let type = rawType;

    if (!isEnabled) {
      removeFilterWithFade();
      return;
    }

    if (isScreenSharingActive() || type === "fullscreenVideo") {
      removeFilterWithFade();
      return;
    }

    // Apply night reading mode early if needed
    if (type === "reading" && isNight) {
      type = "nightReading";
    }

    const color = getColorByType(type, opacity);

    // Log Initial or Final detection explicitly
    const logKey = `__eyeProtectorLogged_${stage}`;
    if (!window[logKey]) {
      console.log(`[Eye Protector] ${stage} Detection → ${type}`);
      console.log("Blocks:", stats);
      console.log("Applied Color:", color);
      window[logKey] = true;
    }

    applyFilter(type, opacity);
  });
}

// ---- Run once on load with delays ----
window.addEventListener("load", () => {
  setTimeout(() => runEyeDetection("Initial"), 500);
  setTimeout(() => runEyeDetection("Final"), 5000);
});

// ---- Mutation observer only active until Final logged ----
const observer = new MutationObserver(() => {
  if (!window.__eyeProtectorLogged_Final) {
    runEyeDetection("Final");
  }
});
observer.observe(document.body, { childList: true, subtree: true });
