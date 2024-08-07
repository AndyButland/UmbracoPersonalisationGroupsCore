import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class MonthOfYearDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
		let translation = "";
		if (definition) {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				const selectedMonths = JSON.parse(definition);

				for (let i = 0; i < selectedMonths.length; i++) {
						if (translation.length > 0) {
								translation += ", ";
						}

						translation += months[selectedMonths[i] - 1];
				}
		}

		return translation;
  }

  destroy() {
  }
}