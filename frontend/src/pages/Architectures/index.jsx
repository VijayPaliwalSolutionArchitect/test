import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { 
  Boxes, 
  RefreshCw, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Layers
} from 'lucide-react';

const CATEGORY_COLORS = {
  'microservices': '#3b82f6',
  'event-driven': '#8b5cf6',
  'data-mesh': '#06b6d4',
  'serverless': '#22c55e',
  'edge-computing': '#f59e0b',
  'ai-ml-ops': '#ec4899',
  'security-zero-trust': '#ef4444',
  'platform-engineering': '#64748b',
  'general': '#94a3b8'
};

const MATURITY_BADGES = {
  'emerging': { color: '#22c55e', bg: '#22c55e20' },
  'scaling': { color: '#f59e0b', bg: '#f59e0b20' },
  'mainstream': { color: '#3b82f6', bg: '#3b82f620' }
};

const Architectures = () => {
  const { architectures, fetchArchitectures, generateArchitectures, loading, points } = useAppStore();
  const [generating, setGenerating] = useState(false);
  const [expandedArch, setExpandedArch] = useState(null);

  useEffect(() => {
    fetchArchitectures();
  }, [fetchArchitectures]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateArchitectures();
    } catch (error) {
      console.error('Failed to generate architectures:', error);
    }
    setGenerating(false);
  };

  const toggleExpand = (archId) => {
    setExpandedArch(expandedArch === archId ? null : archId);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2" data-testid="arch-title">
            Reference Architectures
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            AI-generated architecture patterns based on your technology signals
          </p>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-4">
          <Button 
            variant="primary" 
            onClick={handleGenerate}
            disabled={generating || loading || points.length === 0}
            data-testid="generate-arch-btn"
          >
            {generating ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Zap className="w-5 h-5 mr-2" />
            )}
            {generating ? 'Generating...' : 'Generate Architectures'}
          </Button>
        </div>

        {/* Category Legend */}
        <div className="mb-6 flex flex-wrap gap-3">
          {Object.entries(CATEGORY_COLORS).filter(([k]) => k !== 'general').map(([category, color]) => (
            <div key={category} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[var(--text-secondary)] capitalize">{category.replace('-', ' ')}</span>
            </div>
          ))}
        </div>

        {architectures.length > 0 ? (
          <div className="space-y-6">
            {architectures.map((arch) => {
              const isExpanded = expandedArch === arch.id;
              const categoryColor = CATEGORY_COLORS[arch.category] || CATEGORY_COLORS.general;
              const maturityStyle = MATURITY_BADGES[arch.maturity] || MATURITY_BADGES.emerging;
              
              return (
                <Card 
                  key={arch.id} 
                  className="overflow-hidden"
                  data-testid={`arch-card-${arch.id}`}
                >
                  {/* Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-[var(--bg-primary)]/50 transition-colors"
                    onClick={() => toggleExpand(arch.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${categoryColor}20` }}
                        >
                          <Boxes className="w-6 h-6" style={{ color: categoryColor }} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
                            {arch.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span 
                              className="px-2 py-1 text-xs rounded-full font-medium capitalize"
                              style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                            >
                              {arch.category?.replace('-', ' ')}
                            </span>
                            <span 
                              className="px-2 py-1 text-xs rounded-full font-medium capitalize"
                              style={{ backgroundColor: maturityStyle.bg, color: maturityStyle.color }}
                            >
                              {arch.maturity}
                            </span>
                          </div>
                          <p className="text-[var(--text-secondary)] line-clamp-2">
                            {arch.description}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-[var(--text-secondary)]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[var(--text-secondary)]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-[var(--border-color)]">
                      {/* Architecture Diagram */}
                      {arch.components?.length > 0 && (
                        <div className="p-6 border-b border-[var(--border-color)]">
                          <h4 className="font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            Components & Connections
                          </h4>
                          
                          {/* Visual Component Diagram */}
                          <div className="bg-[var(--bg-primary)] rounded-lg p-6">
                            <div className="flex flex-wrap gap-4 justify-center items-center">
                              {arch.components.map((comp, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                  <div className="text-center">
                                    <div 
                                      className="w-24 h-20 rounded-lg border-2 flex flex-col items-center justify-center p-2"
                                      style={{ 
                                        borderColor: categoryColor,
                                        backgroundColor: `${categoryColor}10`
                                      }}
                                    >
                                      <div className="text-xs font-medium text-[var(--text-primary)] text-center">
                                        {comp.name}
                                      </div>
                                      <div className="text-[10px] text-[var(--text-secondary)] mt-1 capitalize">
                                        {comp.type}
                                      </div>
                                    </div>
                                  </div>
                                  {idx < arch.components.length - 1 && (
                                    <ArrowRight className="w-5 h-5 text-[var(--text-secondary)]" />
                                  )}
                                </div>
                              ))}
                            </div>
                            
                            {/* Connections */}
                            {arch.connections?.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                                <div className="text-xs text-[var(--text-secondary)] mb-2">Connections:</div>
                                <div className="flex flex-wrap gap-2">
                                  {arch.connections.map((conn, idx) => (
                                    <span 
                                      key={idx}
                                      className="px-2 py-1 text-xs bg-[var(--bg-secondary)] rounded-full text-[var(--text-secondary)]"
                                    >
                                      {conn.from} → {conn.to} ({conn.type})
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Use Cases */}
                      {arch.use_cases?.length > 0 && (
                        <div className="p-6 border-b border-[var(--border-color)]">
                          <h4 className="font-medium text-[var(--text-primary)] mb-3">Use Cases</h4>
                          <ul className="space-y-2">
                            {arch.use_cases.map((useCase, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-[var(--text-secondary)]">
                                <span className="text-[var(--color-primary)]">•</span>
                                {useCase}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Benefits & Challenges */}
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        {arch.benefits?.length > 0 && (
                          <div className="p-6 border-b md:border-b-0 md:border-r border-[var(--border-color)]">
                            <h4 className="font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Benefits
                            </h4>
                            <ul className="space-y-2">
                              {arch.benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-[var(--text-secondary)] text-sm">
                                  <span className="text-green-500">✓</span>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {arch.challenges?.length > 0 && (
                          <div className="p-6">
                            <h4 className="font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                              Challenges
                            </h4>
                            <ul className="space-y-2">
                              {arch.challenges.map((challenge, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-[var(--text-secondary)] text-sm">
                                  <span className="text-amber-500">!</span>
                                  {challenge}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Boxes className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              No Architectures Generated
            </h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              {points.length === 0 
                ? 'Add emergent points first, then generate reference architectures.'
                : 'Click "Generate Architectures" to create reference architecture patterns.'}
            </p>
            <Button variant="primary" onClick={handleGenerate} disabled={points.length === 0 || generating}>
              <Zap className="w-5 h-5 mr-2" />
              Generate Architectures
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Architectures;
