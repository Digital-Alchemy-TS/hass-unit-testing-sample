import { LIB_AUTOMATION } from "@digital-alchemy/automation";
import { CreateApplication } from "@digital-alchemy/core";
import { LIB_HASS } from "@digital-alchemy/hass";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isBetween from "dayjs/plugin/isBetween";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";

import { MiscEvents } from "./logic/misc-events";
import { Safety } from "./logic/safety";
import { ScheduledActions } from "./logic/scheduled-actions";

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(isBetween);
dayjs.extend(timezone);
dayjs.extend(utc);

export const UNIT_TESTING_APP = CreateApplication({
  configuration: {
    TARGET_FILE: {
      description: "Define a file to write types to. Autodetect = default behavior",
      type: "string",
    },
  },
  libraries: [LIB_HASS, LIB_SYNAPSE, LIB_AUTOMATION],
  name: "unit_testing",
  services: {
    events: MiscEvents,
    safety: Safety,
    scheduled: ScheduledActions,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    unit_testing: typeof UNIT_TESTING_APP;
  }
}
