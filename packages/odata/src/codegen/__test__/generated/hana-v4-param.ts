/*
* This code was GENERATED using the vite plugin odata-codegen.
* It contains TypeScript type definitions for OData services.
* Do not modify this file manually as it will be overwritten on the next build.
* For any changes, update the OData service definitions or plugin configuration.
*/

/* eslint-disable */
/* prettier-ignore */

import { OData, type TOdataDummyInterface, type TODataOptions } from "notsapodata"


/**
 * Fields and Keys as Constants
 * 
 * Model: hanaV4Param
 */
export const hanaV4ParamConsts = {
  "UKDataService": {
    "MyPartnersParameters": {
      fields: ["YEAR"] as const,
      keys: ["YEAR"] as const,
      measures: [] as const,
    },
    "MyPartnersType": {
      fields: ["Entity_IN", "Entity_IN_issuedBy", "Entity_IN_INType", "Entity_TIN", "Entity_VAT", "Entity_Name", "Entity_Address_CountryCode", "Entity_Address_Free", "Entity_Address_Street", "Entity_Address_BuildingIdentifier", "Entity_Address_SuiteIdentifier", "Entity_Address_FloorIdentifier", "Entity_Address_DistrictName", "Entity_Address_POB", "Entity_Address_PostCode", "Entity_Address_City", "Entity_Address_CountrySubentity", "Entity_FinancialIdentifier", "Entity_AccountNumberType", "Entity_AccountHolderName", "Entity_FinancialIdentifierOtherInfo", "Entity_PermanentEstablishment", "TransportationRental_ConsQ1_currCode", "TransportationRental_ConsQ2_currCode", "TransportationRental_ConsQ3_currCode", "TransportationRental_ConsQ4_currCode", "TransportationRental_FeesQ1_currCode", "TransportationRental_FeesQ2_currCode", "TransportationRental_FeesQ3_currCode", "TransportationRental_FeesQ4_currCode", "BTL_SOURCE", "TransportationRental_TaxQ1_currCode", "TransportationRental_TaxQ2_currCode", "TransportationRental_TaxQ3_currCode", "TransportationRental_TaxQ4_currCode", "PersonalService_ConsQ1_currCode", "PersonalService_ConsQ2_currCode", "PersonalService_ConsQ3_currCode", "PersonalService_ConsQ4_currCode", "PersonalService_FeesQ1_currCode", "PersonalService_FeesQ2_currCode", "PersonalService_FeesQ3_currCode", "PersonalService_FeesQ4_currCode", "PersonalService_TaxQ1_currCode", "PersonalService_TaxQ2_currCode", "PersonalService_TaxQ3_currCode", "PersonalService_TaxQ4_currCode", "Entity_Address_legalAddressType", "Entity_TIN_issuedBy", "Entity_ResCountryCode", "TransportationRental_ConsQ1", "TransportationRental_ConsQ2", "TransportationRental_ConsQ3", "TransportationRental_ConsQ4", "TransportationRental_NumbQ1", "TransportationRental_NumbQ2", "TransportationRental_NumbQ3", "TransportationRental_NumbQ4", "TransportationRental_FeesQ1", "TransportationRental_FeesQ2", "TransportationRental_FeesQ3", "TransportationRental_FeesQ4", "TransportationRental_TaxQ1", "TransportationRental_TaxQ2", "TransportationRental_TaxQ3", "TransportationRental_TaxQ4", "PersonalService_ConsQ1", "PersonalService_ConsQ2", "PersonalService_ConsQ3", "PersonalService_ConsQ4", "PersonalService_NumbQ1", "PersonalService_NumbQ2", "PersonalService_NumbQ3", "PersonalService_NumbQ4", "PersonalService_FeesQ1", "PersonalService_FeesQ2", "PersonalService_FeesQ3", "PersonalService_FeesQ4", "PersonalService_TaxQ1", "PersonalService_TaxQ2", "PersonalService_TaxQ3", "PersonalService_TaxQ4"] as const,
      keys: ["Entity_IN", "Entity_IN_issuedBy", "Entity_IN_INType", "Entity_TIN", "Entity_VAT", "Entity_Name", "Entity_Address_CountryCode", "Entity_Address_Free", "Entity_Address_Street", "Entity_Address_BuildingIdentifier", "Entity_Address_SuiteIdentifier", "Entity_Address_FloorIdentifier", "Entity_Address_DistrictName", "Entity_Address_POB", "Entity_Address_PostCode", "Entity_Address_City", "Entity_Address_CountrySubentity", "Entity_FinancialIdentifier", "Entity_AccountNumberType", "Entity_AccountHolderName", "Entity_FinancialIdentifierOtherInfo", "Entity_PermanentEstablishment", "TransportationRental_ConsQ1_currCode", "TransportationRental_ConsQ2_currCode", "TransportationRental_ConsQ3_currCode", "TransportationRental_ConsQ4_currCode", "TransportationRental_FeesQ1_currCode", "TransportationRental_FeesQ2_currCode", "TransportationRental_FeesQ3_currCode", "TransportationRental_FeesQ4_currCode", "BTL_SOURCE", "TransportationRental_TaxQ1_currCode", "TransportationRental_TaxQ2_currCode", "TransportationRental_TaxQ3_currCode", "TransportationRental_TaxQ4_currCode", "PersonalService_ConsQ1_currCode", "PersonalService_ConsQ2_currCode", "PersonalService_ConsQ3_currCode", "PersonalService_ConsQ4_currCode", "PersonalService_FeesQ1_currCode", "PersonalService_FeesQ2_currCode", "PersonalService_FeesQ3_currCode", "PersonalService_FeesQ4_currCode", "PersonalService_TaxQ1_currCode", "PersonalService_TaxQ2_currCode", "PersonalService_TaxQ3_currCode", "PersonalService_TaxQ4_currCode", "Entity_Address_legalAddressType", "Entity_TIN_issuedBy", "Entity_ResCountryCode"] as const,
      measures: [] as const,
    },
  },
};

