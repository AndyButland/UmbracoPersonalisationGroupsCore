import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class PagesViewedDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
    let translation = "";
    if (definition) {
        const selectedPagesViewedDetails = JSON.parse(definition);
        translation = "Visitor has ";
        switch (selectedPagesViewedDetails.match) {
            case "ViewedAny":
                translation += "viewed any of";
                break;
            case "ViewedAll":
                translation += "viewed all";
                break;
            case "NotViewedAny":
                translation += "not viewed any of";
                break;
            case "NotViewedAll":
                translation += "not viewed all";
                break;
        }

        translation += " the " + selectedPagesViewedDetails.nodeKeys.length +
              " selected page" + (selectedPagesViewedDetails.nodeKeys.length === 1 ? "" : "s");
    }

    return translation;
  }

  destroy() {
  }
}