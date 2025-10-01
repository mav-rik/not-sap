<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap/main/docs/notsap.png" alt="Not SAP" width="180" />
</p>

# notsap

A TypeScript toolchain for building SAP Fiori apps with modern web development. Combines a type-safe OData client with Vue 3 components.

**[Demo Application →](https://github.com/mav-rik/not-sap-demo)**

## Motivation

SAP's Fiori concept, smart controls, and OData architecture are solid ideas. But customizing SAPUI5 apps often means reverse-engineering the framework to add simple features like a toolbar button or custom filter behavior. What should be straightforward becomes hours of debugging.

After 10+ years working with SAPUI5, I experimented with Vue in SAP environments. The difference was immediate — smoother UX, easier customization, and users who didn't want to go back. When they asked "Is this SAP?", the answer became: "No, it's not SAP."

That phrase — "not SAP" — became shorthand for better UX and DX. This project focuses on **developer experience first** — so developers can focus on **user experience** without fighting the framework.

## What's Inside

**`notsapodata`** — OData v2/v4 client with type generation from metadata. See [packages/odata/README.md](./packages/odata/README.md).

<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap/main/docs/odata-query.gif" alt="Not SAP"/>
</p>

**`notsapui`** — Vue 3 smart components including tables, dialogs, and filters. See [packages/ui/README.md](./packages/ui/README.md).

<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap/main/docs/notsapui-table.webp" alt="Not SAP"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap-demo/main/docs/table-record.gif" alt="Not SAP"/>
</p>

## Quick Start

1. Install: `pnpm install notsapui notsapodata`
2. Configure `notSapODataVitePlugin` in `vite.config.ts` to generate types from OData metadata
3. Use `<NotSapApp>` and `<ODataEntitySet>` wrappers with `<SmartTable>` and other components
4. Customize with metadata refinement and filter utilities

See package READMEs for detailed setup and examples. Demo: [not-sap-demo](https://github.com/mav-rik/not-sap-demo)
