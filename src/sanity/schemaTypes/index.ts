import type { SchemaTypeDefinition } from "sanity";

import { homepage } from "./homepage";
import { project } from "./project";
import { story } from "./story";
import { campaign } from "./campaign";
import { donationTier } from "./donationTier";
import { impactStat } from "./impactStat";
import { teamMember } from "./teamMember";
import { transparencyReport } from "./transparencyReport";
import { partner } from "./partner";
import { article } from "./article";
import { projectUpdate } from "./projectUpdate";
import { transparency } from "./transparency";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    homepage,
    project,
    story,
    campaign,
    donationTier,
    impactStat,
    teamMember,
    transparencyReport,
    partner,
    article,
    projectUpdate,
    transparency,
  ],
};

/** Types that must exist as exactly one document (edited, never created/deleted). */
export const singletonTypes = new Set<string>(["homepage", "transparency"]);
