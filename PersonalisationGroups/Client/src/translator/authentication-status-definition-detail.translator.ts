import { PersonalisationGroupDefinitionDetailTranslatorApi } from "./translator.interface.js";

export class AuthenticationStatusDefinitionDetailTranslator implements PersonalisationGroupDefinitionDetailTranslatorApi  {
   translate(definition: string) {
		let translation = "";
    if (definition) {
      const authenticationStatusDetails = JSON.parse(definition);
      translation = authenticationStatusDetails.isAuthenticated ? "Is logged in." : "Is not logged in.";
    }

		return translation;
  }

  destroy() {
  }
}