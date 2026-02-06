/**
 * Newsletter Form - Formulaire de newsletter personnalisé
 * 
 * Remplace le formulaire de newsletter natif de Squarespace par une version
 * personnalisée avec un design et un comportement sur mesure. Synchronise
 * les données avec le formulaire natif en arrière-plan pour conserver la
 * fonctionnalité d'inscription de Squarespace.
 * 
 * Fonctionnalités :
 * - Remplacement du formulaire natif par une interface personnalisée
 * - Synchronisation bidirectionnelle avec le formulaire Squarespace natif
 * - Validation HTML5 intégrée
 * - Détection automatique de la soumission réussie
 * - Affichage d'un message de confirmation "Merci" après inscription
 * - Polling et MutationObserver pour détecter le succès
 * - Gestion des erreurs et des cas limites
 * - Compatible avec la navigation AJAX de Squarespace
 * 
 * Structure HTML requise :
 * - Conteneur personnalisé : footer .newsline
 * - Formulaire natif Squarespace : footer .sqs-block-newsletter
 * - Input personnalisé : .news-input
 * - Bouton personnalisé : .news-btn
 * 
 * Processus :
 * 1. L'utilisateur saisit son email dans le champ personnalisé
 * 2. La valeur est synchronisée avec le champ natif en temps réel
 * 3. Au clic sur "OK →", le formulaire natif est soumis
 * 4. Le script détecte la réponse de succès de Squarespace
 * 5. Le formulaire est remplacé par "Merci"
 * 
 * Usage : Charger uniquement sur les pages contenant le footer avec newsletter
 */
document.addEventListener("DOMContentLoaded", function () {

  var NEWSLETTER_FORM_HTML = "<input class=\"news-input\" placeholder=\"Adresse mail\" /><button class=\"news-btn\">OK →</button>";

  function run() {
    var customForm = document.querySelector("footer .newsline");
    if (customForm && customForm.querySelector(".news-success")) {
      customForm.removeAttribute("data-newsletter-sync-bound");
      customForm.innerHTML = NEWSLETTER_FORM_HTML;
    }

    customForm = document.querySelector("footer .newsline");
    var customInput = customForm?.querySelector(".news-input");
    var customButton = customForm?.querySelector(".news-btn");

    var nativeBlock = document.querySelector("footer .sqs-block-newsletter");
    var nativeForm = nativeBlock?.querySelector("form.newsletter-form");
    var nativeInput = nativeForm?.querySelector('input[name="email"], input[type="email"]');
    var nativeButton = nativeForm?.querySelector('button[type="submit"]');

    if (!customForm || !customInput || !nativeForm || !nativeInput || !nativeButton) {
      return;
    }
    if (customForm.hasAttribute("data-newsletter-sync-bound")) {
      return;
    }
    customForm.setAttribute("data-newsletter-sync-bound", "true");

    nativeForm.scrollIntoView = function () { };

    var submittedThisSession = false;

    function syncToNative() {
      nativeInput.value = customInput.value;
    }

    function submitNative() {
      if (!customInput.checkValidity()) {
        customInput.reportValidity();
        return;
      }
      submittedThisSession = true;
      syncToNative();
      nativeButton.click();
    }

    customInput.addEventListener("input", syncToNative);
    customInput.addEventListener("change", syncToNative);

    function showMerci() {
      if (customForm.querySelector(".news-success")) return;
      customForm.innerHTML = "<p class='news-success'>Merci</p>";
    }

    function isSuccessDetected() {
      if (!nativeBlock) return false;
      var submission = nativeBlock.querySelector(".form-submission-html, .form-submission-text");
      if (submission && (submission.innerHTML.trim() !== "" || submission.getAttribute("data-submission-html"))) return true;
      var text = (nativeBlock.innerText || "").toLowerCase();
      return /thank|merci|success|subscribed|inscrit|envoyé/.test(text);
    }

    var observer = new MutationObserver(function () {
      if (submittedThisSession && isSuccessDetected()) {
        showMerci();
        observer.disconnect();
      }
    });
    observer.observe(nativeBlock, { childList: true, subtree: true, characterData: true, attributes: true });

    var polling = false;
    function onCustomSubmit() {
      if (polling) return;
      polling = true;
      var attempts = 0;
      var poll = setInterval(function () {
        attempts++;
        if (submittedThisSession && isSuccessDetected()) {
          clearInterval(poll);
          polling = false;
          showMerci();
          return;
        }
        if (attempts >= 16) {
          clearInterval(poll);
          polling = false;
        }
      }, 500);
    }

    customForm.addEventListener("submit", function (e) {
      e.preventDefault();
      submitNative();
      onCustomSubmit();
    });

    if (customButton) {
      customButton.addEventListener("click", function (e) {
        e.preventDefault();
        submitNative();
        onCustomSubmit();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  setTimeout(run, 800);
  setTimeout(run, 2000);
  document.addEventListener("sqs-route-did-change", run);
  run();
});
