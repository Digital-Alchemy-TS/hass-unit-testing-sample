import { TServiceParams } from "@digital-alchemy/core";

export function Safety({ hass, automation }: TServiceParams) {
  const location = hass.entity.byId("sensor.location");

  hass.entity.byId("binary_sensor.smoke_detector").onUpdate(async new_state => {
    // limit to while at home
    if (new_state.state === "off" || location.state !== "home") {
      return;
    }
    // check to see if it's between 5AM & 8PM
    // outside that window, things should be
    const [NOW, PM8, AM5] = automation.utils.shortTime(["NOW", "PM8", "AM5"]);
    if (NOW.isBetween(AM5, PM8)) {
      return;
    }
    await wakeUpSeriously();
  });

  async function wakeUpSeriously() {
    await hass.call.scene.turn_on({ entity_id: ["scene.bedroom_high"] });
    // ... whatever actions are needed for alerting to fire in the house
  }
}
