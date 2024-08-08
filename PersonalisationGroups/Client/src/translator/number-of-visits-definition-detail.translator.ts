import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class NumberOfVisitsDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
    let translation = "";
    if (definition) {
        const selectedNumberOfVisitsDetails = JSON.parse(definition);
        translation = "Visitor has visited the site ";
        switch (selectedNumberOfVisitsDetails.match) {
            case "MoreThan":
                translation += "more than";
                break;
            case "LessThan":
                translation += "less than";
                break;
            case "Exactly":
                translation += "exactly";
                break;
        }

        translation += " " + selectedNumberOfVisitsDetails.number +
              " time" + (selectedNumberOfVisitsDetails.number === 1 ? "" : "s");
    }

    return translation;
  }

  destroy() {
  }
}