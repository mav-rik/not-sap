<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap/main/docs/notsap.png" alt="Not SAP" width="180" />
</p>

# notsap

`notsap` is a TypeScript-first toolchain for building SAP Fiori-ready experiences without the weight of SAPUI5. It pairs a modern OData client with a Vue 3 UI kit so teams can ship fast, maintainable enterprise apps that still deploy to launchpad or run standalone.

**[Demo Application →](https://github.com/mav-rik/not-sap-demo)**

## Why We Built This

- Traditional SAPUI5 stacks impose heavy runtimes, sluggish boot times, and visual rigidity that slow product delivery.
- Lack of pervasive type safety makes large apps fragile and raises the cost of change.
- We want developer experience on par with modern web tooling while staying compatible with SAP backends and launchpad distribution.

## What’s Inside

- `notsapodata` — type-safe OData v2/v4 client, metadata utilities, and a Vite plugin that generates strongly typed service models. See [packages/odata/README.md](./packages/odata/README.md).

<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap/main/docs/odata-query.gif" alt="Not SAP"/>
</p>


- `notsapui` — Vue 3 smart components powered by generated metadata, including smart tables, record dialogs, and F4 helpers. See [packages/ui/README.md](./packages/ui/README.md).


<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap/main/docs/notsapui-table.webp" alt="Not SAP"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap-demo/main/docs/table-record.gif" alt="Not SAP"/>
</p>


- Shared development patterns: provide/inject context layers, metadata refinement, batch-friendly data access, and optional Excel export.

## Quick Start

1. Install dependencies: `pnpm install notsapui notsapodata`.
2. Configure `odataCodegenPlugin` in your app’s `vite.config.ts` to generate `.odata.types.ts` (examples in [packages/odata/README.md](./packages/odata/README.md#vite-plugin-setup-for-type-generation)).
3. Wrap your Vue app with `<NotSapApp>` and `<ODataEntitySet>` from `notsapui`, then consume smart components such as `<SmartTable>`.
4. Refine metadata and compose filters with helpers from `notsapodata` and `notsapui/utils` to deliver tailored UX.

## Learn More

- Deep dive into the OData tooling: [packages/odata/README.md](./packages/odata/README.md)
- Component architecture and examples: [packages/ui/README.md](./packages/ui/README.md)
- Additional guides and patterns live inside each package README.
- Demo application: [not-sap-demo](https://github.com/mav-rik/not-sap-demo)

Contributions and feedback are welcome—let's make SAP development feel modern again.
