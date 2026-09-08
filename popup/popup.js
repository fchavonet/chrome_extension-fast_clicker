/***********************************
* SYSTEM THEME ADAPTATION BEHAVIOR *
***********************************/

// Tags to which the theme class will be applied.
const targetedTags = [
  "body",
  "header",
  "#title-container",
  "header p",
  ".capture-button",
  ".button-description",
  "#status",
  "footer",
  "section",
  "kbd"
];

// Apply or remove the "dark" class on each targeted element.
function applySystemTheme(isDarkMode) {
  targetedTags.forEach(function (tagName) {
    const elements = document.querySelectorAll(tagName);

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];

      if (isDarkMode) {
        element.classList.add("dark");
      } else {
        element.classList.remove("dark");
      }
    }
  });
}

// Initialize system color-scheme query.
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

// Apply initial theme.
applySystemTheme(systemThemeQuery.matches);

// Listen for changes in system preference.
systemThemeQuery.addEventListener("change", function (event) {
  applySystemTheme(event.matches);
});


/************************
 * MODIFIER KEY BEHAVIOR
 ************************/

const modifierKeyElement = document.getElementById("modifier-key");
const isMacOperatingSystem = navigator.platform.toUpperCase().includes("MAC");

if (modifierKeyElement) {
  modifierKeyElement.textContent = isMacOperatingSystem ? "⌘" : "Ctrl";
}

/********************************
 * TOTAL CLICKS COUNTER BEHAVIOR
 ********************************/

const totalClicksCountElement = document.getElementById("total-clicks-count");
const resetButton = document.getElementById("reset-button");

const MAX_TOTAL_CLICKS = 999999999999;

function formatClickCount(count) {
  return String(count).padStart(12, "0");
}

chrome.storage.local.get(["totalClicks"], function (result) {
  if (!totalClicksCountElement) {
    return;
  }

  let totalClicks = result.totalClicks || 0;

  if (totalClicks > MAX_TOTAL_CLICKS) {
    totalClicks = MAX_TOTAL_CLICKS;
  }

  totalClicksCountElement.textContent = formatClickCount(totalClicks);
});

if (resetButton) {
  resetButton.addEventListener("click", function () {
    chrome.storage.local.set({ totalClicks: 0 }, function () {
      if (!totalClicksCountElement) {
        return;
      }

      totalClicksCountElement.textContent = formatClickCount(0);
    });
  });
}
