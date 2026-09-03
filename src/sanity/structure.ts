import type { StructureResolver } from "sanity/structure";

/**
 * Desk structure. Pins the homepage singleton to a single editable doc and lists
 * the rest as normal collections. Keeps editors from creating five homepages.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .id("homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),
      S.listItem()
        .title("Transparency")
        .id("transparency")
        .child(S.document().schemaType("transparency").documentId("transparency")),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("story").title("Stories"),
      S.documentTypeListItem("campaign").title("Campaigns"),
      S.documentTypeListItem("projectUpdate").title("Project updates"),
      S.documentTypeListItem("article").title("Articles"),
      S.divider(),
      S.documentTypeListItem("donationTier").title("Donation tiers"),
      S.documentTypeListItem("impactStat").title("Impact statistics"),
      S.divider(),
      S.documentTypeListItem("teamMember").title("Team"),
      S.documentTypeListItem("transparencyReport").title("Transparency reports"),
      S.documentTypeListItem("partner").title("Partners"),
    ]);
