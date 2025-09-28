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
 * Model: tripPinRESTierService
 */
export const tripPinRESTierServiceConsts = {
  "Trippin": {
    "Person": {
      fields: ["UserName", "FirstName", "LastName", "MiddleName", "Gender", "Age", "Emails", "AddressInfo", "HomeAddress", "FavoriteFeature", "Features"] as const,
      keys: ["UserName"] as const,
      measures: [] as const,
    },
    "Airline": {
      fields: ["AirlineCode", "Name"] as const,
      keys: ["AirlineCode"] as const,
      measures: [] as const,
    },
    "Airport": {
      fields: ["Name", "IcaoCode", "IataCode", "Location"] as const,
      keys: ["IcaoCode"] as const,
      measures: [] as const,
    },
    "Trip": {
      fields: ["TripId", "ShareId", "Name", "Budget", "Description", "Tags", "StartsAt", "EndsAt"] as const,
      keys: ["TripId"] as const,
      measures: [] as const,
    },
    "PlanItem": {
      fields: ["PlanItemId", "ConfirmationCode", "StartsAt", "EndsAt", "Duration"] as const,
      keys: ["PlanItemId"] as const,
      measures: [] as const,
    },
  },
};

/**
 * Types for Keys and Fields
 * 
 * Model: tripPinRESTierService
 */
export interface TTripPinRESTierService {
  "Trippin": {
    "Person": {
      fields: (typeof tripPinRESTierServiceConsts)["Trippin"]["Person"]["fields"][number];
      keys: (typeof tripPinRESTierServiceConsts)["Trippin"]["Person"]["keys"][number];
      measures: (typeof tripPinRESTierServiceConsts)["Trippin"]["Person"]["measures"][number];
    };
    "Airline": {
      fields: (typeof tripPinRESTierServiceConsts)["Trippin"]["Airline"]["fields"][number];
      keys: (typeof tripPinRESTierServiceConsts)["Trippin"]["Airline"]["keys"][number];
      measures: (typeof tripPinRESTierServiceConsts)["Trippin"]["Airline"]["measures"][number];
    };
    "Airport": {
      fields: (typeof tripPinRESTierServiceConsts)["Trippin"]["Airport"]["fields"][number];
      keys: (typeof tripPinRESTierServiceConsts)["Trippin"]["Airport"]["keys"][number];
      measures: (typeof tripPinRESTierServiceConsts)["Trippin"]["Airport"]["measures"][number];
    };
    "Trip": {
      fields: (typeof tripPinRESTierServiceConsts)["Trippin"]["Trip"]["fields"][number];
      keys: (typeof tripPinRESTierServiceConsts)["Trippin"]["Trip"]["keys"][number];
      measures: (typeof tripPinRESTierServiceConsts)["Trippin"]["Trip"]["measures"][number];
    };
    "PlanItem": {
      fields: (typeof tripPinRESTierServiceConsts)["Trippin"]["PlanItem"]["fields"][number];
      keys: (typeof tripPinRESTierServiceConsts)["Trippin"]["PlanItem"]["keys"][number];
      measures: (typeof tripPinRESTierServiceConsts)["Trippin"]["PlanItem"]["measures"][number];
    };
  };
}

/**
 * Main OData Interface
 * 
 * Model: tripPinRESTierService
 */
