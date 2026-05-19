/** Materials inventory — what is stored (reagents, samples, supplies). */
export const INVENTORY_MATERIALS_SECTIONS = {
    overview: { title: "Overview", hint: "Stock levels, alerts, and recent material movements" },
    chemicals: { title: "Chemicals & reagents", hint: "Catalog, SDS links, and reagent lots" },
    samples: { title: "Samples & specimens", hint: "Chain of custody and specimen metadata" },
    consumables: { title: "Consumables", hint: "Disposable lab supplies and stock counts" },
    labware: { title: "Labware & glassware", hint: "Reusable vessels, tools, and breakage tracking" },
    lots: { title: "Lots & batches", hint: "Cross-material traceability and expiry" },
};

export function getInventoryMaterialsMeta(pathname) {
    const match = pathname.match(/^\/inventory\/([^/]+)/);
    const key = match ? match[1] : null;
    if (!key || key === "list") return null;
    return INVENTORY_MATERIALS_SECTIONS[key] || null;
}
