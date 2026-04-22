"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layoutForceDirected = void 0;
const vec_1 = require("@basementuniverse/vec");
const DEFAULT_OPTIONS = {
    iterations: 120,
    timeBudgetMs: undefined,
    repulsionStrength: 15000,
    attractionStrength: 0.02,
    minNodeSpacing: 120,
    damping: 0.85,
    maxStep: 16,
};
async function layoutForceDirected(graph, options = {}) {
    const settings = { ...DEFAULT_OPTIONS, ...options };
    const startTime = Date.now();
    const positions = new Map();
    const velocities = new Map();
    for (const node of graph.nodes) {
        positions.set(node.id, (0, vec_1.vec2)(node.position));
        velocities.set(node.id, (0, vec_1.vec2)());
    }
    let converged = false;
    let iterationsCompleted = 0;
    for (let iteration = 0; iteration < settings.iterations; iteration++) {
        if (settings.timeBudgetMs !== undefined &&
            Date.now() - startTime >= settings.timeBudgetMs) {
            break;
        }
        const forces = new Map();
        for (const node of graph.nodes) {
            forces.set(node.id, (0, vec_1.vec2)());
        }
        for (let i = 0; i < graph.nodes.length; i++) {
            for (let j = i + 1; j < graph.nodes.length; j++) {
                const a = graph.nodes[i];
                const b = graph.nodes[j];
                const aPos = positions.get(a.id);
                const bPos = positions.get(b.id);
                let delta = vec_1.vec2.sub(aPos, bPos);
                let distance = vec_1.vec2.len(delta);
                if (distance < 1) {
                    delta = (0, vec_1.vec2)(Math.random() - 0.5, Math.random() - 0.5);
                    distance = Math.max(1, vec_1.vec2.len(delta));
                }
                const direction = vec_1.vec2.div(delta, distance);
                const effectiveDistance = Math.max(1, distance - settings.minNodeSpacing);
                const repulsion = settings.repulsionStrength / (effectiveDistance * effectiveDistance);
                const repulsionVec = vec_1.vec2.mul(direction, repulsion);
                forces.set(a.id, vec_1.vec2.add(forces.get(a.id), repulsionVec));
                forces.set(b.id, vec_1.vec2.sub(forces.get(b.id), repulsionVec));
            }
        }
        for (const edge of graph.edges) {
            const source = edge.a.nodeId;
            const target = edge.b.nodeId;
            if (!positions.has(source) || !positions.has(target)) {
                continue;
            }
            const sourcePos = positions.get(source);
            const targetPos = positions.get(target);
            const delta = vec_1.vec2.sub(targetPos, sourcePos);
            const distance = Math.max(1, vec_1.vec2.len(delta));
            const direction = vec_1.vec2.div(delta, distance);
            const attraction = (distance - settings.minNodeSpacing) * settings.attractionStrength;
            const attractionVec = vec_1.vec2.mul(direction, attraction);
            forces.set(source, vec_1.vec2.add(forces.get(source), attractionVec));
            forces.set(target, vec_1.vec2.sub(forces.get(target), attractionVec));
        }
        let totalStep = 0;
        for (const node of graph.nodes) {
            const force = forces.get(node.id);
            const oldVelocity = velocities.get(node.id);
            const dampedVelocity = vec_1.vec2.mul(oldVelocity, settings.damping);
            let velocity = vec_1.vec2.add(dampedVelocity, force);
            const speed = vec_1.vec2.len(velocity);
            if (speed > settings.maxStep) {
                velocity = vec_1.vec2.mul(vec_1.vec2.div(velocity, speed), settings.maxStep);
            }
            velocities.set(node.id, velocity);
            positions.set(node.id, vec_1.vec2.add(positions.get(node.id), velocity));
            totalStep += vec_1.vec2.len(velocity);
        }
        iterationsCompleted = iteration + 1;
        if (totalStep / Math.max(1, graph.nodes.length) < 0.05) {
            converged = true;
            break;
        }
        if (iteration % 10 === 0) {
            await Promise.resolve();
        }
    }
    return {
        nodePositions: positions,
        converged,
        iterationsCompleted,
    };
}
exports.layoutForceDirected = layoutForceDirected;
//# sourceMappingURL=ForceDirectedLayout.js.map