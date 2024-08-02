import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class AuthenticationStatusDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
		console.log(definition);
		let translation = "";
		return translation;
  }

  destroy() {
  }
}