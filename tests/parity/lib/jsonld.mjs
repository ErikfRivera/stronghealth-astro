// Semantic JSON-LD field resolution for the parity suites.
//
// The "$[N]" indices recorded in the fixture's field keys come from live
// production's post-hydration DOM order (react-helmet reordered the scripts),
// which does NOT match this repo's static script order. So fields are NEVER
// resolved by script index against built HTML. Instead the fixture records,
// per field, the target object's @type (+ occurrence among that type, resolved
// against the production capture at fixture-generation time), and this module
// locates the object by @type in document order, then applies the field's
// tail path (e.g. "mainEntityOfPage.@id", "itemListElement[2].item").

// Flatten parsed ld+json scripts into a single object list (document order),
// expanding top-level arrays and @graph containers.
export function flattenLdObjects(scripts) {
  const out = [];
  for (const s of scripts) {
    if (s.parseError || s.parsed == null) continue;
    const nodes = Array.isArray(s.parsed) ? s.parsed : [s.parsed];
    for (const node of nodes) {
      if (node && Array.isArray(node["@graph"])) out.push(...node["@graph"]);
      else out.push(node);
    }
  }
  return out;
}

function typeOf(obj) {
  const t = obj?.["@type"];
  return Array.isArray(t) ? t.join(",") : String(t);
}

function resolveTail(obj, tail) {
  const tokens = [...tail.matchAll(/\[(\d+)\]|([^.[\]]+)/g)].map((m) =>
    m[1] !== undefined ? Number(m[1]) : m[2],
  );
  let cur = obj;
  for (const t of tokens) {
    if (cur == null) return undefined;
    cur = cur[t];
  }
  return cur;
}

/**
 * Resolve one fixture jsonld expectation against a page's ld+json scripts.
 *
 * @param {Array} scripts   output of extractLdJsonScripts()
 * @param {object} spec     { expected, script_type, tail, type_occurrence }
 * @returns {{ ok: boolean, actual?: any, error?: string }}
 */
export function resolveJsonldExpectation(scripts, spec) {
  const objects = flattenLdObjects(scripts);
  const matching = objects.filter((o) => typeOf(o) === spec.script_type);
  if (matching.length === 0) {
    return {
      ok: false,
      error: `no JSON-LD object with @type "${spec.script_type}" (present: ${objects
        .map(typeOf)
        .join(", ")})`,
    };
  }
  const target = matching[Math.min(spec.type_occurrence, matching.length - 1)];
  const actual = resolveTail(target, spec.tail);
  if (actual === undefined) {
    return {
      ok: false,
      error: `@type "${spec.script_type}" found but path "${spec.tail}" is missing`,
    };
  }
  return { ok: actual === spec.expected, actual };
}
