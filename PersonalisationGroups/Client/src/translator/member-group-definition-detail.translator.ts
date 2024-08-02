import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class MemberGroupDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
		console.log(definition);
		let translation = "";
		return translation;
  }

  destroy() {
  }
}