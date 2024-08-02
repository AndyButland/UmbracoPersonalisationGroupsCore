import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class NumberOfVisitsDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
		console.log(definition);
		let translation = "";
		return translation;
  }

  destroy() {
  }
}