export interface TTripPinRESTierServiceOData extends TOdataDummyInterface {
  entitySets: {
    'People': "Trippin.Person";
    'Airlines': "Trippin.Airline";
    'Airports': "Trippin.Airport";
  };
  entityTypes: {
    'Trippin.Person': {
      keys: TTripPinRESTierService["Trippin"]["Person"]["keys"];
      fields: TTripPinRESTierService["Trippin"]["Person"]["fields"];
      measures: TTripPinRESTierService["Trippin"]["Person"]["measures"];
      navToMany: {
        Friends: "Trippin.Person";
        Trips: "Trippin.Trip";
      };
      navToOne: {
        BestFriend: "Trippin.Person";
      };
      record: {
        UserName: string;
        FirstName: string;
        LastName?: string;
        MiddleName?: string;
        Gender: TTripPinRESTierServiceOData['enumTypes']['Trippin.PersonGender'];
        Age?: number;
        Emails?: Array<string>;
        AddressInfo?: Array<TTripPinRESTierServiceOData['complexTypes']['Trippin.Location']>;
        HomeAddress?: TTripPinRESTierServiceOData['complexTypes']['Trippin.Location'];
        FavoriteFeature: TTripPinRESTierServiceOData['enumTypes']['Trippin.Feature'];
        Features: Array<TTripPinRESTierServiceOData['enumTypes']['Trippin.Feature']>;
        Friends?: Array<TTripPinRESTierServiceOData['entityTypes']['Trippin.Person']['record']>;
        BestFriend?: TTripPinRESTierServiceOData['entityTypes']['Trippin.Person']['record'] | null;
        Trips?: Array<TTripPinRESTierServiceOData['entityTypes']['Trippin.Trip']['record']>;
      };
      actions: never;
      functions: "GetPersonWithMostFriends";
    };
    'Trippin.Airline': {
      keys: TTripPinRESTierService["Trippin"]["Airline"]["keys"];
      fields: TTripPinRESTierService["Trippin"]["Airline"]["fields"];
      measures: TTripPinRESTierService["Trippin"]["Airline"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        AirlineCode: string;
        Name?: string;
      };
      actions: never;
      functions: never;
    };
    'Trippin.Airport': {
      keys: TTripPinRESTierService["Trippin"]["Airport"]["keys"];
      fields: TTripPinRESTierService["Trippin"]["Airport"]["fields"];
      measures: TTripPinRESTierService["Trippin"]["Airport"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        Name?: string;
        IcaoCode: string;
        IataCode?: string;
        Location?: TTripPinRESTierServiceOData['complexTypes']['Trippin.AirportLocation'];
      };
      actions: never;
      functions: "GetNearestAirport";
    };
    'Trippin.Trip': {
      keys: TTripPinRESTierService["Trippin"]["Trip"]["keys"];
      fields: TTripPinRESTierService["Trippin"]["Trip"]["fields"];
      measures: TTripPinRESTierService["Trippin"]["Trip"]["measures"];
      navToMany: {
        PlanItems: "Trippin.PlanItem";
      };
      navToOne: {};
      record: {
        TripId: number;
        ShareId: string;
        Name?: string;
        Budget: number;
        Description?: string;
        Tags?: Array<string>;
        StartsAt: string;
        EndsAt: string;
        PlanItems?: Array<TTripPinRESTierServiceOData['entityTypes']['Trippin.PlanItem']['record']>;
      };
      actions: never;
      functions: never;
    };
    'Trippin.PlanItem': {
      keys: TTripPinRESTierService["Trippin"]["PlanItem"]["keys"];
      fields: TTripPinRESTierService["Trippin"]["PlanItem"]["fields"];
      measures: TTripPinRESTierService["Trippin"]["PlanItem"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        PlanItemId: number;
        ConfirmationCode?: string;
        StartsAt: string;
        EndsAt: string;
        Duration: string;
      };
      actions: never;
      functions: never;
    };
  };
  complexTypes: {
    'Trippin.AirportLocation': {
      Loc?: any;
    };
    'Trippin.Location': {
      Address?: string;
      City?: TTripPinRESTierServiceOData['complexTypes']['Trippin.City'];
    };
    'Trippin.City': {
      Name?: string;
      CountryRegion?: string;
      Region?: string;
    };
  };
  enumTypes: {
    'Trippin.PersonGender': 'Male' | 'Female' | 'Unknown';
    'Trippin.Feature': 'Feature1' | 'Feature2' | 'Feature3' | 'Feature4';
  };
  functions: {
    'GetPersonWithMostFriends': {
      params: never;
      returnType: TTripPinRESTierServiceOData['entityTypes']['Trippin.Person']['record'];
    };
    'GetNearestAirport': {
      params: {
        lat: number;
        lon: number;
      };
      returnType: TTripPinRESTierServiceOData['entityTypes']['Trippin.Airport']['record'];
    };
  };
  actions: {
    'ResetDataSource': {
      params: never;
      returnType: void;
    };
  };
}

/**
 * oData class
 * 
 * Model: TripPinRESTierService
 * 
 * @example
 * const model = TripPinRESTierService.getInstance()
 */
export class TripPinRESTierService extends OData<TTripPinRESTierServiceOData> {
  public static readonly serviceName = "tripPinRESTierService" as const;
  private static instance?: TripPinRESTierService;
  public static getInstance() {
    if (!TripPinRESTierService.instance) {
      TripPinRESTierService.instance = new TripPinRESTierService()
    }
    return TripPinRESTierService.instance
  }
  public static async entitySet<T extends keyof TTripPinRESTierServiceOData['entitySets']>(name: T) {
    const instance = TripPinRESTierService.getInstance()
    return instance.entitySet<T>(name)
  }
  private constructor(opts?: TODataOptions) {
    super("tripPinRESTierService", {...opts, path: "/TripPinRESTierService"})
  }
}

