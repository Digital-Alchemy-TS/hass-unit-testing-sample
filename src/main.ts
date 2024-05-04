import { UNIT_TESTING_APP } from "./application";

setImmediate(async () => {
  await UNIT_TESTING_APP.bootstrap({
    configuration: {
      boilerplate: { LOG_LEVEL: "warn" },
      hass: { AUTO_SCAN_CALL_PROXY: false },
    },
  });
});
