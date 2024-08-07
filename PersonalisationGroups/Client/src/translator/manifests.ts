import type { ManifestPersonalisationGroupDefinitionDetailTranslator } from "./translator.interface.js";
import {
  AuthenticationStatusDefinitionDetailTranslator,
  ContinentDefinitionDetailTranslator,
  CookieDefinitionDetailTranslator,
  CountryDefinitionDetailTranslator,
  DayOfWeekDefinitionDetailTranslator,
  HostDefinitionDetailTranslator,
  MemberGroupDefinitionDetailTranslator,
  MemberProfileFieldDefinitionDetailTranslator,
  MemberTypeDefinitionDetailTranslator,
  MonthOfYearDefinitionDetailTranslator,
  NumberOfVisitsDefinitionDetailTranslator,
  PagesViewedDefinitionDetailTranslator,
  QueryStringDefinitionDetailTranslator,
  ReferralDefinitionDetailTranslator,
  RegionDefinitionDetailTranslator,
  SessionDefinitionDetailTranslator,
  TimeOfDayDefinitionDetailTranslator,
} from "./index.js";

export const manifests: Array<ManifestPersonalisationGroupDefinitionDetailTranslator> = [
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.AuthenticationStatus",
    name: "Authentication Status Translator",
    criteriaAlias: "authenticationStatus",
    api: AuthenticationStatusDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.Continent",
    name: "Continent Translator",
    criteriaAlias: "continent",
    api: ContinentDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.Cookie",
    name: "Cookie Translator",
    criteriaAlias: "cookie",
    api: CookieDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.Country",
    name: "Country Translator",
    criteriaAlias: "country",
    api: CountryDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.DayOfWeek",
    name: "Day Of Week Translator",
    criteriaAlias: "dayOfWeek",
    api: DayOfWeekDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.Host",
    name: "Host Translator",
    criteriaAlias: "host",
    api: HostDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.MemberGroup",
    name: "Member Group Translator",
    criteriaAlias: "memberGroup",
    api: MemberGroupDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.MemberProfileField",
    name: "Member Profile Field Translator",
    criteriaAlias: "memberProfileField",
    api: MemberProfileFieldDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.MemberType",
    name: "Member Type Translator",
    criteriaAlias: "memberType",
    api: MemberTypeDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.MonthOfYear",
    name: "Month Of Year Translator",
    criteriaAlias: "monthOfYear",
    api: MonthOfYearDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.NumberOfVisits",
    name: "Number Of Visits Translator",
    criteriaAlias: "numberOfVisits",
    api: NumberOfVisitsDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.PagesViewed",
    name: "Pages Viewed Translator",
    criteriaAlias: "pagesViewed",
    api: PagesViewedDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.QueryString",
    name: "QueryString Translator",
    criteriaAlias: "querystring",
    api: QueryStringDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.Referral",
    name: "Referral Translator",
    criteriaAlias: "referral",
    api: ReferralDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.Region",
    name: "Region Translator",
    criteriaAlias: "region",
    api: RegionDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.Session",
    name: "Session Translator",
    criteriaAlias: "session",
    api: SessionDefinitionDetailTranslator,
  },
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.TimeOfDay",
    name: "Time Of Day Translator",
    criteriaAlias: "timeOfDay",
    api: TimeOfDayDefinitionDetailTranslator,
  },
];
