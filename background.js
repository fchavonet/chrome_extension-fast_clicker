/*****************************
* KEYBOARD SHORTCUT BEHAVIOR *
*****************************/

chrome.commands.onCommand.addListener((commandName) => {
  // Ignore unrelated commands.
  if (commandName !== "toggle-autoclicker") {
    return;
  }

  // Get the active tab in the current window.
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // Exit if no active tab found.
    if (tabs.length === 0) {
      return;
    }

    const activeTab = tabs[0];

    // Ensure the tab has a valid id.
    if (activeTab.id === undefined) {
      return;
    }

    // Inject content script into the page.
    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab.id },
        files: ["scripts/content.js"]
      },
      () => {
        // Handle injection errors.
        if (chrome.runtime.lastError) {
          console.log("Fast Clicker injection error:", chrome.runtime.lastError.message);
          return;
        }

        // Execute toggle function inside the page context.
        chrome.scripting.executeScript(
          {
            target: { tabId: activeTab.id },
            func: () => {
              window.fastClickerToggle();
            }
          },
          () => {
            // Handle execution errors.
            if (chrome.runtime.lastError) {
              console.log("Fast Clicker toggle error:", chrome.runtime.lastError.message);
            }
          }
        );
      }
    );
  });
});


/********************************
* TOTAL CLICKS COUNTER BEHAVIOR *
********************************/

// Listen for messages from content script.
chrome.runtime.onMessage.addListener((message) => {
  // Ignore unrelated messages
  if (message.action !== "increment-total-clicks") {
    return;
  }

  // Retrieve current click count from storage.
  chrome.storage.local.get(["totalClicks"], (result) => {
    const currentTotalClicks = result.totalClicks || 0;

    // Increment click count.
    const updatedTotalClicks = currentTotalClicks + 1;

    // Save updated value.
    chrome.storage.local.set({
      totalClicks: updatedTotalClicks
    });
  });
});