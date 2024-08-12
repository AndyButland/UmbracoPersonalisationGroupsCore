import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class MemberTypeDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
    let translation = "";
    if (definition) {
        const memberTypeDetails = JSON.parse(definition);
        translation = (memberTypeDetails.match === "IsOfType" ? "Is of type " : "Is not of type ") +
            "'" + memberTypeDetails.typeName + "'.";

    }

    return translation;
  }

  destroy() {
  }
}