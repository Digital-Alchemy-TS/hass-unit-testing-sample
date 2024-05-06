import { CronExpression, TServiceParams } from "@digital-alchemy/core";

export function ScheduledActions({ hass, scheduler }: TServiceParams) {
  scheduler.cron({
    async exec() {
      await hass.call.switch.turn_on({
        entity_id: "switch.porch_light",
      });
    },
    schedule: CronExpression.EVERY_DAY_AT_8PM,
  });

  scheduler.cron({
    async exec() {
      await hass.call.switch.turn_off({
        entity_id: "switch.porch_light",
      });
    },
    schedule: CronExpression.EVERY_DAY_AT_5PM,
  });
}
