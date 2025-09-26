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
 * Model: sapService
 */
export const sapServiceConsts = {
  "com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001": {
    "line_itemsType": {
      fields: ["DocumentNo", "ItemNo", "SubItemNo", "Partner", "HotelGroupingKey", "ClearingStatus", "DocCurrency", "DocAmount", "LocalCurrency", "LocalAmount", "Currency", "Amount", "HotelId", "bukrs", "HotelName", "InvoiceNo", "ClearingDoc", "Ty", "DocDate", "PaymentMethod", "PaymentMethodDesc", "ConAccount", "NetPayDueDate", "ClearingDate", "LegalId", "PbbProduct", "country", "DunningBlockReason", "DunningBlockReasonDescription", "PaymentBlockReason", "PaymentBlockReasonDescription", "ExtranetHotelStatus", "FirstControllerid", "region", "clusterid", "DocumentTypeDesc", "ItemText", "Text", "PostingDate", "paymentlot", "CollectionStep", "BillableItemText"] as const,
      keys: ["DocumentNo", "ItemNo", "SubItemNo"] as const,
      measures: ["LocalAmount"] as const,
    },
  },
};

/**
 * Types for Keys and Fields
 * 
 * Model: sapService
 */
export interface TSapService {
  "com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001": {
    "line_itemsType": {
      fields: (typeof sapServiceConsts)["com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001"]["line_itemsType"]["fields"][number];
      keys: (typeof sapServiceConsts)["com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001"]["line_itemsType"]["keys"][number];
      measures: (typeof sapServiceConsts)["com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001"]["line_itemsType"]["measures"][number];
    };
  };
}

/**
 * Main OData Interface
 * 
 * Model: sapService
 */
export interface TSapServiceOData extends TOdataDummyInterface {
  entitySets: {
    'com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001.line_items': "com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001.line_itemsType";
  };
  entityTypes: {
    'com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001.line_itemsType': {
      keys: TSapService["com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001"]["line_itemsType"]["keys"];
      fields: TSapService["com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001"]["line_itemsType"]["fields"];
      measures: TSapService["com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001"]["line_itemsType"]["measures"];
      navToMany: {};
      navToOne: {};
    };
  };
  functions: {};
}

/**
 * oData class
 * 
 * Model: SapService
 * 
 * @example
 * const model = SapService.getInstance()
 */
export class SapService extends OData<TSapServiceOData> {
  public static readonly serviceName = "sapService" as const;
  private static instance?: SapService;
  public static getInstance() {
    if (!SapService.instance) {
      SapService.instance = new SapService()
    }
    return SapService.instance
  }
  public static async entitySet<T extends keyof TSapServiceOData['entitySets']>(name: T) {
    const instance = SapService.getInstance()
    return instance.entitySet<T>(name)
  }
  private constructor(opts?: TODataOptions) {
    super("sapService", {...opts, host: "http://localhost", path: "/odata/sap-v4"})
  }
}


/**
 * Fields and Keys as Constants
 * 
 * Model: hanaService
 */
export const hanaServiceConsts = {
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
 * Model: hanaService
 */
export interface THanaService {
  "UKDataService": {
    "MyPartnersParameters": {
      fields: (typeof hanaServiceConsts)["UKDataService"]["MyPartnersParameters"]["fields"][number];
      keys: (typeof hanaServiceConsts)["UKDataService"]["MyPartnersParameters"]["keys"][number];
      measures: (typeof hanaServiceConsts)["UKDataService"]["MyPartnersParameters"]["measures"][number];
    };
    "MyPartnersType": {
      fields: (typeof hanaServiceConsts)["UKDataService"]["MyPartnersType"]["fields"][number];
      keys: (typeof hanaServiceConsts)["UKDataService"]["MyPartnersType"]["keys"][number];
      measures: (typeof hanaServiceConsts)["UKDataService"]["MyPartnersType"]["measures"][number];
    };
  };
}

/**
 * Main OData Interface
 * 
 * Model: hanaService
 */
export interface THanaServiceOData extends TOdataDummyInterface {
  entitySets: {
    'UKDataService.MyPartners': "UKDataService.MyPartnersParameters";
  };
  entityTypes: {
    'UKDataService.MyPartnersParameters': {
      keys: THanaService["UKDataService"]["MyPartnersParameters"]["keys"];
      fields: THanaService["UKDataService"]["MyPartnersParameters"]["fields"];
      measures: THanaService["UKDataService"]["MyPartnersParameters"]["measures"];
      navToMany: {
        Set: "UKDataService.MyPartnersType";
      };
      navToOne: {};
    };
    'UKDataService.MyPartnersType': {
      keys: THanaService["UKDataService"]["MyPartnersType"]["keys"];
      fields: THanaService["UKDataService"]["MyPartnersType"]["fields"];
      measures: THanaService["UKDataService"]["MyPartnersType"]["measures"];
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
 * Model: HanaService
 * 
 * @example
 * const model = HanaService.getInstance()
 */
export class HanaService extends OData<THanaServiceOData> {
  public static readonly serviceName = "hanaService" as const;
  private static instance?: HanaService;
  public static getInstance() {
    if (!HanaService.instance) {
      HanaService.instance = new HanaService()
    }
    return HanaService.instance
  }
  public static async entitySet<T extends keyof THanaServiceOData['entitySets']>(name: T) {
    const instance = HanaService.getInstance()
    return instance.entitySet<T>(name)
  }
  private constructor(opts?: TODataOptions) {
    super("hanaService", {...opts, host: "http://localhost", path: "/odata/hana-v4-param"})
  }
}

