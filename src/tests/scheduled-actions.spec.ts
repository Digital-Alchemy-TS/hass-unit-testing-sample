import { CreateTestRunner } from "@digital-alchemy/hass/mock-assistant";
import dayjs from "dayjs";

import { UNIT_TESTING_APP } from "../application";

describe("Scheduled Actions", () => {
  const runner = CreateTestRunner(UNIT_TESTING_APP);

  afterEach(async () => {
    await UNIT_TESTING_APP.teardown();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe("Cron", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it("turns on porch light at 8PM", async () => {
      expect.assertions(1);

      await runner(
        () => {
          // 7:59:59 PM
          jest.setSystemTime(dayjs("2024-01-01 19:59:59").toDate());
          jest.runOnlyPendingTimersAsync();
        },
        async ({ hass }) => {
          const turnOn = jest.spyOn(hass.call.switch, "turn_on");
          // move clock forward by 2 seconds
          jest.advanceTimersByTime(2000);
          expect(turnOn).toHaveBeenCalledWith({ entity_id: "switch.porch_light" });
        },
      );
    });
  });
});
