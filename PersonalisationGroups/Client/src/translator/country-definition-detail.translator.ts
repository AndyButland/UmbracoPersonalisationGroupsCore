import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class CountryDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
  translate(definition: string) {
    let translation = "";
    if (definition) {
      const selectedCountryDetails = JSON.parse(definition);
      if (selectedCountryDetails.match === "CouldNotBeLocated") {
        translation = "Visitor cannot be located";
      } else {
          translation = "Visitor is ";
          switch (selectedCountryDetails.match) {
          case "IsLocatedIn":
            translation += "located";
            break;
          case "IsNotLocatedIn":
            translation += "not located";
            break;
          }

          translation += " in: ";

          for (let i = 0; i < selectedCountryDetails.codes.length; i++) {
              if (i > 0 && i === selectedCountryDetails.codes.length - 1) {
                  translation += " or ";
              } else if (i > 0) {
                  translation += ", ";
              }

              // Versions 0.2.5 and later store the country name, before that we just had the code.
              // So display the name if we have it, otherwise just the code.
              translation += selectedCountryDetails.names
                  ? selectedCountryDetails.names[i]
                  : selectedCountryDetails.codes[i].toUpperCase();
          }
      }
    }

    return translation;
  }

  destroy() {
  }
}