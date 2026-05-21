import React from "react";

export function ClickMeButton() {
  const handleClick = () => {
    console.log("Button clicked");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Click me
    </button>
  );
}
