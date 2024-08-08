import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class RegionDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
  translate(definition: string) {

    var translation = "";
    if (definition) {
          var selectedRegionDetails = JSON.parse(definition);
          if (selectedRegionDetails.match === "CouldNotBeLocated") {
            translation = "Visitor cannot be located";
        } else {
            translation = "Visitor is ";
            switch (selectedRegionDetails.match) {
            case "IsLocatedIn":
              translation += "located";
              break;
            case "IsNotLocatedIn":
              translation += "not located";
              break;
            }

            translation += " in: ";

            for (let i = 0; i < selectedRegionDetails.names.length; i++) {
                if (i > 0 && i === selectedRegionDetails.names.length - 1) {
                    translation += " or ";
                } else if (i > 0) {
                    translation += ", ";
                }

                translation += selectedRegionDetails.names[i];
            }

            translation += ", " + selectedRegionDetails.countryName;
        }
    }

    return translation;
  }

  destroy() {
  }
}