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

  describe("Smoke Detector", () => {
    const NO_ALERT_HOURS = new Set([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    const LOCATIONS = ["away", "home"] as const;

    beforeEach(() => {
      jest.useFakeTimers();
    });

    //
    // Generate 2 batches of tests:
    // - while home
    // - while away
    //
    LOCATIONS.forEach(location => {
      describe("at " + location, () => {
        //
        // each batch will have a test for each hour of the day, ensuring the action does or does not happen
        //
        for (let hour = 0; hour < 24; hour++) {
          const prefix = location === "home" && NO_ALERT_HOURS.has(hour) ? "does" : "does not";
          const formatted = hour > 9 ? hour.toString() : `0${hour.toString()}`;

          // the actual test!
          it(`${prefix} run at ${formatted}`, async () => {
            expect.assertions(1);

            await runner(
              ({ mock_assistant }) => {
                // set initial state
                mock_assistant.fixtures.setState({
                  "binary_sensor.smoke_detector": { state: "off" },
                  "sensor.location": { state: location },
                });
                jest.setSystemTime(dayjs(`2024-01-01 ${formatted}:00:00`).toDate());
                jest.runOnlyPendingTimersAsync();
              },
              async ({ mock_assistant, hass }) => {
                // set up watcher
                const turnOn = jest.spyOn(hass.call.scene, "turn_on");
                // emit update
                await mock_assistant.events.emitEntityUpdate("binary_sensor.smoke_detector", {
                  state: "on",
                });
                // observe result
                if (NO_ALERT_HOURS.has(hour) || location !== "home") {
                  expect(turnOn).not.toHaveBeenCalledWith({ entity_id: ["scene.bedroom_high"] });
                } else {
                  expect(turnOn).toHaveBeenCalledWith({ entity_id: ["scene.bedroom_high"] });
                }
              },
            );
          });
        }
      });
    });
  });
});
