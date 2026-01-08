import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { 
  Lightbulb, 
  Plus, 
  Trash2, 
  Upload,
  X,
  Check,
  AlertCircle,
  Filter,
  RefreshCw
} from 'lucide-react';

const DOMAINS = ['cloud', 'data', 'AI', 'security', 'integration', 'ops', 'devops', 'infrastructure'];
const MATURITIES = ['emerging', 'scaling', 'mainstream'];

const DOMAIN_COLORS = {
  'cloud': '#3b82f6',
  'data': '#8b5cf6',
  'AI': '#06b6d4',
  'security': '#ef4444',
  'integration': '#f59e0b',
  'ops': '#22c55e',
  'devops': '#ec4899',
  'infrastructure': '#64748b',
  'unknown': '#94a3b8'
};

const SAMPLE_POINTS = [
  {
    title: "WebAssembly for Cloud-Native Workloads",
    description: "WASM is emerging as a lightweight alternative to containers for serverless and edge computing. Companies like Fermyon and Cosmonic are building WASM-first platforms.",
    source: "Cloud Native Foundation",
    tags: ["wasm", "serverless", "edge"]
  },
  {
    title: "AI Agents and Autonomous Systems",
    description: "Multi-agent AI systems are moving from research to production. LLM-powered agents can now execute complex multi-step tasks with tool use and reasoning.",
    source: "OpenAI, Anthropic Research",
    tags: ["ai-agents", "llm", "automation"]
  },
  {
    title: "Platform Engineering and Internal Developer Platforms",
    description: "Organizations are building self-service platforms to abstract away infrastructure complexity. Backstage, Port, and Humanitec are leading the space.",
    source: "Gartner Hype Cycle 2024",
    tags: ["platform-engineering", "devex", "IDP"]
  },
  {
    title: "Zero Trust Security Architecture",
    description: "The shift from perimeter-based to identity-centric security continues. SASE, ZTNA, and micro-segmentation are becoming standard requirements.",
    source: "NIST, Forrester",
    tags: ["zero-trust", "security", "identity"]
  },
  {
    title: "Real-Time Data Streaming and Event-Driven Architecture",
    description: "Kafka alternatives like Redpanda and streaming databases like Materialize are making real-time data processing more accessible.",
    source: "Confluent, Industry Reports",
    tags: ["streaming", "kafka", "real-time"]
  },
  {
    title: "FinOps and Cloud Cost Optimization",
    description: "With rising cloud costs, FinOps practices and tools like Kubecost, CloudHealth are becoming critical for enterprises.",
    source: "FinOps Foundation",
    tags: ["finops", "cost", "cloud"]
  },
  {
    title: "GitOps and Infrastructure as Code Evolution",
    description: "ArgoCD, Flux, and Crossplane are enabling declarative infrastructure management. Terraform alternatives like Pulumi and OpenTofu are gaining traction.",
    source: "CNCF Landscape",
    tags: ["gitops", "iac", "kubernetes"]
  },
  {
    title: "Generative AI in Software Development",
    description: "AI coding assistants (GitHub Copilot, Cursor, Codeium) are transforming developer productivity. AI-generated code now accounts for 30%+ in some organizations.",
    source: "GitHub, Stack Overflow Survey",
    tags: ["genai", "coding", "productivity"]
  },
  {
    title: "Observability 2.0 and OpenTelemetry",
    description: "OpenTelemetry is becoming the standard for instrumentation. eBPF-based observability tools provide kernel-level insights without code changes.",
    source: "CNCF, Datadog",
    tags: ["observability", "otel", "ebpf"]
  },
  {
    title: "Database Renaissance - NewSQL and Multi-Model",
    description: "Databases like CockroachDB, TiDB offer distributed SQL. Multi-model databases (SurrealDB, FaunaDB) blur the lines between document and relational.",
    source: "DB-Engines Rankings",
    tags: ["database", "newsql", "distributed"]
  },
  {
    title: "Edge Computing and CDN Evolution",
    description: "Edge computing is moving beyond CDN. Cloudflare Workers, Deno Deploy, and Fastly Compute enable serverless at the edge with global distribution.",
    source: "Edge Computing World",
    tags: ["edge", "cdn", "serverless"]
  },
  {
    title: "API Security and API-First Development",
    description: "API attacks are rising. API gateways, security tools (Salt, Noname), and API-first design with OpenAPI/GraphQL are essential practices.",
    source: "OWASP API Security",
    tags: ["api", "security", "gateway"]
  }
];

