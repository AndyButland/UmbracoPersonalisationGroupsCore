import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class MemberGroupDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
    let translation = "";
    if (definition) {
        const memberTypeDetails = JSON.parse(definition);
        translation = (memberTypeDetails.match === "IsInGroup" ? "Is in group " : "Is not in group ") +
            "'" + memberTypeDetails.groupName + "'.";

    }

    return translation;
  }

  destroy() {
  }
}