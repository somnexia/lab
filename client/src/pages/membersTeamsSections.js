/** Metadata for Members & Teams routes (placeholder pages until full implementation). */
export const MEMBERS_TEAMS_NAV_ITEMS = [
    { slug: "members", title: "Members", hint: "User directory, status, roles, and team membership" },
    { slug: "research-teams", title: "Research Teams", hint: "Teams, leads, members, and linked studies" },
    { slug: "assignments", title: "Assignments", hint: "Task and research ownership, workload balance" },
    { slug: "roles", title: "Roles & Permissions", hint: "Custom roles and access to modules and actions" },
    { slug: "activity-log", title: "Activity Log", hint: "Who changed what — filterable audit trail" },
    { slug: "invitations", title: "Invitations", hint: "Email invites, role, team, and invite status" },
];

export const MEMBERS_TEAMS_SECTIONS = {
    members: { title: "Members", hint: "User directory, status, roles, and team membership" },
    "research-teams": { title: "Research Teams", hint: "Teams, leads, members, and linked studies" },
    assignments: { title: "Assignments", hint: "Task and research ownership, workload balance" },
    roles: { title: "Roles & Permissions", hint: "Custom roles and access to modules and actions" },
    "activity-log": { title: "Activity Log", hint: "Who changed what — filterable audit trail" },
    invitations: { title: "Invitations", hint: "Email invites, role, team, and invite status" },
};

export function getMembersTeamsSectionKey(pathname) {
    const match = pathname.match(/^\/members-teams\/([^/]+)/);
    return match ? match[1] : null;
}

export function getMembersTeamsSectionMeta(pathname) {
    const key = getMembersTeamsSectionKey(pathname);
    return key ? MEMBERS_TEAMS_SECTIONS[key] : null;
}
