javascript: (function () {
  const styleId = "focus-blackout-style";
  const labelId = "focus-aria-label";
  let styleEl = document.getElementById(styleId);
  let labelEl = document.getElementById(labelId);
  if (styleEl) {
    styleEl.remove();
    if (labelEl) labelEl.remove();
    document.removeEventListener("focusin", window._focusHandler);
    return;
  }
  styleEl = document.createElement("style");
  styleEl.id = styleId;
  styleEl.textContent = `html * { background-color: #000000 !important; color: #000000 !important; border-color: #000000 !important; box-shadow: none !important; text-shadow: none !important; } :focus, :focus *, :has(:focus) { background-color: revert !important; color: revert !important; border-color: revert !important; box-shadow: revert !important; text-shadow: revert !important; outline: 3px solid #00ffcc !important; outline-offset: 4px !important; } #${labelId} { position: absolute; background: #00ffcc !important; color: #000000 !important; font-family: sans-serif !important; font-size: 12px !important; font-weight: bold !important; padding: 6px 10px !important; border-radius: 4px !important; z-index: 2147483647 !important; pointer-events: none !important; white-space: nowrap !important; box-shadow: 0 4px 10px rgba(0,0,0,0.5) !important; line-height: 1.2 !important; }`;
  document.head.appendChild(styleEl);
  labelEl = document.createElement("div");
  labelEl.id = labelId;
  document.body.appendChild(labelEl);
  window._focusHandler = function (e) {
    const el = e.target;
    let name = "";
    if (el.getAttribute("aria-label")) {
      name = el.getAttribute("aria-label");
    } else if (el.getAttribute("aria-labelledby")) {
      const ref = document.getElementById(el.getAttribute("aria-labelledby"));
      if (ref) name = ref.innerText;
    }
    if (!name.trim()) {
      name =
        el.placeholder || el.title || el.alt || el.innerText || el.value || "";
    }
    name = name.trim() || "[No Accessible Name]";
    let role = el.getAttribute("role");
    if (!role) {
      const tag = el.tagName.toLowerCase();
      if (tag === "button") role = "button";
      else if (tag === "a" && el.hasAttribute("href")) role = "link";
      else if (tag === "input") {
        const type = el.type || "text";
        if (
          ["checkbox", "radio", "submit", "button", "image", "reset"].includes(
            type,
          )
        )
          role = type;
        else role = "textbox";
      } else if (tag === "textarea") role = "textbox";
      else if (tag === "select") role = "combobox";
      else if (tag === "details") role = "group";
      else if (el.hasAttribute("tabindex")) role = "generic";
      else role = tag;
    }
    labelEl.textContent = `Role: <${role.toUpperCase()}> | Name: ${name}`;
    const rect = el.getBoundingClientRect();
    labelEl.style.top = `${rect.top + window.scrollY - labelEl.offsetHeight - 8}px`;
    labelEl.style.left = `${rect.left + window.scrollX}px`;
  };
  document.addEventListener("focusin", window._focusHandler);
  if (document.activeElement && document.activeElement !== document.body)
    window._focusHandler({ target: document.activeElement });
})();
