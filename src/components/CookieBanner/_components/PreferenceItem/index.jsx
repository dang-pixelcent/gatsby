import React, { useState } from "react";

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`preference-toggle ${
      checked ? "preference-toggle--checked" : ""
    }`}
  >
    <span
      className={`preference-toggle__knob ${
        checked ? "preference-toggle__knob--checked" : ""
      }`}
    />
  </button>
);

const PreferenceItem = ({
  label,
  description,
  isAlwaysActive = false,
  checked = false,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="preference-item">
      {/* Row header */}
      <div className="preference-item__header">
        <span className="preference-item__label">{label}</span>

        <div className="preference-item__controls">
          {isAlwaysActive ? (
            <span className="preference-item__always-active">
              Always active
            </span>
          ) : (
            <Toggle checked={checked} onChange={onChange} />
          )}

          {/* Chevron */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="preference-item__chevron-btn"
            aria-label={open ? "Collapse" : "Expand"}
          >
            <svg
              className={`preference-item__chevron-icon ${
                open ? "preference-item__chevron-icon--open" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Description (accordion) */}
      <div
        className={`preference-item__content ${
          open ? "preference-item__content--open" : ""
        }`}
      >
        <p className="preference-item__description">{description}</p>
      </div>
    </div>
  );
};

export default PreferenceItem;
