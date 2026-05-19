import React, { Component } from "react";

const NODE_W = 120;
const NODE_H = 44;
const PAD = 24;
const ROW_GAP = 80;

class ResearchTeamsMap extends Component {
    buildLayout(graph) {
        const nodes = graph?.nodes || [];
        const edges = (graph?.edges || []).filter((e) => e.kind === "membership");

        const researches = nodes.filter((n) => n.type === "research");
        const employees = nodes.filter((n) => n.type === "employee");

        const researchX = new Map();
        const employeeX = new Map();

        const researchRowWidth = Math.max(
            researches.length * (NODE_W + 16) - 16,
            NODE_W
        );
        const employeeRowWidth = Math.max(
            employees.length * (NODE_W + 16) - 16,
            NODE_W
        );
        const width = Math.max(researchRowWidth, employeeRowWidth, 320) + PAD * 2;

        researches.forEach((n, i) => {
            const span = width - PAD * 2 - NODE_W;
            const x = PAD + (researches.length === 1 ? span / 2 : (span * i) / Math.max(researches.length - 1, 1));
            researchX.set(n.id, x);
        });

        employees.forEach((n, i) => {
            const span = width - PAD * 2 - NODE_W;
            const x = PAD + (employees.length === 1 ? span / 2 : (span * i) / Math.max(employees.length - 1, 1));
            employeeX.set(n.id, x);
        });

        const researchY = PAD;
        const employeeY = PAD + NODE_H + ROW_GAP;
        const height = employeeY + NODE_H + PAD;

        const positions = new Map();
        researches.forEach((n) => {
            positions.set(n.id, {
                x: researchX.get(n.id),
                y: researchY,
                cx: researchX.get(n.id) + NODE_W / 2,
                cy: researchY + NODE_H,
            });
        });
        employees.forEach((n) => {
            positions.set(n.id, {
                x: employeeX.get(n.id),
                y: employeeY,
                cx: employeeX.get(n.id) + NODE_W / 2,
                cy: employeeY,
            });
        });

        return { width, height, positions, researches, employees, edges };
    }

    truncate(text, max) {
        const s = (text || "").toString();
        if (s.length <= max) return s;
        return `${s.slice(0, max - 1)}…`;
    }

    handleResearchKeyDown = (event, entityId) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        const { onResearchClick } = this.props;
        if (onResearchClick) onResearchClick(entityId);
    };

    renderNode(node, pos, variant) {
        const { onResearchClick } = this.props;
        const isResearch = variant === "research";
        const clickable = isResearch && typeof onResearchClick === "function";

        const nodeClass = isResearch
            ? `research-teams__map-node research-teams__map-node--research${
                  clickable ? " research-teams__map-node--clickable" : ""
              }`
            : "research-teams__map-node research-teams__map-node--employee";

        const content = (
            <>
                <rect
                    className="research-teams__map-rect"
                    x={pos.x}
                    y={pos.y}
                    width={NODE_W}
                    height={NODE_H}
                    rx={8}
                />
                <text
                    x={pos.x + NODE_W / 2}
                    y={pos.y + 18}
                    textAnchor="middle"
                    className="research-teams__map-label"
                >
                    {this.truncate(node.label, 16)}
                </text>
                {isResearch && node.status ? (
                    <text
                        x={pos.x + NODE_W / 2}
                        y={pos.y + 32}
                        textAnchor="middle"
                        className="research-teams__map-sublabel"
                    >
                        {node.status}
                    </text>
                ) : null}
                {!isResearch && node.position ? (
                    <text
                        x={pos.x + NODE_W / 2}
                        y={pos.y + 32}
                        textAnchor="middle"
                        className="research-teams__map-sublabel"
                    >
                        {this.truncate(node.position, 18)}
                    </text>
                ) : null}
            </>
        );

        if (clickable) {
            return (
                <g
                    key={node.id}
                    className={nodeClass}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open research: ${node.label}`}
                    onClick={() => onResearchClick(node.entityId)}
                    onKeyDown={(e) => this.handleResearchKeyDown(e, node.entityId)}
                >
                    {content}
                </g>
            );
        }

        return (
            <g key={node.id} className={nodeClass}>
                {content}
            </g>
        );
    }

    render() {
        const { graph } = this.props;
        if (!graph?.nodes?.length) {
            return <p className="research-teams__empty">No links to display on the map.</p>;
        }

        const { width, height, positions, researches, employees, edges } = this.buildLayout(graph);

        return (
            <div className="research-teams__map-wrap">
                <svg
                    className="research-teams__map-svg"
                    viewBox={`0 0 ${width} ${height}`}
                    width={width}
                    height={height}
                    role="img"
                    aria-label="Research and employee connection map"
                >
                    {edges.map((edge) => {
                        const from = positions.get(edge.source);
                        const to = positions.get(edge.target);
                        if (!from || !to) return null;
                        return (
                            <path
                                key={edge.id}
                                className="research-teams__map-edge"
                                d={`M ${from.cx} ${from.cy} C ${from.cx} ${from.cy + 40}, ${to.cx} ${to.cy - 40}, ${to.cx} ${to.cy}`}
                            />
                        );
                    })}
                    {researches.map((n) => this.renderNode(n, positions.get(n.id), "research"))}
                    {employees.map((n) => this.renderNode(n, positions.get(n.id), "employee"))}
                </svg>
            </div>
        );
    }
}

export default ResearchTeamsMap;
