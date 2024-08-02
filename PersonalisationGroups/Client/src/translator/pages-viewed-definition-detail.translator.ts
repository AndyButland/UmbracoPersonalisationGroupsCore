import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class PagesViewedDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
		console.log(definition);
		let translation = "";
		return translation;
  }

  destroy() {
  }
}