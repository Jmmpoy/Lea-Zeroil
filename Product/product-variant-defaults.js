/**
 * Produit : sélection par défaut des variantes et marquage option unique.
 */
  /* Sélectionner par défaut la première option réelle (non placeholder) des selects variants */
  (function selectFirstVariantOption() {
    var SINGLE_OPTION_CLASS = 'gm-single-option';

    function countOptionsWithValue(select) {
      return Array.from(select.options).filter(function (opt) { return (opt.value || '').trim() !== ''; }).length;
    }

    function markSingleOptionSelects() {
      var fieldListSelectors = '.field-list .variant-option select, .field-list .product-variant-option select, .field-list .field select';
      var pdpSelectors = '.product-detail .product-variants .variant-dropdown select';
      var otherSelectors = '.variant-select, select[name^="variant-option-"]';
      document.querySelectorAll(pdpSelectors + ', ' + fieldListSelectors + ', ' + otherSelectors).forEach(function (sel) {
        var wrapper = sel.closest('.variant-dropdown') || sel.closest('.variant-option') || sel.closest('.product-variant-option') || sel.closest('.field') || sel.closest('.variant-select-wrapper') || sel.parentElement;
        if (!wrapper) return;
        var n = countOptionsWithValue(sel);
        if (n === 1) {
          wrapper.classList.add(SINGLE_OPTION_CLASS);
        } else {
          wrapper.classList.remove(SINGLE_OPTION_CLASS);
        }
      });
    }

    function run() {
      // Sélection par défaut uniquement si une seule option réelle (ex. Taille "Petite") ; si options > 1, ne pas présélectionner
      var tailleBlock = document.querySelector('.field-list .variant-option[data-variant-option-name="Taille"]');
      if (!tailleBlock) {
        tailleBlock = document.querySelector('.field-list .variant-option.form-item.select[data-variant-option-name="Taille"]');
      }
      if (tailleBlock) {
        var tailleSelect = tailleBlock.querySelector('select');
        if (tailleSelect && countOptionsWithValue(tailleSelect) === 1) {
          var firstWithValue = Array.from(tailleSelect.options).find(function (opt) { return (opt.value || '').trim() !== ''; });
          if (firstWithValue) {
            tailleSelect.value = firstWithValue.value;
            tailleSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
      document.querySelectorAll('.variant-select, select[name^="variant-option-"]').forEach(function (sel) {
        if (countOptionsWithValue(sel) !== 1) return;
        var firstWithValue = Array.from(sel.options).find(function (opt) { return (opt.value || '').trim() !== ''; });
        if (firstWithValue) {
          sel.value = firstWithValue.value;
        }
      });
      markSingleOptionSelects();
    }
    function schedule() {
      run();
      setTimeout(run, 200);
      setTimeout(run, 500);
      setTimeout(run, 800);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule);
    else schedule();
    document.addEventListener('sqs-route-did-change', schedule);
  })();
