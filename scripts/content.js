/************************
* FAST CLICKER BEHAVIOR *
************************/

if (window.fastClickerInitialized !== true) {
  window.fastClickerInitialized = true;

  // Store Fast Clicker state for the current page.
  window.fastClickerState = {
    isRunning: false,
    intervalId: null,
    hideIndicatorTimeoutId: null,
    mouseX: null,
    mouseY: null,
    clickDelay: 50
  };

  // Save the latest mouse position.
  function updateMousePosition(event) {
    window.fastClickerState.mouseX = event.clientX;
    window.fastClickerState.mouseY = event.clientY;
  }

  // Track classic mouse movement.
  document.addEventListener("mousemove", updateMousePosition);

  // Track modern pointer movement.
  document.addEventListener("pointermove", updateMousePosition);

  // Create the indicator if it does not already exist.
  function getOrCreateIndicatorElement() {
    let indicatorElement = document.getElementById("fast-clicker-indicator");

    if (indicatorElement !== null) {
      return indicatorElement;
    }

    indicatorElement = document.createElement("div");
    indicatorElement.id = "fast-clicker-indicator";

    indicatorElement.style.position = "fixed";
    indicatorElement.style.left = "2rem";
    indicatorElement.style.bottom = "2rem";
    indicatorElement.style.padding = "0.4rem 0.8rem";
    indicatorElement.style.display = "none";
    indicatorElement.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
    indicatorElement.style.fontSize = "0.8rem";
    indicatorElement.style.fontWeight = "400";
    indicatorElement.style.textTransform = "uppercase";
    indicatorElement.style.textAlign = "center";
    indicatorElement.style.color = "white";
    indicatorElement.style.borderRadius = "0.4rem";
    indicatorElement.style.boxShadow = "0 0.2rem 1rem rgba(0, 0, 0, 0.2)";
    indicatorElement.style.pointerEvents = "none";
    indicatorElement.style.zIndex = "9999";

    document.documentElement.appendChild(indicatorElement);

    return indicatorElement;
  }

  // Show the indicator with custom text and color.
  function showIndicator(htmlContent, backgroundColor) {
    const indicatorElement = getOrCreateIndicatorElement();

    indicatorElement.innerHTML = htmlContent;
    indicatorElement.style.backgroundColor = backgroundColor;
    indicatorElement.style.display = "block";
  }

  // Hide the indicator after a delay.
  function hideIndicatorAfterDelay() {
    const state = window.fastClickerState;

    if (state.hideIndicatorTimeoutId !== null) {
      clearTimeout(state.hideIndicatorTimeoutId);
    }

    state.hideIndicatorTimeoutId = setTimeout(() => {
      const indicatorElement = document.getElementById("fast-clicker-indicator");

      if (indicatorElement === null) {
        return;
      }

      indicatorElement.style.display = "none";
      state.hideIndicatorTimeoutId = null;
    }, 30000);
  }

  // Ask the background script to increment the global counter.
  function incrementTotalClicksCounter() {
    chrome.runtime.sendMessage({
      action: "increment-total-clicks"
    });
  }

  // Click at the latest known mouse position.
  function clickAtCurrentMousePosition() {
    const state = window.fastClickerState;

    if (state.mouseX === null || state.mouseY === null) {
      return;
    }

    const targetElement = document.elementFromPoint(state.mouseX, state.mouseY);

    if (targetElement === null) {
      return;
    }

    const mouseEventOptions = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: state.mouseX,
      clientY: state.mouseY
    };

    targetElement.dispatchEvent(new MouseEvent("mousedown", mouseEventOptions));
    targetElement.dispatchEvent(new MouseEvent("mouseup", mouseEventOptions));
    targetElement.dispatchEvent(new MouseEvent("click", mouseEventOptions));

    incrementTotalClicksCounter();
  }

  // Start auto-clicking.
  function startFastClicker() {
    const state = window.fastClickerState;

    if (state.isRunning === true) {
      return;
    }

    if (state.mouseX === null || state.mouseY === null) {
      showIndicator("Move your mouse where you want to click", "#ca8a04");
      return;
    }

    if (state.hideIndicatorTimeoutId !== null) {
      clearTimeout(state.hideIndicatorTimeoutId);
      state.hideIndicatorTimeoutId = null;
    }

    state.isRunning = true;

    state.intervalId = setInterval(() => {
      clickAtCurrentMousePosition();
    }, state.clickDelay);

    showIndicator("Fast Clicker ON", "#16a34a");
  }

  // Stop auto-clicking.
  function stopFastClicker() {
    const state = window.fastClickerState;

    if (state.isRunning === false) {
      return;
    }

    state.isRunning = false;

    clearInterval(state.intervalId);
    state.intervalId = null;

    showIndicator("Fast Clicker OFF", "#222222");
    hideIndicatorAfterDelay();
  }

  // Toggle auto-clicking on or off.
  function toggleFastClicker() {
    const state = window.fastClickerState;

    if (state.isRunning === true) {
      stopFastClicker();
      return;
    }

    startFastClicker();
  }

  // Allow background.js to trigger the toggle.
  window.fastClickerToggle = toggleFastClicker;
}