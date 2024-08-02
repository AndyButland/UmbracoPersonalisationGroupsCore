import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class CookieDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
		console.log(definition);
		let translation = "";
		return translation;
  }

  destroy() {
  }
}