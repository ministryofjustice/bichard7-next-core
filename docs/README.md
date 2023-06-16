# Architecture

Structure:

`adrs` -> A place to put Architecture Decision Records
`docs` -> A place to put information about the project

## Generating the documentation

* `npm run structurizr-site-generatr-build` => will build a microsite, for hosting on GitHub pages for example.
* `npm run structurizr-site-generatr-serve` => will serve a local webserver whilst developing the microsite
* `npm run structurizr-lite` => will serve a local webserver that's like: [HMPPS Architecture](https://structurizr.com/share/56937)

## [Structurizr DSL](https://github.com/structurizr/dsl)

We are using [Structurizr DSL](https://github.com/structurizr/dsl) as it's easy, in our opinion, to work and reason
with.

### Structurizr Lite

If you turn off Automatic layout and manually arrange systems you need to remove the `docs/architecture/workspace.json`
in the `.gitignore` if you want to persist the layout.