/**
 * Types for Keys and Fields
 * 
 * Model: hanaV4Param
 */
export interface THanaV4Param {
  "UKDataService": {
    "MyPartnersParameters": {
      fields: (typeof hanaV4ParamConsts)["UKDataService"]["MyPartnersParameters"]["fields"][number];
      keys: (typeof hanaV4ParamConsts)["UKDataService"]["MyPartnersParameters"]["keys"][number];
      measures: (typeof hanaV4ParamConsts)["UKDataService"]["MyPartnersParameters"]["measures"][number];
    };
    "MyPartnersType": {
      fields: (typeof hanaV4ParamConsts)["UKDataService"]["MyPartnersType"]["fields"][number];
      keys: (typeof hanaV4ParamConsts)["UKDataService"]["MyPartnersType"]["keys"][number];
      measures: (typeof hanaV4ParamConsts)["UKDataService"]["MyPartnersType"]["measures"][number];
    };
  };
}

/**
 * Main OData Interface
 * 
 * Model: hanaV4Param
 */
export interface THanaV4ParamOData extends TOdataDummyInterface {
  entitySets: {
    'UKDataService.MyPartners': "UKDataService.MyPartnersParameters";
  };
  entityTypes: {
    'UKDataService.MyPartnersParameters': {
      keys: THanaV4Param["UKDataService"]["MyPartnersParameters"]["keys"];
      fields: THanaV4Param["UKDataService"]["MyPartnersParameters"]["fields"];
      measures: THanaV4Param["UKDataService"]["MyPartnersParameters"]["measures"];
      navToMany: {
        Set: "UKDataService.MyPartnersType";
      };
      navToOne: {};
    };
    'UKDataService.MyPartnersType': {
      keys: THanaV4Param["UKDataService"]["MyPartnersType"]["keys"];
      fields: THanaV4Param["UKDataService"]["MyPartnersType"]["fields"];
      measures: THanaV4Param["UKDataService"]["MyPartnersType"]["measures"];
      navToMany: {};
      navToOne: {
        Parameters: "UKDataService.MyPartnersParameters";
      };
    };
  };
  functions: {};
}

/**
 * oData class
 * 
 * Model: HanaV4Param
 * 
 * @example
 * const model = HanaV4Param.getInstance()
 */
export class HanaV4Param extends OData<THanaV4ParamOData> {
  public static readonly serviceName = "hanaV4Param" as const;
  private static instance?: HanaV4Param;
  public static getInstance() {
    if (!HanaV4Param.instance) {
      HanaV4Param.instance = new HanaV4Param()
    }
    return HanaV4Param.instance
  }
  public static async entitySet<T extends keyof THanaV4ParamOData['entitySets']>(name: T) {
    const instance = HanaV4Param.getInstance()
    return instance.entitySet<T>(name)
  }
  private constructor(opts?: TODataOptions) {
    super("hanaV4Param", {...opts, path: "/odata/hana-v4-param"})
  }
}

