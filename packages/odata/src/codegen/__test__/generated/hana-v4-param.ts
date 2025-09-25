/*
* This code was GENERATED using the vite plugin odata-codegen.
* It contains TypeScript type definitions for OData services.
* Do not modify this file manually as it will be overwritten on the next build.
* For any changes, update the OData service definitions or plugin configuration.
*/

/* eslint-disable */
/* prettier-ignore */

import { OData, type TOdataDummyInterface, type TODataOptions } from "notsapodata"


export const hanaV4ParamName = "hanaV4Param";

// hanaV4Param/MyPartners
export const hanaV4ParamMyPartnersEntitySet = "MyPartners";
export const hanaV4ParamMyPartnersFields = [
  "YEAR"
] as const;
export const hanaV4ParamMyPartnersKeys = [
  "YEAR"
] as const;
export const hanaV4ParamMyPartnersMeasures = [] as const;
export type ThanaV4ParamMyPartnersFields = typeof hanaV4ParamMyPartnersFields[number];
export type ThanaV4ParamMyPartnersKeys = typeof hanaV4ParamMyPartnersKeys[number];
export type ThanaV4ParamMyPartnersMeasures = typeof hanaV4ParamMyPartnersMeasures[number];
export interface ThanaV4ParamType extends TOdataDummyInterface {
  entitySets: {
    MyPartners: {
      keys: ThanaV4ParamMyPartnersKeys;
      fields: ThanaV4ParamMyPartnersFields;
      measures: ThanaV4ParamMyPartnersMeasures;
    };
  };
  functions: {
  };
}

export class hanaV4Param extends OData<ThanaV4ParamType> {
  public static readonly serviceName = "hanaV4Param" as const;
  private static instance?: hanaV4Param;
  static entityAliases = {
    MyPartners: "MyPartners" as const
  };
  public static getInstance() {
    if (!hanaV4Param.instance) {
      hanaV4Param.instance = new hanaV4Param()
    }
    return hanaV4Param.instance
  }
  private constructor(opts?: TODataOptions) {
    super("hanaV4Param", {...opts, host: "http://localhost", path: "/odata/hana-v4-param"})
  }
}

