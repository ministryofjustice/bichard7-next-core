document.body.className +=
  " js-enabled" +
  ("noModule" in HTMLScriptElement.prototype
    ? " govuk-frontend-supported"
    : "");

import { initAll } from "./govuk/govuk-frontend.min.js";

initAll();