const EmergentPoints = () => {
  const { points, fetchPoints, addBulkPoints, deletePoint, loading } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [filterMaturity, setFilterMaturity] = useState('');
  const [adding, setAdding] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPoints(filterDomain || undefined, filterMaturity || undefined);
  }, [fetchPoints, filterDomain, filterMaturity]);

  const handleAddBulk = async () => {
    setAdding(true);
    try {
      // Parse bulk input - expects JSON array or newline-separated entries
      let pointsToAdd;
      try {
        pointsToAdd = JSON.parse(bulkInput);
      } catch {
        // Try to parse as simple list
        const lines = bulkInput.split('\n').filter(line => line.trim());
        pointsToAdd = lines.map(line => ({
          title: line.split(':')[0]?.trim() || line.trim(),
          description: line.split(':').slice(1).join(':').trim() || line.trim(),
          tags: []
        }));
      }
      
      await addBulkPoints(pointsToAdd);
      setSuccessMessage(`Successfully added ${pointsToAdd.length} points!`);
      setBulkInput('');
      setShowAddModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to add points:', error);
    }
    setAdding(false);
  };

  const handleLoadSamples = async () => {
    setAdding(true);
    try {
      await addBulkPoints(SAMPLE_POINTS);
      setSuccessMessage(`Successfully added ${SAMPLE_POINTS.length} sample points!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to load samples:', error);
    }
    setAdding(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2" data-testid="points-title">
            Emergent Points
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Technology signals, trends, risks, and ideas - AI-classified and analyzed
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-green-500">{successMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="primary" 
              onClick={() => setShowAddModal(true)}
              data-testid="add-points-btn"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Points
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLoadSamples}
              disabled={adding}
              data-testid="load-samples-btn"
            >
              {adding ? (
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Upload className="w-5 h-5 mr-2" />
              )}
              Load 12 Sample Points
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 items-center">
            <Filter className="w-4 h-4 text-[var(--text-secondary)]" />
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm"
              data-testid="filter-domain"
            >
              <option value="">All Domains</option>
              {DOMAINS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={filterMaturity}
              onChange={(e) => setFilterMaturity(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm"
              data-testid="filter-maturity"
            >
              <option value="">All Maturity</option>
              {MATURITIES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Points Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
          </div>
        ) : points.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {points.map((point) => (
              <Card key={point.id} className="relative group" data-testid={`point-card-${point.id}`}>
                {/* Delete Button */}
                <button
                  onClick={() => deletePoint(point.id)}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                  data-testid={`delete-point-${point.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${DOMAIN_COLORS[point.domain] || DOMAIN_COLORS.unknown}20` }}
                  >
                    <Lightbulb 
                      className="w-5 h-5" 
                      style={{ color: DOMAIN_COLORS[point.domain] || DOMAIN_COLORS.unknown }}
                    />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <h3 className="font-semibold text-[var(--text-primary)] line-clamp-2 pr-8">
                      {point.title}
                    </h3>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span 
                    className="px-2 py-1 text-xs rounded-full font-medium"
                    style={{ 
                      backgroundColor: `${DOMAIN_COLORS[point.domain] || DOMAIN_COLORS.unknown}20`,
                      color: DOMAIN_COLORS[point.domain] || DOMAIN_COLORS.unknown
                    }}
                  >
                    {point.domain || 'unknown'}
                  </span>
                  <span 
                    className="px-2 py-1 text-xs rounded-full font-medium"
                    style={{ 
                      backgroundColor: point.maturity === 'emerging' ? '#22c55e20' : 
                                      point.maturity === 'scaling' ? '#f59e0b20' : 
                                      point.maturity === 'mainstream' ? '#3b82f620' : '#94a3b820',
                      color: point.maturity === 'emerging' ? '#22c55e' : 
                             point.maturity === 'scaling' ? '#f59e0b' : 
                             point.maturity === 'mainstream' ? '#3b82f6' : '#94a3b8'
                    }}
                  >
                    {point.maturity || 'unknown'}
                  </span>
                  {point.impact_score && (
                    <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium">
                      Impact: {point.impact_score}/10
                    </span>
                  )}
                </div>

                {/* Analysis */}
                <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-3">
                  {point.analysis || point.description}
                </p>

                {/* Source */}
                {point.source && (
                  <p className="text-xs text-[var(--text-secondary)] opacity-70">
                    Source: {point.source}
                  </p>
                )}

                {/* Risks & Opportunities */}
                {(point.risks?.length > 0 || point.opportunities?.length > 0) && (
                  <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                    {point.risks?.length > 0 && (
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                          {point.risks.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    )}
                    {point.opportunities?.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                          {point.opportunities.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Lightbulb className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              No Emergent Points Yet
            </h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              Add technology signals, trends, or ideas. The AI will classify them by domain and maturity.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Add Points
              </Button>
              <Button variant="outline" onClick={handleLoadSamples} disabled={adding}>
                <Upload className="w-5 h-5 mr-2" />
                Load Samples
              </Button>
            </div>
          </Card>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-primary)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Add Emergent Points (Bulk)
                </h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Paste a JSON array of points. Each point should have: title, description, source (optional), tags (optional)
                </p>
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder={`[\n  {\n    "title": "WebAssembly for Cloud Workloads",\n    "description": "WASM is emerging as a container alternative...",\n    "source": "Cloud Native Foundation",\n    "tags": ["wasm", "cloud"]\n  }\n]`}
                  className="w-full h-64 p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  data-testid="bulk-input-textarea"
                />
              </div>

              <div className="p-6 border-t border-[var(--border-color)] flex gap-4 justify-end">
                <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleAddBulk}
                  disabled={!bulkInput.trim() || adding}
                  data-testid="submit-bulk-btn"
                >
                  {adding ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5 mr-2" />
                  )}
                  {adding ? 'Adding...' : 'Add Points'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergentPoints;
