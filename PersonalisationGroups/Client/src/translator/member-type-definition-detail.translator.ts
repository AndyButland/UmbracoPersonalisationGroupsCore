import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class MemberTypeDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
		console.log(definition);
		let translation = "";
		return translation;
  }

  destroy() {
  }
}