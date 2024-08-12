import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import type { ManifestElementAndApi, ApiLoaderProperty } from "@umbraco-cms/backoffice/extension-api";

export interface PersonalisationGroupDefinitionDetailTranslatorApi extends UmbApi {
    translate(definition: string) : string;
}

export interface ManifestPersonalisationGroupDefinitionDetailTranslator extends ManifestElementAndApi {
    type: "PersonalisationGroupDetailDefinitionTranslator";
    criteriaAlias: string;
    api: ApiLoaderProperty<PersonalisationGroupDefinitionDetailTranslatorApi>;
  }