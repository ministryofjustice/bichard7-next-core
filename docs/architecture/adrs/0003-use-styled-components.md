# 1. Use Styled Components

Date: 2024-04-12

## Status

Accepted

## Context

We are currently using two different styling libraries (3 if you include `scss` files). We want to reduce the need to
know how to use the libraries and simplify the code base.

We have opted to choose [Styled Components](https://styled-components.com/) over
[React-JSS](https://cssinjs.org/react-jss/?v=v10.10.0)

The negatives for `react-jss` are it is less flexible with `React`. E.g. you can pass `props` to `styled-components`
for separate themes. It can also pollute other `components` as it based on class names rather than `components`.

### File structure

We have opted to take the following approach to structuring the files:

- `src/components/Action.styles.tsx`
- `src/components/Action.tsx`

That allows to separate the styles from the `component` and keep close by. We can import other JS/TS files if needed,
e.g. colours.

We should also export all the Styled Components at bottom of the file, e.g.

```TypeScript
export { ActionLink, ActionButton }
```

## Consequences

- More files
- Need to know plain CSS
- Need to learn how this library works
