import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class DayOfWeekDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
		let translation = "";
		if (definition) {
				var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				var selectedDays = JSON.parse(definition);

				for (var i = 0; i < selectedDays.length; i++) {
						if (translation.length > 0) {
								translation += ", ";
						}

						translation += days[selectedDays[i] - 1];
				}
		}

		return translation;
  }

  destroy() {
  }
}