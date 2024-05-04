import { TServiceParams } from "@digital-alchemy/core";
import { LIB_MOCK_ASSISTANT } from "@digital-alchemy/hass/mock-assistant";

import { UNIT_TESTING_APP } from "../application";

describe("Scheduled Actions", () => {
  afterEach(async () => {
    // tear down the app at the end of the test to reset
    await UNIT_TESTING_APP.teardown();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("tests", async () => {
    jest.useFakeTimers();
    expect.assertions(1);

    await UNIT_TESTING_APP.bootstrap({
      appendLibrary: LIB_MOCK_ASSISTANT,
      appendService: {
        Runner({ mock_assistant, lifecycle, hass }: TServiceParams) {
          // set initial state
          mock_assistant.fixtures.setState({
            "binary_sensor.smoke_detector": { state: "off" },
            "sensor.location": { state: "home" },
          });
          // set to 10PM
          jest.setSystemTime(new Date("2024-01-01 22:00:00"));
          lifecycle.onReady(async () => {
            // set up watcher
            const turnOn = jest.spyOn(hass.call.scene, "turn_on");
            // emit update
            await mock_assistant.events.emitEntityUpdate("binary_sensor.smoke_detector", {
              state: "on",
            });
            // observe result
            expect(turnOn).toHaveBeenCalledWith({ entity_id: ["scene.bedroom_high"] });
          });
          // run the application through onReady
          jest.runOnlyPendingTimersAsync();
        },
      },
      configuration: {
        boilerplate: { LOG_LEVEL: "error" },
        hass: { MOCK_SOCKET: true },
      },
    });
  });

  it("second tests", async () => {
    jest.useFakeTimers();
    expect.assertions(1);

    await UNIT_TESTING_APP.bootstrap({
      appendLibrary: LIB_MOCK_ASSISTANT,
      appendService: {
        Runner({ mock_assistant, lifecycle, hass }: TServiceParams) {
          // set to 7:59:59PM (1 second before event)
          jest.setSystemTime(new Date("2024-01-01 19:59:59"));
          lifecycle.onReady(async () => {
            // set up watcher
            const turnOn = jest.spyOn(hass.call.switch, "turn_on");
            // move clock forward by 2 secondsnotify
            jest.advanceTimersByTime(2000);
            // observe result
            expect(turnOn).toHaveBeenCalledWith({ entity_id: ["switch.porch_light"] });
          });
          // run the application through onReady
          jest.runOnlyPendingTimersAsync();
        },
      },
      configuration: {
        boilerplate: { LOG_LEVEL: "error" },
        hass: { MOCK_SOCKET: true },
      },
    });
  });
});
