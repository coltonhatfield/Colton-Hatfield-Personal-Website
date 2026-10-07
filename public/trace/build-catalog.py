"""Build the offline taxonomy from MITRE's downloaded JSON-LD; no network at runtime."""
import hashlib
import json
from pathlib import Path

source = Path(__file__).with_name('d3fend-ontology.json')
raw = source.read_bytes()
graph = json.loads(raw)['@graph']
nodes = {n['@id']: n for n in graph}
def refs(value):
    return [x['@id'] for x in (value if isinstance(value, list) else [value]) if isinstance(x, dict) and '@id' in x]
def roots(identifier, seen=frozenset()):
    if identifier in seen:
        return set()
    node = nodes.get(identifier, {})
    tactics = [x for x in refs(node.get('d3f:enables', [])) if x in ['d3f:'+t for t in ['Model','Harden','Detect','Isolate','Deceive','Evict','Restore']]]
    if tactics:
        return {(identifier[4:], t[4:].lower()) for t in tactics}
    return set().union(*(roots(p, seen | {identifier}) for p in refs(node.get('rdfs:subClassOf', []))))

catalog = {}
for identifier, node in nodes.items():
    families = sorted(roots(identifier)) if 'd3f:d3fend-id' in node else []
    if families:
        catalog[identifier[4:]] = {'families': [f for f,t in families], 'tactic': families[0][1], 'code': node['d3f:d3fend-id']}
version = next(n['owl:versionInfo'] for n in graph if n.get('@id') == 'http://d3fend.mitre.org/ontologies/d3fend.owl')
payload = {'version': version, 'source': 'https://d3fend.mitre.org/ontologies/d3fend.json', 'sha256': hashlib.sha256(raw).hexdigest(), 'techniques': catalog}
Path(__file__).with_name('d3fend-catalog.js').write_text('/* Derived from MITRE D3FEND; taxonomy only, not effectiveness ratings. */\n(function(root) {\n  const catalog = '+json.dumps(payload, sort_keys=True, separators=(',', ':'))+';\n  if (typeof module !== "undefined" && module.exports) module.exports = catalog;\n  else root.PacerCatalog = catalog;\n})(typeof globalThis !== "undefined" ? globalThis : this);\n', encoding='utf-8')
print(f'D3FEND {version}: {len(catalog)} techniques; SHA256 {payload["sha256"]}')
