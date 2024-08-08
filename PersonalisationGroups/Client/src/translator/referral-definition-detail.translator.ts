import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class ReferralDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
		console.log(definition);
    let translation = "";
    if (definition) {
        const selectedReferrerDetails = JSON.parse(definition);
        translation = "Referrer value ";
        switch (selectedReferrerDetails.match) {
            case "MatchesValue":
                translation += "matches '" + selectedReferrerDetails.value + "'.";
                break;
            case "DoesNotMatchValue":
                translation += "does not match '" + selectedReferrerDetails.value + "'.";
                break;
            case "ContainsValue":
                translation += "contains '" + selectedReferrerDetails.value + "'.";
                break;
            case "DoesNotContainValue":
                translation += "does not contain '" + selectedReferrerDetails.value + "'.";
                break;
        }
    }

    return translation;
  }

  destroy() {
  }
}