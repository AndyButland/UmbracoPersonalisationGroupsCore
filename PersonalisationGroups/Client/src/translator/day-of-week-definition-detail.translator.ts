import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class DayOfWeekDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
		let translation = "";
		if (definition) {
			  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				const selectedDays = JSON.parse(definition);

				for (let i = 0; i < selectedDays.length; i++) {
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