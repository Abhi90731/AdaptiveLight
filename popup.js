const toggle = document.getElementById("toggleExtension");
const opacitySlider = document.getElementById("filterOpacity");

// Load toggle state
chrome.storage.local.get(["eyeProtectorEnabled"], (result) => {
  toggle.checked = result.eyeProtectorEnabled !== false;
});

// Enable/disable extension
toggle.addEventListener("change", () => {
  chrome.storage.local.set({ eyeProtectorEnabled: toggle.checked });

  chrome.tabs.query({}, (tabs) => {
    for (let tab of tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          if (typeof smartEyeAdjust === "function") {
            smartEyeAdjust();
          }
        }
      });
    }
  });
});

// Load slider value
chrome.storage.local.get(["filterOpacity"], (res) => {
  opacitySlider.value = res.filterOpacity || 0.25;
});

// Live preview on slider move (reflecting detected type)
opacitySlider.addEventListener("input", (e) => {
  const newOpacity = parseFloat(e.target.value);
  chrome.storage.local.set({ filterOpacity: newOpacity });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (opacity) => {
        const type = window.__eyeProtectorLastDetectedType || "reading";
        const colorMap = {
          nightReading: `rgba(255, 210, 150, ${opacity})`,
          reading: `rgba(255, 220, 180, ${opacity})`,
          video: `rgba(255, 210, 160, ${opacity})`,
          generic: `rgba(255, 230, 200, ${opacity})`,
        };

        const filter = document.getElementById("eye-filter");
        if (filter) {
          filter.style.transition = "background-color 0.6s ease, opacity 1s ease";
          filter.style.opacity = "1";
          filter.style.backgroundColor = colorMap[type] || colorMap.reading;
        }
      },
      args: [newOpacity]
    });
  });
});

// Reset to default
document.getElementById("resetDefaults").addEventListener("click", () => {
  const defaultOpacity = 0.25;
  chrome.storage.local.set({ filterOpacity: defaultOpacity });
  opacitySlider.value = defaultOpacity;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (opacity) => {
        const type = window.__eyeProtectorLastDetectedType || "reading";
        const colorMap = {
          nightReading: `rgba(255, 210, 150, ${opacity})`,
          reading: `rgba(255, 220, 180, ${opacity})`,
          video: `rgba(255, 210, 160, ${opacity})`,
          generic: `rgba(255, 230, 200, ${opacity})`,
        };

        const filter = document.getElementById("eye-filter");
        if (filter) {
          filter.style.transition = "background-color 0.6s ease, opacity 1s ease";
          filter.style.opacity = "1";
          filter.style.backgroundColor = colorMap[type] || colorMap.reading;
        }
      },
      args: [defaultOpacity]
    });
  });
});
