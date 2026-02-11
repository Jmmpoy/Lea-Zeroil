/**
 * Formulaire : normaliser le téléphone (retirer les espaces).
 */
  (function contactPhoneStripSpaces() {
    var SECTION_ID = "6955321ea3ec302437387bc9";

    function run() {
      var section = document.querySelector('section[data-section-id="' + SECTION_ID + '"]');
      if (!section) return;
      var phoneInput = document.getElementById("phone-80707149-7f86-4f64-b478-24cfc009ea55-input-field");
      if (!phoneInput) return;

      function stripSpaces() {
        var start = phoneInput.selectionStart;
        var end = phoneInput.selectionEnd;
        var value = phoneInput.value;
        var cleaned = value.replace(/\s/g, "");
        if (cleaned === value) return;
        phoneInput.value = cleaned;
        var diff = value.length - cleaned.length;
        var newStart = Math.max(0, start - (value.slice(0, start).length - value.slice(0, start).replace(/\s/g, "").length));
        var newEnd = Math.max(newStart, end - diff);
        phoneInput.setSelectionRange(newStart, newEnd);
      }

      if (!phoneInput.hasAttribute("data-gm-phone-strip")) {
        phoneInput.setAttribute("data-gm-phone-strip", "1");
        phoneInput.addEventListener("input", stripSpaces);
        phoneInput.addEventListener("paste", function () {
          setTimeout(stripSpaces, 0);
        });
        if (phoneInput.value) stripSpaces();
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    setTimeout(run, 500);
    document.addEventListener("sqs-route-did-change", run);
  })();
