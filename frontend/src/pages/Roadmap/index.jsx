import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { 
  Map, 
  RefreshCw, 
  Zap,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  ChevronRight,
  Filter
} from 'lucide-react';

const PHASE_CONFIG = {
  'now': { color: '#22c55e', label: 'Now', description: 'Immediate priority' },
  'next': { color: '#3b82f6', label: 'Next', description: '1-2 quarters' },
  'later': { color: '#f59e0b', label: 'Later', description: '3-4 quarters' },
  'future': { color: '#8b5cf6', label: 'Future', description: '1+ year' }
};

const EFFORT_CONFIG = {
  'small': { width: '25%', label: 'S' },
  'medium': { width: '50%', label: 'M' },
  'large': { width: '75%', label: 'L' },
  'xlarge': { width: '100%', label: 'XL' }
};

const PRIORITY_CONFIG = {
  'critical': { color: '#ef4444', icon: AlertCircle },
  'high': { color: '#f97316', icon: ChevronRight },
  'medium': { color: '#f59e0b', icon: Circle },
  'low': { color: '#94a3b8', icon: Circle }
};

const STATUS_CONFIG = {
  'planned': { color: '#94a3b8', icon: Circle },
  'in-progress': { color: '#3b82f6', icon: Clock },
  'completed': { color: '#22c55e', icon: CheckCircle },
  'blocked': { color: '#ef4444', icon: AlertCircle }
};

