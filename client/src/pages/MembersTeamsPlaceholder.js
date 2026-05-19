import React from "react";
import { useLocation } from "react-router-dom";
import { getMembersTeamsSectionMeta } from "./membersTeamsSections";

function MembersTeamsPlaceholder() {
    const { pathname } = useLocation();
    const meta = getMembersTeamsSectionMeta(pathname);

    if (!meta) {
        return (
            <div className="container-fluid py-4">
                <h1 className="h3 mb-2">Members &amp; Teams</h1>
                <p className="text-body-secondary mb-0">Choose a section from the navigation menu.</p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <h1 className="h3 mb-2">{meta.title}</h1>
            <p className="text-body-secondary mb-3">{meta.hint}</p>
            <div className="alert alert-secondary mb-0" role="status">
                This section is planned — the page shell and route are ready; full functionality will be added next.
            </div>
        </div>
    );
}

export default MembersTeamsPlaceholder;
