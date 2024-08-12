import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class TimeOfDayDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
  translate(definition: string) {
    let translation = "";

    function formatTime(time: number) {
      const timeAsString = time.toString().padStart(4, "0");
      return timeAsString.substring(0, timeAsString.length - 2) + ":" + timeAsString.substring(timeAsString.length - 2);
    }

    if (definition) {
        var selectedTimes = JSON.parse(definition);

        for (var i = 0; i < selectedTimes.length; i++) {
            if (translation.length > 0) {
                translation += ", ";
            }

            translation += formatTime(selectedTimes[i].from) + " - " + formatTime(selectedTimes[i].to);
        }
    }

 		return translation;
  }

  destroy() {
  }
}