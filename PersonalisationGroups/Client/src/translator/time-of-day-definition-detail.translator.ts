import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class TimeOfDayDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
		console.log(definition);
		let translation = "";
		return translation;
  }

  destroy() {
  }
}