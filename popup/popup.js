/*
 * popup.js
 *
 * Ce fichier est exécuté uniquement dans la popup de l’extension.
 *
 * Il gère deux comportements :
 * 1. afficher la bonne touche selon le système d’exploitation ;
 * 2. afficher le compteur total d’autoclics.
 */

/************************
 * MODIFIER KEY BEHAVIOR
 ************************/

/*
 * On récupère l’élément HTML qui affiche la touche principale du raccourci.
 *
 * Dans popup.html, cet élément doit avoir :
 * id="modifier-key"
 */
const modifierKeyElement = document.getElementById("modifier-key");

/*
 * On détecte si l’utilisateur est sur macOS.
 *
 * navigator.platform donne une information sur la plateforme utilisée.
 * On met la chaîne en majuscules pour éviter les problèmes de casse.
 */
const isMacOperatingSystem = navigator.platform.toUpperCase().includes("MAC");

/*
 * Si l’élément existe bien dans le HTML, on modifie son texte.
 */
if (modifierKeyElement) {
  /*
   * Sur Mac, on affiche la touche Command.
   * Sur les autres systèmes, on affiche Ctrl.
   */
  modifierKeyElement.textContent = isMacOperatingSystem ? "⌘" : "Ctrl";
}

/********************************
 * TOTAL CLICKS COUNTER BEHAVIOR
 ********************************/

/*
 * On récupère l’élément HTML qui affichera le compteur de clics.
 *
 * Attention :
 * l’id doit correspondre exactement à celui présent dans popup.html.
 */
const totalClicksCountElement = document.getElementById("total-clicks-count");

/*
 * On lit la valeur totalClicks depuis le stockage local de l’extension.
 */
chrome.storage.local.get(["totalClicks"], (result) => {
  /*
   * Si l’élément HTML n’existe pas, on arrête.
   */
  if (!totalClicksCountElement) {
    return;
  }

  /*
   * Si totalClicks n’existe pas encore, on affiche 0.
   */
  const totalClicks = result.totalClicks || 0;

  /*
   * On affiche le nombre total d’autoclics dans la popup.
   */
  totalClicksCountElement.textContent = totalClicks;
});


