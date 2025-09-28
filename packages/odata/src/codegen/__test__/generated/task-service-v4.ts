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
 * Model: taskServiceV4
 */
export const taskServiceV4Consts = {
  "TaskService": {
    "Task": {
      fields: ["Id", "Title", "Status", "Owner"] as const,
      keys: ["Id"] as const,
      measures: [] as const,
    },
  },
};

/**
 * Types for Keys and Fields
 * 
 * Model: taskServiceV4
 */
export interface TTaskServiceV4 {
  "TaskService": {
    "Task": {
      fields: (typeof taskServiceV4Consts)["TaskService"]["Task"]["fields"][number];
      keys: (typeof taskServiceV4Consts)["TaskService"]["Task"]["keys"][number];
      measures: (typeof taskServiceV4Consts)["TaskService"]["Task"]["measures"][number];
    };
  };
}

/**
 * Main OData Interface
 * 
 * Model: taskServiceV4
 */
export interface TTaskServiceV4OData extends TOdataDummyInterface {
  entitySets: {
    'Tasks': "TaskService.Task";
  };
  entityTypes: {
    'TaskService.Task': {
      keys: TTaskServiceV4["TaskService"]["Task"]["keys"];
      fields: TTaskServiceV4["TaskService"]["Task"]["fields"];
      measures: TTaskServiceV4["TaskService"]["Task"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        Id: string;
        Title?: string;
        Status?: string;
        Owner?: string;
      };
      actions: "ReassignTask";
      functions: never;
    };
  };
  complexTypes: {};
  enumTypes: {};
  functions: {};
  actions: {
    'CompleteTask': {
      params: {
        TaskId: string;
        Comment: string;
        Rating: number;
      };
      returnType: TTaskServiceV4OData['entityTypes']['TaskService.Task']['record'];
    };
    'ReassignTask': {
      params: {
        NewOwner: string;
      };
      returnType: TTaskServiceV4OData['entityTypes']['TaskService.Task']['record'];
    };
  };
}

/**
 * oData class
 * 
 * Model: TaskServiceV4
 * 
 * @example
 * const model = TaskServiceV4.getInstance()
 */
export class TaskServiceV4 extends OData<TTaskServiceV4OData> {
  public static readonly serviceName = "taskServiceV4" as const;
  private static instance?: TaskServiceV4;
  public static getInstance() {
    if (!TaskServiceV4.instance) {
      TaskServiceV4.instance = new TaskServiceV4()
    }
    return TaskServiceV4.instance
  }
  public static async entitySet<T extends keyof TTaskServiceV4OData['entitySets']>(name: T) {
    const instance = TaskServiceV4.getInstance()
    return instance.entitySet<T>(name)
  }
  private constructor(opts?: TODataOptions) {
    super("taskServiceV4", {...opts, path: "/odata/path/task-service-v4"})
  }
}

