import { snippetFor, type Check } from "./types";
import { isValidRole, VALID_ARIA_ROLES } from "../aria-roles";
import type { HTMLElement } from "node-html-parser";

export const ariaRoleCheck: Check = {
  id: "aria-roles",
  name: "ARIA role validity",
  wcagCriterion: "4.1.2 Name, Role, Value",
  severity: "serious",
  run(doc, html) {
    const invalid: HTMLElement[] = [];
    for (const el of doc.querySelectorAll("[role]")) {
      const role = el.getAttribute("role");
      if (!role) continue;
      if (!isValidRole(role)) invalid.push(el);
    }
    return {
      status: invalid.length === 0 ? "pass" : "warning",
      summary:
        invalid.length === 0
          ? `All role values map to a valid WAI-ARIA role (${VALID_ARIA_ROLES.size} known).`
          : `${invalid.length} element${invalid.length === 1 ? "" : "s"} use an unknown role value.`,
      count: invalid.length,
      violations: invalid.slice(0, 5).map((el) => snippetFor(el, html)),
    };
  },
};
