import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class HostDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
    let translation = "";
    if (definition) {
        var selectedHostDetails = JSON.parse(definition);
        translation = "Host value ";
        switch (selectedHostDetails.match) {
            case "MatchesValue":
                translation += "matches '" + selectedHostDetails.value + "'.";
                break;
            case "DoesNotMatchValue":
                translation += "does not match '" + selectedHostDetails.value + "'.";
                break;
            case "ContainsValue":
                translation += "contains '" + selectedHostDetails.value + "'.";
                break;
            case "DoesNotContainValue":
                translation += "does not contain '" + selectedHostDetails.value + "'.";
                break;
        }
    }

    return translation;
  }

  destroy() {
  }
}