import type { ManifestPersonalisationGroupDefinitionDetailTranslator } from "./translator.interface.js";
import {
  DayOfWeekDefinitionDetailTranslator,
} from "./index.js";

export const manifests: Array<ManifestPersonalisationGroupDefinitionDetailTranslator> = [
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.DayOfWeek",
    name: "Day Of Week Translator",
    criteriaAlias: "dayOfWeek",
    api: DayOfWeekDefinitionDetailTranslator,
  }
];
