/**
 * Formulaire : select custom dans la section contact.
 */
  (function initCustomSelect(retry = 30) {
    const SECTION_ID = "6955321ea3ec302437387bc9";
    const root = document.querySelector(`section[data-section-id="${SECTION_ID}"]`);
    if (!root) {
      if (retry > 0) return setTimeout(() => initCustomSelect(retry - 1), 250);
      return;
    }

    function enhanceSelect(wrapper) {
      if (!wrapper || wrapper.classList.contains("gm-enhanced")) return;

      const nativeSelect = wrapper.querySelector("select");
      if (!nativeSelect) return;

      wrapper.classList.add("gm-enhanced");

      const options = Array.from(nativeSelect.querySelectorAll("option"))
        .filter(opt => !opt.disabled);

      const selectedText = nativeSelect.options[nativeSelect.selectedIndex]?.textContent || "";

      const custom = document.createElement("div");
      custom.className = "gm-select";
      custom.innerHTML = `
      <button type="button" class="gm-select__btn" aria-haspopup="listbox" aria-expanded="false">
        <span class="gm-select__value">${selectedText}</span>
        <span class="gm-select__chev" aria-hidden="true">
          <svg class="gm-chevron" width="11" height="7" viewBox="0 0 11 7" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.3398 5.79202L5.27110.222858L0.202363 5.79202L0.478481 6.0954L5.27110.829616L10.0637 6.0954L10.3398 5.79202Z" fill="currentColor" stroke="currentColor" stroke-width="0.3"></path>
          </svg>
        </span>
      </button>
      <ul class="gm-select__list" role="listbox">
        ${options.map(opt => `<li><button type="button" class="gm-select__opt">${opt.textContent}</button></li>`).join("")}
      </ul>
    `;

      wrapper.appendChild(custom);

      const btn = custom.querySelector(".gm-select__btn");
      const list = custom.querySelector(".gm-select__list");
      const value = custom.querySelector(".gm-select__value");

      function open() {
        custom.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }

      function close() {
        custom.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }

      btn.addEventListener("click", () => {
        custom.classList.contains("is-open") ? close() : open();
      });

      list.querySelectorAll(".gm-select__opt").forEach((optBtn, idx) => {
        optBtn.addEventListener("click", () => {
          nativeSelect.selectedIndex = idx;
          nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
          value.textContent = optBtn.textContent;
          close();
        });
      });

      document.addEventListener("click", (e) => {
        if (!custom.contains(e.target)) close();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
    }

    function run() {
      root.querySelectorAll(".form-item.field.select").forEach(enhanceSelect);
    }

    run();

    const mo = new MutationObserver(run);
    mo.observe(root, { childList: true, subtree: true });
  })();
