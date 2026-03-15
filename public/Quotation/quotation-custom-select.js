/**
 * Formulaire devis : select custom pour Produit et Pays.
 * Cible la section 6939b405d90b6131b1aefbbd.
 */
(function initQuotationCustomSelect(retry) {
  if (retry === undefined) retry = 30;

  var SECTION_ID = "6939b405d90b6131b1aefbbd";
  var root = document.querySelector('section[data-section-id="' + SECTION_ID + '"]');
  var PREFILL_DONE = false;
  var runTimer = null;

  if (!root) {
    if (retry > 0) {
      return setTimeout(function () {
        initQuotationCustomSelect(retry - 1);
      }, 250);
    }
    return;
  }

  var CHEVRON_SVG =
    '<svg class="gm-chevron" width="11" height="7" viewBox="0 0 11 7" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M10.3398 5.79202L5.27110.222858L0.202363 5.79202L0.478481 6.0954L5.27110.829616L10.0637 6.0954L10.3398 5.79202Z" fill="currentColor" stroke="currentColor" stroke-width="0.3"></path>' +
    '</svg>';

  function enhanceSelect(wrapper) {
    if (!wrapper || wrapper.classList.contains("gm-enhanced")) return;

    var nativeSelect = wrapper.querySelector("select");
    if (!nativeSelect) return;

    wrapper.classList.add("gm-enhanced");

    var options = [];
    for (var i = 0; i < nativeSelect.options.length; i++) {
      if (!nativeSelect.options[i].disabled && !nativeSelect.options[i].hidden) {
        options.push(nativeSelect.options[i]);
      }
    }

    var selectedText = nativeSelect.options[nativeSelect.selectedIndex]
      ? nativeSelect.options[nativeSelect.selectedIndex].textContent.trim()
      : "";

    var custom = document.createElement("div");
    custom.className = "gm-select";

    var btnEl = document.createElement("button");
    btnEl.type = "button";
    btnEl.className = "gm-select__btn";
    btnEl.setAttribute("aria-haspopup", "listbox");
    btnEl.setAttribute("aria-expanded", "false");

    var valueSpan = document.createElement("span");
    valueSpan.className = "gm-select__value";
    valueSpan.textContent = selectedText;

    var chevSpan = document.createElement("span");
    chevSpan.className = "gm-select__chev";
    chevSpan.setAttribute("aria-hidden", "true");
    chevSpan.innerHTML = CHEVRON_SVG;

    btnEl.appendChild(valueSpan);
    btnEl.appendChild(chevSpan);

    var listEl = document.createElement("ul");
    listEl.className = "gm-select__list";
    listEl.setAttribute("role", "listbox");

    options.forEach(function (opt) {
      var li = document.createElement("li");
      var optBtn = document.createElement("button");
      optBtn.type = "button";
      optBtn.className = "gm-select__opt";
      optBtn.textContent = opt.textContent.trim();
      li.appendChild(optBtn);
      listEl.appendChild(li);

      optBtn.addEventListener("click", function () {
        var text = opt.textContent.trim();
        nativeSelect.value = opt.value;
        nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
        valueSpan.textContent = text;
        close();
      });
    });

    custom.appendChild(btnEl);
    custom.appendChild(listEl);
    wrapper.appendChild(custom);

    function open() {
      custom.classList.add("is-open");
      btnEl.setAttribute("aria-expanded", "true");
    }

    function close() {
      custom.classList.remove("is-open");
      btnEl.setAttribute("aria-expanded", "false");
    }

    btnEl.addEventListener("click", function () {
      custom.classList.contains("is-open") ? close() : open();
    });

    document.addEventListener("click", function (e) {
      if (!custom.contains(e.target)) close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function getProductFromUrl() {
    try {
      var params = new URLSearchParams(window.location.search);
      var product = params.get("product");
      return product ? product.trim() : "";
    } catch (e) {
      return "";
    }
  }

  function findProductSelectWrapper() {
    var items = root.querySelectorAll(".form-item.field.select");
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.classList.contains("country-select")) continue;

      var label = item.querySelector("label");
      var text = label ? (label.textContent || "").trim() : "";

      if (/produit/i.test(text)) return item;
    }
    return items[0] || null;
  }

  function findProductNameInput() {
    var items = root.querySelectorAll(".field-list .form-item.field.text");

    for (var i = 0; i < items.length; i++) {
      var label = items[i].querySelector("label");
      var text = label ? (label.textContent || "").trim() : "";

      if (/nom du produit/i.test(text)) {
        return items[i].querySelector("input[type='text']");
      }
    }

    return null;
  }

  function prefillProductNameFromUrl() {
    var productParam = getProductFromUrl();
    if (!productParam) return;

    var input = findProductNameInput();
    if (!input) return;

    if (input.value !== productParam) {
      input.value = productParam;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function prefillProductFromUrl() {
    var productParam = getProductFromUrl();
    if (!productParam) return;

    var wrapper = findProductSelectWrapper();
    if (!wrapper) return;

    var nativeSelect = wrapper.querySelector("select");
    if (!nativeSelect || !nativeSelect.options.length) return;

    var paramUpper = productParam.toUpperCase();
    var options = nativeSelect.options;

    for (var i = 0; i < options.length; i++) {
      var optText = (options[i].textContent || "").trim();
      if (!optText) continue;

      if (
        optText.toUpperCase() === paramUpper ||
        optText.toUpperCase().indexOf(paramUpper) !== -1 ||
        paramUpper.indexOf(optText.toUpperCase()) !== -1
      ) {
        if (nativeSelect.selectedIndex !== i) {
          nativeSelect.selectedIndex = i;
          nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
        }

        var valueSpan = wrapper.querySelector(".gm-select__value");
        if (valueSpan) valueSpan.textContent = optText;
        break;
      }
    }
  }

  function run() {
    root.querySelectorAll(".form-item.field.select").forEach(enhanceSelect);
    root.querySelectorAll(".country-select").forEach(enhanceSelect);

    prefillProductFromUrl();
    prefillProductNameFromUrl();
  }

  run();

  var mo = new MutationObserver(function () {
    clearTimeout(runTimer);
    runTimer = setTimeout(run, 120);
  });

  mo.observe(root, { childList: true, subtree: true });
})();
