import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClickMeButton } from "./ClickMeButton";

test('logs "Button clicked" when pressed', async () => {
  const user = userEvent.setup();
  const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  render(<ClickMeButton />);
  await user.click(screen.getByRole("button", { name: /click me/i }));

  expect(logSpy).toHaveBeenCalledWith("Button clicked");

  logSpy.mockRestore();
});
