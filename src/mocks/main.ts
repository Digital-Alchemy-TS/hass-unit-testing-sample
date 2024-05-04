import { CreateApplication } from "@digital-alchemy/core";
import { LIB_HASS } from "@digital-alchemy/hass";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isBetween from "dayjs/plugin/isBetween";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";

import { EntityGenerator } from "./generator";

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

export const ENTITY_GENERATOR = CreateApplication({
  configuration: {
    TARGET_FILE: {
      description: "Define a file to write types to. Autodetect = default behavior",
      type: "string",
    },
  },
  libraries: [LIB_HASS, LIB_SYNAPSE],
  name: "entity_generator",
  services: {
    generator: EntityGenerator,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    entity_generator: typeof ENTITY_GENERATOR;
  }
}

setImmediate(
  async () =>
    await ENTITY_GENERATOR.bootstrap({
      configuration: {
        synapse: { ANNOUNCE_AT_CONNECT: true },
      },
    }),
);
