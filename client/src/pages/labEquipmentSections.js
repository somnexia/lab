/** Laboratory equipment — instruments and their lifecycle. */
export const LAB_EQUIPMENT_SECTIONS = {
    inventory: { title: "Equipment inventory", hint: "Register, search, and categorize lab instruments" },
    maintenance: { title: "Maintenance", hint: "Service schedules, work orders, and downtime" },
    calibration: { title: "Calibration", hint: "Certificates, due dates, and compliance records" },
    reservations: { title: "Reservations", hint: "Book shared instruments by time slot" },
    "usage-tracking": { title: "Usage tracking", hint: "Run logs, users, and utilization metrics" },
};

export function getLabEquipmentMeta(pathname) {
    const match = pathname.match(/^\/lab-equipment\/([^/]+)/);
    const key = match ? match[1] : null;
    return key ? LAB_EQUIPMENT_SECTIONS[key] : null;
}
