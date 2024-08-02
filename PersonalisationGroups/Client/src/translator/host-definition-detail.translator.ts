import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class HostDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
		console.log(definition);
		let translation = "";
		return translation;
  }

  destroy() {
  }
}