const Roadmap = () => {
  const { roadmapItems, fetchRoadmap, generateRoadmap, loading, points } = useAppStore();
  const [generating, setGenerating] = useState(false);
  const [viewMode, setViewMode] = useState('timeline'); // timeline, list, kanban
  const [filterPhase, setFilterPhase] = useState('');

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateRoadmap();
    } catch (error) {
      console.error('Failed to generate roadmap:', error);
    }
    setGenerating(false);
  };

  // Group items by phase
  const groupedByPhase = roadmapItems.reduce((acc, item) => {
    const phase = item.phase || 'later';
    if (!acc[phase]) acc[phase] = [];
    acc[phase].push(item);
    return acc;
  }, {});

  const filteredItems = filterPhase 
    ? roadmapItems.filter(item => item.phase === filterPhase)
    : roadmapItems;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2" data-testid="roadmap-title">
            Adoption Roadmap
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Strategic timeline for technology adoption initiatives
          </p>
        </div>

        {/* Actions */}
        <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-4">
            <Button 
              variant="primary" 
              onClick={handleGenerate}
              disabled={generating || loading || points.length === 0}
              data-testid="generate-roadmap-btn"
            >
              {generating ? (
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Zap className="w-5 h-5 mr-2" />
              )}
              {generating ? 'Generating...' : 'Generate Roadmap'}
            </Button>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-[var(--bg-secondary)] p-1 rounded-lg">
            {['timeline', 'kanban', 'list'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                  viewMode === mode
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Phase Legend */}
        <div className="mb-6 flex flex-wrap gap-4">
          {Object.entries(PHASE_CONFIG).map(([phase, config]) => (
            <button
              key={phase}
              onClick={() => setFilterPhase(filterPhase === phase ? '' : phase)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                filterPhase === phase 
                  ? 'bg-[var(--color-primary)]/10 ring-2 ring-[var(--color-primary)]'
                  : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80'
              }`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
              <span className="font-medium text-[var(--text-primary)]">{config.label}</span>
              <span className="text-xs text-[var(--text-secondary)]">{config.description}</span>
            </button>
          ))}
        </div>

        {roadmapItems.length > 0 ? (
          <>
            {/* Timeline View */}
            {viewMode === 'timeline' && (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[var(--border-color)]" />
                
                <div className="space-y-8">
                  {['now', 'next', 'later', 'future'].map((phase) => {
                    const items = groupedByPhase[phase] || [];
                    const config = PHASE_CONFIG[phase];
                    if (items.length === 0 && filterPhase && filterPhase !== phase) return null;
                    
                    return (
                      <div key={phase}>
                        {/* Phase Header */}
                        <div className="flex items-center gap-4 mb-4">
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center z-10 border-4 border-[var(--bg-primary)]"
                            style={{ backgroundColor: config.color }}
                          >
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">
                              {config.label}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {config.description} • {items.length} items
                            </p>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="ml-20 space-y-4">
                          {items.length > 0 ? items.map((item) => {
                            const priorityConfig = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.medium;
                            const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.planned;
                            const effortConfig = EFFORT_CONFIG[item.effort] || EFFORT_CONFIG.medium;
                            const StatusIcon = statusConfig.icon;

                            return (
                              <Card key={item.id} className="p-4" data-testid={`roadmap-item-${item.id}`}>
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                      <StatusIcon 
                                        className="w-4 h-4" 
                                        style={{ color: statusConfig.color }}
                                      />
                                      <h4 className="font-semibold text-[var(--text-primary)]">
                                        {item.title}
                                      </h4>
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                                      {item.description}
                                    </p>
                                    
                                    {/* Meta info */}
                                    <div className="flex flex-wrap gap-3 text-xs">
                                      <span 
                                        className="px-2 py-1 rounded-full capitalize"
                                        style={{ backgroundColor: `${priorityConfig.color}20`, color: priorityConfig.color }}
                                      >
                                        {item.priority} priority
                                      </span>
                                      <span className="px-2 py-1 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                                        {item.quarter || 'TBD'}
                                      </span>
                                      <span className="px-2 py-1 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                                        {item.domain}
                                      </span>
                                    </div>

                                    {/* Effort Bar */}
                                    <div className="mt-3">
                                      <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-[var(--text-secondary)]">Effort</span>
                                        <span className="text-[var(--text-primary)] font-medium">
                                          {effortConfig.label} ({item.effort})
                                        </span>
                                      </div>
                                      <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                                        <div 
                                          className="h-full rounded-full transition-all"
                                          style={{ 
                                            width: effortConfig.width,
                                            backgroundColor: config.color
                                          }}
                                        />
                                      </div>
                                    </div>

                                    {/* Milestones */}
                                    {item.milestones?.length > 0 && (
                                      <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                                        <div className="text-xs text-[var(--text-secondary)] mb-2">Milestones:</div>
                                        <div className="flex flex-wrap gap-2">
                                          {item.milestones.slice(0, 3).map((ms, idx) => (
                                            <span 
                                              key={idx}
                                              className="px-2 py-1 text-xs bg-[var(--bg-primary)] rounded-full text-[var(--text-secondary)]"
                                            >
                                              {ms.name}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            );
                          }) : (
                            <div className="text-[var(--text-secondary)] text-sm py-4">
                              No items in this phase
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Kanban View */}
            {viewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {['now', 'next', 'later', 'future'].map((phase) => {
                  const items = groupedByPhase[phase] || [];
                  const config = PHASE_CONFIG[phase];
                  
                  return (
                    <div key={phase} className="flex flex-col">
                      <div 
                        className="p-3 rounded-t-lg flex items-center gap-2"
                        style={{ backgroundColor: `${config.color}20` }}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                        <span className="font-semibold" style={{ color: config.color }}>
                          {config.label}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)] ml-auto">
                          {items.length}
                        </span>
                      </div>
                      <div className="flex-grow bg-[var(--bg-secondary)] rounded-b-lg p-3 space-y-3 min-h-[300px]">
                        {items.map((item) => {
                          const priorityConfig = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.medium;
                          
                          return (
                            <div 
                              key={item.id}
                              className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-colors"
                            >
                              <h4 className="font-medium text-[var(--text-primary)] text-sm mb-2">
                                {item.title}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                <span 
                                  className="px-2 py-0.5 text-xs rounded-full capitalize"
                                  style={{ backgroundColor: `${priorityConfig.color}20`, color: priorityConfig.color }}
                                >
                                  {item.priority}
                                </span>
                                <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                  {item.domain}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        {items.length === 0 && (
                          <div className="text-center text-[var(--text-secondary)] text-sm py-8">
                            No items
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <Card className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--bg-secondary)]">
                      <th className="p-3 text-left text-sm font-medium text-[var(--text-secondary)]">Initiative</th>
                      <th className="p-3 text-left text-sm font-medium text-[var(--text-secondary)]">Phase</th>
                      <th className="p-3 text-left text-sm font-medium text-[var(--text-secondary)]">Quarter</th>
                      <th className="p-3 text-left text-sm font-medium text-[var(--text-secondary)]">Domain</th>
                      <th className="p-3 text-left text-sm font-medium text-[var(--text-secondary)]">Priority</th>
                      <th className="p-3 text-left text-sm font-medium text-[var(--text-secondary)]">Effort</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => {
                      const phaseConfig = PHASE_CONFIG[item.phase] || PHASE_CONFIG.later;
                      const priorityConfig = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.medium;
                      
                      return (
                        <tr key={item.id} className="border-t border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/50">
                          <td className="p-3">
                            <div className="font-medium text-[var(--text-primary)]">{item.title}</div>
                            <div className="text-xs text-[var(--text-secondary)] line-clamp-1">{item.description}</div>
                          </td>
                          <td className="p-3">
                            <span 
                              className="px-2 py-1 text-xs rounded-full font-medium"
                              style={{ backgroundColor: `${phaseConfig.color}20`, color: phaseConfig.color }}
                            >
                              {phaseConfig.label}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-[var(--text-secondary)]">{item.quarter || 'TBD'}</td>
                          <td className="p-3 text-sm text-[var(--text-secondary)]">{item.domain}</td>
                          <td className="p-3">
                            <span 
                              className="px-2 py-1 text-xs rounded-full capitalize"
                              style={{ backgroundColor: `${priorityConfig.color}20`, color: priorityConfig.color }}
                            >
                              {item.priority}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-[var(--text-secondary)] uppercase">{item.effort}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            )}
          </>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Map className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              No Roadmap Generated
            </h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              {points.length === 0 
                ? 'Add emergent points first, then generate the adoption roadmap.'
                : 'Click "Generate Roadmap" to create a strategic adoption timeline.'}
            </p>
            <Button variant="primary" onClick={handleGenerate} disabled={points.length === 0 || generating}>
              <Zap className="w-5 h-5 mr-2" />
              Generate Roadmap
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Roadmap;
