﻿import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class MemberProfileFieldDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
    let translation = "";
    if (definition) {
        const profileFieldDetails = JSON.parse(definition);
        translation = "Field with alias '" + profileFieldDetails.alias + "' ";
        switch (profileFieldDetails.match) {
            case "MatchesValue":
                translation += "matches value '" + profileFieldDetails.value + "'.";
                break;
            case "ContainsValue":
                translation += "contains value '" + profileFieldDetails.value + "'.";
                break;
            case "GreaterThanValue":
                translation += "is greater than value '" + profileFieldDetails.value + "'.";
                break;
            case "GreaterThanOrEqualToValue":
                translation += "is greater than or equal to value '" + profileFieldDetails.value + "'.";
                break;
            case "LessThanValue":
                translation += "is less than value '" + profileFieldDetails.value + "'.";
                break;
            case "LessThanOrEqualToValue":
                translation += "is less than or equal to value '" + profileFieldDetails.value + "'.";
                break;
        }
    }

    return translation;
  }

  destroy() {
  }
}