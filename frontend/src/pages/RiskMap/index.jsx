import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { 
  AlertTriangle, 
  TrendingUp,
  RefreshCw, 
  Zap,
  Shield,
  AlertCircle,
  Activity,
  Target,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react';

const SEVERITY_CONFIG = {
  'critical': { color: '#ef4444', bg: '#ef444420', icon: AlertCircle },
  'high': { color: '#f97316', bg: '#f9731620', icon: AlertTriangle },
  'medium': { color: '#f59e0b', bg: '#f59e0b20', icon: Activity },
  'low': { color: '#22c55e', bg: '#22c55e20', icon: Shield }
};

const CATEGORY_CONFIG = {
  'technical': { color: '#3b82f6', label: 'Technical' },
  'security': { color: '#ef4444', label: 'Security' },
  'operational': { color: '#f59e0b', label: 'Operational' },
  'strategic': { color: '#8b5cf6', label: 'Strategic' },
  'compliance': { color: '#06b6d4', label: 'Compliance' },
  'cost-reduction': { color: '#22c55e', label: 'Cost Reduction' },
  'innovation': { color: '#ec4899', label: 'Innovation' },
  'competitive-advantage': { color: '#3b82f6', label: 'Competitive Advantage' },
  'efficiency': { color: '#f59e0b', label: 'Efficiency' },
  'growth': { color: '#8b5cf6', label: 'Growth' }
};

const POTENTIAL_CONFIG = {
  'high': { color: '#22c55e', bg: '#22c55e20' },
  'medium': { color: '#f59e0b', bg: '#f59e0b20' },
  'low': { color: '#94a3b8', bg: '#94a3b820' }
};

const RiskMap = () => {
  const { risks, opportunities, fetchRisks, generateRisks, loading, points } = useAppStore();
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('risks');
  const [expandedItem, setExpandedItem] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('');

  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateRisks();
    } catch (error) {
      console.error('Failed to generate risks:', error);
    }
    setGenerating(false);
  };

  const filteredRisks = filterSeverity 
    ? risks.filter(r => r.severity === filterSeverity)
    : risks;

  // Risk Matrix Data
  const riskMatrix = {
    'high-critical': risks.filter(r => r.probability === 'high' && r.severity === 'critical'),
    'high-high': risks.filter(r => r.probability === 'high' && r.severity === 'high'),
    'high-medium': risks.filter(r => r.probability === 'high' && r.severity === 'medium'),
    'high-low': risks.filter(r => r.probability === 'high' && r.severity === 'low'),
    'medium-critical': risks.filter(r => r.probability === 'medium' && r.severity === 'critical'),
    'medium-high': risks.filter(r => r.probability === 'medium' && r.severity === 'high'),
    'medium-medium': risks.filter(r => r.probability === 'medium' && r.severity === 'medium'),
    'medium-low': risks.filter(r => r.probability === 'medium' && r.severity === 'low'),
    'low-critical': risks.filter(r => r.probability === 'low' && r.severity === 'critical'),
    'low-high': risks.filter(r => r.probability === 'low' && r.severity === 'high'),
    'low-medium': risks.filter(r => r.probability === 'low' && r.severity === 'medium'),
    'low-low': risks.filter(r => r.probability === 'low' && r.severity === 'low'),
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2" data-testid="risk-title">
            Risk & Opportunity Map
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Identify and manage technology risks and opportunities
          </p>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-4">
          <Button 
            variant="primary" 
            onClick={handleGenerate}
            disabled={generating || loading || points.length === 0}
            data-testid="generate-risks-btn"
          >
            {generating ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Zap className="w-5 h-5 mr-2" />
            )}
            {generating ? 'Analyzing...' : 'Generate Risk Analysis'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-[var(--border-color)]">
          <button
            onClick={() => setActiveTab('risks')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'risks'
                ? 'border-red-500 text-red-500'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            data-testid="tab-risks"
          >
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Risks ({risks.length})
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'opportunities'
                ? 'border-green-500 text-green-500'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            data-testid="tab-opportunities"
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Opportunities ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'matrix'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            data-testid="tab-matrix"
          >
            <Target className="w-4 h-4 inline mr-2" />
            Risk Matrix
          </button>
        </div>

        {/* Content */}
        {risks.length > 0 || opportunities.length > 0 ? (
          <>
            {/* Risks Tab */}
            {activeTab === 'risks' && (
              <div>
                {/* Filter */}
                <div className="mb-4 flex gap-2">
                  <span className="text-sm text-[var(--text-secondary)] py-2">Filter by severity:</span>
                  {['', 'critical', 'high', 'medium', 'low'].map((sev) => (
                    <button
                      key={sev || 'all'}
                      onClick={() => setFilterSeverity(sev)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        filterSeverity === sev
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]/80'
                      }`}
                    >
                      {sev || 'All'}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {filteredRisks.map((risk) => {
                    const sevConfig = SEVERITY_CONFIG[risk.severity] || SEVERITY_CONFIG.medium;
                    const catConfig = CATEGORY_CONFIG[risk.category] || { color: '#94a3b8', label: risk.category };
                    const SevIcon = sevConfig.icon;
                    const isExpanded = expandedItem === risk.id;

                    return (
                      <Card key={risk.id} className="overflow-hidden" data-testid={`risk-card-${risk.id}`}>
                        <div 
                          className="p-4 cursor-pointer hover:bg-[var(--bg-primary)]/50"
                          onClick={() => setExpandedItem(isExpanded ? null : risk.id)}
                        >
                          <div className="flex items-start gap-4">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: sevConfig.bg }}
                            >
                              <SevIcon className="w-5 h-5" style={{ color: sevConfig.color }} />
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-[var(--text-primary)]">
                                  {risk.title}
                                </h3>
                                <div className="flex gap-2 flex-shrink-0">
                                  <span 
                                    className="px-2 py-1 text-xs rounded-full font-medium uppercase"
                                    style={{ backgroundColor: sevConfig.bg, color: sevConfig.color }}
                                  >
                                    {risk.severity}
                                  </span>
                                  <span 
                                    className="px-2 py-1 text-xs rounded-full"
                                    style={{ backgroundColor: `${catConfig.color}20`, color: catConfig.color }}
                                  >
                                    {catConfig.label}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                                {risk.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-secondary)]">
                                <span>Probability: <strong className="capitalize">{risk.probability}</strong></span>
                                {risk.affected_domains?.length > 0 && (
                                  <span>Domains: {risk.affected_domains.slice(0, 3).join(', ')}</span>
                                )}
                              </div>
                            </div>
                            <button className="p-1">
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-[var(--border-color)] p-4 space-y-4">
                            <div>
                              <h4 className="font-medium text-[var(--text-primary)] mb-2">Impact</h4>
                              <p className="text-sm text-[var(--text-secondary)]">{risk.impact}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-500" />
                                Mitigation Strategy
                              </h4>
                              <p className="text-sm text-[var(--text-secondary)]">{risk.mitigation}</p>
                            </div>
                            {risk.dependencies?.length > 0 && (
                              <div>
                                <h4 className="font-medium text-[var(--text-primary)] mb-2">Dependencies</h4>
                                <div className="flex flex-wrap gap-2">
                                  {risk.dependencies.map((dep, idx) => (
                                    <span key={idx} className="px-2 py-1 text-xs bg-[var(--bg-primary)] rounded-full">
                                      {dep}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Opportunities Tab */}
            {activeTab === 'opportunities' && (
              <div className="space-y-4">
                {opportunities.map((opp) => {
                  const potConfig = POTENTIAL_CONFIG[opp.potential] || POTENTIAL_CONFIG.medium;
                  const catConfig = CATEGORY_CONFIG[opp.category] || { color: '#94a3b8', label: opp.category };
                  const isExpanded = expandedItem === opp.id;

                  return (
                    <Card key={opp.id} className="overflow-hidden" data-testid={`opp-card-${opp.id}`}>
                      <div 
                        className="p-4 cursor-pointer hover:bg-[var(--bg-primary)]/50"
                        onClick={() => setExpandedItem(isExpanded ? null : opp.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: potConfig.bg }}
                          >
                            <TrendingUp className="w-5 h-5" style={{ color: potConfig.color }} />
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-[var(--text-primary)]">
                                {opp.title}
                              </h3>
                              <div className="flex gap-2 flex-shrink-0">
                                <span 
                                  className="px-2 py-1 text-xs rounded-full font-medium uppercase"
                                  style={{ backgroundColor: potConfig.bg, color: potConfig.color }}
                                >
                                  {opp.potential} Potential
                                </span>
                                <span 
                                  className="px-2 py-1 text-xs rounded-full capitalize"
                                  style={{ backgroundColor: `${catConfig.color}20`, color: catConfig.color }}
                                >
                                  {catConfig.label}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                              {opp.description}
                            </p>
                            {opp.timeline && (
                              <div className="mt-2 text-xs text-[var(--text-secondary)]">
                                Timeline: <strong>{opp.timeline}</strong>
                              </div>
                            )}
                          </div>
                          <button className="p-1">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-[var(--border-color)] p-4 space-y-4">
                          {opp.benefits?.length > 0 && (
                            <div>
                              <h4 className="font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Benefits
                              </h4>
                              <ul className="space-y-1">
                                {opp.benefits.map((benefit, idx) => (
                                  <li key={idx} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                                    <span className="text-green-500">✓</span>
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {opp.requirements?.length > 0 && (
                            <div>
                              <h4 className="font-medium text-[var(--text-primary)] mb-2">Requirements</h4>
                              <ul className="space-y-1">
                                {opp.requirements.map((req, idx) => (
                                  <li key={idx} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                                    <span className="text-[var(--color-primary)]">•</span>
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Risk Matrix Tab */}
            {activeTab === 'matrix' && risks.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-[var(--text-primary)] mb-4">Risk Assessment Matrix</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr>
                        <th className="p-2 text-left text-[var(--text-secondary)] text-sm w-24">Probability</th>
                        <th className="p-2 text-center bg-red-500/10 text-red-500 text-sm">Critical</th>
                        <th className="p-2 text-center bg-orange-500/10 text-orange-500 text-sm">High</th>
                        <th className="p-2 text-center bg-amber-500/10 text-amber-500 text-sm">Medium</th>
                        <th className="p-2 text-center bg-green-500/10 text-green-500 text-sm">Low</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['high', 'medium', 'low'].map((prob) => (
                        <tr key={prob} className="border-t border-[var(--border-color)]">
                          <td className="p-2 font-medium text-[var(--text-primary)] capitalize text-sm">{prob}</td>
                          {['critical', 'high', 'medium', 'low'].map((sev) => {
                            const items = riskMatrix[`${prob}-${sev}`] || [];
                            const bgColor = prob === 'high' && (sev === 'critical' || sev === 'high') 
                              ? 'bg-red-500/20' 
                              : prob === 'high' || sev === 'critical'
                              ? 'bg-orange-500/10'
                              : 'bg-[var(--bg-secondary)]';
                            return (
                              <td key={sev} className={`p-2 ${bgColor} text-center`}>
                                {items.length > 0 ? (
                                  <div className="space-y-1">
                                    {items.slice(0, 2).map((item, idx) => (
                                      <div 
                                        key={idx} 
                                        className="text-xs p-1 bg-[var(--bg-primary)] rounded truncate"
                                        title={item.title}
                                      >
                                        {item.title.substring(0, 20)}...
                                      </div>
                                    ))}
                                    {items.length > 2 && (
                                      <div className="text-xs text-[var(--text-secondary)]">
                                        +{items.length - 2} more
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[var(--text-secondary)] text-xs">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              No Risk Analysis Generated
            </h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              {points.length === 0 
                ? 'Add emergent points first, then generate risk analysis.'
                : 'Click "Generate Risk Analysis" to identify risks and opportunities.'}
            </p>
            <Button variant="primary" onClick={handleGenerate} disabled={points.length === 0 || generating}>
              <Zap className="w-5 h-5 mr-2" />
              Generate Risk Analysis
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RiskMap;
