// Popup: one switch per feature declared in AH_FEATURES (src/settings.js), and a
// checkbox per option of a feature, disabled while the feature is off
(async () => {
  'use strict';

  const container = document.getElementById('features');
  const settings = await ahLoadSettings();

  function element(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  for (const feature of AH_FEATURES) {
    const card = element('div', 'feature');

    const row = element('label', 'feature-row');
    const text = element('div', 'feature-text');
    text.append(element('div', 'feature-label', feature.label), element('div', 'feature-description', feature.description));

    const toggle = element('span', 'switch');
    const input = element('input');
    input.type = 'checkbox';
    input.checked = settings[feature.id];
    toggle.append(input, element('span'));
    row.append(text, toggle);
    card.append(row);

    const optionInputs = (feature.options || []).map(option => {
      const optionRow = element('label', 'option');
      const checkbox = element('input');
      checkbox.type = 'checkbox';
      checkbox.checked = settings[option.id];
      checkbox.addEventListener('change', () => {
        settings[option.id] = checkbox.checked;
        ahSaveSettings(settings);
      });
      optionRow.append(checkbox, element('span', '', option.label));
      card.append(optionRow);
      return checkbox;
    });

    const syncOptions = () => {
      for (const checkbox of optionInputs) {
        checkbox.disabled = !input.checked;
        checkbox.parentElement.classList.toggle('disabled', !input.checked);
      }
    };
    input.addEventListener('change', () => {
      settings[feature.id] = input.checked;
      ahSaveSettings(settings);
      syncOptions();
    });
    syncOptions();

    container.append(card);
  }
})();
