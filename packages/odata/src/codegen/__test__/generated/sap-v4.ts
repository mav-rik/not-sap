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
 * Model: sapV4
 */
export const sapV4Consts = {
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
 * Model: sapV4
 */
export interface TSapV4 {
  "com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001": {
    "line_itemsType": {
      fields: (typeof sapV4Consts)["com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001"]["line_itemsType"]["fields"][number];
      keys: (typeof sapV4Consts)["com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001"]["line_itemsType"]["keys"][number];
      measures: (typeof sapV4Consts)["com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001"]["line_itemsType"]["measures"][number];
    };
  };
}

/**
 * Main OData Interface
 * 
 * Model: sapV4
 */
export interface TSapV4OData extends TOdataDummyInterface {
  entitySets: {
    'line_items': "com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001.line_itemsType";
  };
  entityTypes: {
    'com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001.line_itemsType': {
      keys: TSapV4["com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001"]["line_itemsType"]["keys"];
      fields: TSapV4["com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001"]["line_itemsType"]["fields"];
      measures: TSapV4["com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001"]["line_itemsType"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        DocumentNo: string;
        ItemNo: string;
        SubItemNo: string;
        Partner: string;
        HotelGroupingKey: string;
        ClearingStatus: string;
        DocCurrency: string;
        DocAmount: number;
        LocalCurrency: string;
        LocalAmount: number;
        Currency: string;
        Amount: number;
        HotelId: string;
        bukrs: string;
        HotelName: string;
        InvoiceNo: string;
        ClearingDoc: string;
        Ty: string;
        DocDate?: string;
        PaymentMethod: string;
        PaymentMethodDesc: string;
        ConAccount: string;
        NetPayDueDate?: string;
        ClearingDate?: string;
        LegalId: string;
        PbbProduct: string;
        country: string;
        DunningBlockReason: string;
        DunningBlockReasonDescription: string;
        PaymentBlockReason: string;
        PaymentBlockReasonDescription: string;
        ExtranetHotelStatus: string;
        FirstControllerid: string;
        region: string;
        clusterid: string;
        DocumentTypeDesc: string;
        ItemText: string;
        Text: string;
        PostingDate?: string;
        paymentlot: string;
        CollectionStep: string;
        BillableItemText: string;
      };
    };
  };
  complexTypes: {};
  enumTypes: {};
  functions: {};
  actions: {};
}

/**
 * oData class
 * 
 * Model: SapV4
 * 
 * @example
 * const model = SapV4.getInstance()
 */
export class SapV4 extends OData<TSapV4OData> {
  public static readonly serviceName = "sapV4" as const;
  private static instance?: SapV4;
  public static getInstance() {
    if (!SapV4.instance) {
      SapV4.instance = new SapV4()
    }
    return SapV4.instance
  }
  public static async entitySet<T extends keyof TSapV4OData['entitySets']>(name: T) {
    const instance = SapV4.getInstance()
    return instance.entitySet<T>(name)
  }
  private constructor(opts?: TODataOptions) {
    super("sapV4", {...opts, path: "/odata/path/sap-v4"})
  }
}

