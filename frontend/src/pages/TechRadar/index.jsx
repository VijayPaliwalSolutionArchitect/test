import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Target, RefreshCw, Zap, Info } from 'lucide-react';

const QUADRANTS = [
  { id: 'techniques', name: 'Techniques', color: '#3b82f6', angle: 0 },
  { id: 'tools', name: 'Tools', color: '#8b5cf6', angle: 90 },
  { id: 'platforms', name: 'Platforms', color: '#06b6d4', angle: 180 },
  { id: 'languages-frameworks', name: 'Languages & Frameworks', color: '#22c55e', angle: 270 }
];

const RINGS = [
  { id: 'adopt', name: 'Adopt', radius: 0.25, color: '#22c55e', description: 'Technologies we have high confidence in' },
  { id: 'trial', name: 'Trial', radius: 0.5, color: '#3b82f6', description: 'Worth pursuing, need to manage risk' },
  { id: 'assess', name: 'Assess', radius: 0.75, color: '#f59e0b', description: 'Worth exploring to understand impact' },
  { id: 'hold', name: 'Hold', radius: 1, color: '#ef4444', description: 'Proceed with caution' }
];

const TechRadar = () => {
  const { radarItems, fetchRadar, generateRadar, loading, points } = useAppStore();
  const [generating, setGenerating] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    fetchRadar();
  }, [fetchRadar]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateRadar();
    } catch (error) {
      console.error('Failed to generate radar:', error);
    }
    setGenerating(false);
  };

  // Group items by quadrant and ring
  const groupedItems = radarItems.reduce((acc, item) => {
    const key = `${item.quadrant}-${item.ring}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  // Calculate position for radar blip
  const getBlipPosition = (item, index, total) => {
    const quadrant = QUADRANTS.find(q => q.id === item.quadrant) || QUADRANTS[0];
    const ring = RINGS.find(r => r.id === item.ring) || RINGS[2];
    
    // Base angle for quadrant (in radians)
    const baseAngle = (quadrant.angle * Math.PI) / 180;
    
    // Spread items within quadrant (90 degrees / total items)
    const spreadAngle = (Math.PI / 2) * ((index + 0.5) / Math.max(total, 1));
    const angle = baseAngle + spreadAngle;
    
    // Radius based on ring (with some randomization for visual spread)
    const prevRingRadius = RINGS.findIndex(r => r.id === ring.id) > 0 
      ? RINGS[RINGS.findIndex(r => r.id === ring.id) - 1].radius 
      : 0;
    const radiusRange = ring.radius - prevRingRadius;
    const radius = (prevRingRadius + radiusRange * 0.3 + radiusRange * 0.4 * ((index % 3) / 2)) * 45;
    
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle)
    };
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2" data-testid="radar-title">
            Tech Radar
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Visual representation of technology adoption recommendations
          </p>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-4">
          <Button 
            variant="primary" 
            onClick={handleGenerate}
            disabled={generating || loading || points.length === 0}
            data-testid="generate-radar-btn"
          >
            {generating ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Zap className="w-5 h-5 mr-2" />
            )}
            {generating ? 'Generating...' : 'Generate from Points'}
          </Button>
        </div>

        {/* Legend */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {RINGS.map((ring) => (
            <div key={ring.id} className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: ring.color }}
              />
              <div>
                <div className="font-medium text-[var(--text-primary)] text-sm">{ring.name}</div>
                <div className="text-xs text-[var(--text-secondary)]">{ring.description}</div>
              </div>
            </div>
          ))}
        </div>

        {radarItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Radar Visualization */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                  {/* SVG Radar */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Rings */}
                    {RINGS.map((ring, idx) => (
                      <circle
                        key={ring.id}
                        cx="50"
                        cy="50"
                        r={ring.radius * 45}
                        fill="none"
                        stroke="var(--border-color)"
                        strokeWidth="0.3"
                        strokeDasharray={idx === RINGS.length - 1 ? "none" : "2,2"}
                      />
                    ))}
                    
                    {/* Quadrant lines */}
                    <line x1="50" y1="5" x2="50" y2="95" stroke="var(--border-color)" strokeWidth="0.3" />
                    <line x1="5" y1="50" x2="95" y2="50" stroke="var(--border-color)" strokeWidth="0.3" />
                    
                    {/* Quadrant labels */}
                    <text x="75" y="25" className="text-[3px] fill-[var(--text-secondary)]" textAnchor="middle">Techniques</text>
                    <text x="75" y="75" className="text-[3px] fill-[var(--text-secondary)]" textAnchor="middle">Tools</text>
                    <text x="25" y="75" className="text-[3px] fill-[var(--text-secondary)]" textAnchor="middle">Platforms</text>
                    <text x="25" y="25" className="text-[3px] fill-[var(--text-secondary)]" textAnchor="middle">Languages</text>
                    
                    {/* Blips */}
                    {radarItems.map((item, index) => {
                      const quadrant = QUADRANTS.find(q => q.id === item.quadrant) || QUADRANTS[0];
                      const ring = RINGS.find(r => r.id === item.ring) || RINGS[2];
                      const sameQuadrantRing = groupedItems[`${item.quadrant}-${item.ring}`] || [];
                      const itemIndex = sameQuadrantRing.indexOf(item);
                      const pos = getBlipPosition(item, itemIndex, sameQuadrantRing.length);
                      const isHovered = hoveredItem?.id === item.id;
                      const isSelected = selectedItem?.id === item.id;
                      
                      return (
                        <g key={item.id || index}>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={isHovered || isSelected ? 2.5 : 2}
                            fill={ring.color}
                            className="cursor-pointer transition-all duration-200"
                            onMouseEnter={() => setHoveredItem(item)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => setSelectedItem(item)}
                          />
                          {item.moved !== 0 && (
                            <text
                              x={pos.x}
                              y={pos.y - 3}
                              className="text-[2px] fill-[var(--text-primary)]"
                              textAnchor="middle"
                            >
                              {item.moved > 0 ? '↑' : '↓'}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                  
                  {/* Hover tooltip */}
                  {hoveredItem && (
                    <div className="absolute top-4 left-4 bg-[var(--bg-secondary)] p-3 rounded-lg shadow-lg border border-[var(--border-color)] max-w-[200px] z-10">
                      <div className="font-medium text-[var(--text-primary)] text-sm">
                        {hoveredItem.name}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] mt-1">
                        {hoveredItem.ring} • {hoveredItem.quadrant}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Target className="w-5 h-5 text-[var(--color-primary)]" />
                Radar Items ({radarItems.length})
              </h3>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {QUADRANTS.map((quadrant) => {
                  const quadrantItems = radarItems.filter(i => i.quadrant === quadrant.id);
                  if (quadrantItems.length === 0) return null;
                  
                  return (
                    <div key={quadrant.id}>
                      <div 
                        className="text-sm font-medium mb-2 flex items-center gap-2"
                        style={{ color: quadrant.color }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: quadrant.color }} />
                        {quadrant.name}
                      </div>
                      {quadrantItems.map((item) => {
                        const ring = RINGS.find(r => r.id === item.ring);
                        return (
                          <div
                            key={item.id}
                            className={`p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                              selectedItem?.id === item.id 
                                ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]' 
                                : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80'
                            } border border-[var(--border-color)]`}
                            onClick={() => setSelectedItem(item)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: ring?.color }}
                                />
                                <span className="font-medium text-[var(--text-primary)] text-sm">
                                  {item.name}
                                </span>
                              </div>
                              <span 
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: `${ring?.color}20`, color: ring?.color }}
                              >
                                {item.ring}
                              </span>
                            </div>
                            {selectedItem?.id === item.id && (
                              <p className="text-xs text-[var(--text-secondary)] mt-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Target className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              No Tech Radar Generated
            </h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              {points.length === 0 
                ? 'Add emergent points first, then generate the tech radar.'
                : 'Click "Generate from Points" to create your tech radar based on the emergent points.'}
            </p>
            <Button variant="primary" onClick={handleGenerate} disabled={points.length === 0 || generating}>
              <Zap className="w-5 h-5 mr-2" />
              Generate Tech Radar
            </Button>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-6 p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-[var(--text-primary)] mb-1">About Tech Radar</h4>
              <p className="text-sm text-[var(--text-secondary)]">
                The tech radar is inspired by ThoughtWorks' Technology Radar. It helps visualize technology adoption 
                recommendations across four quadrants (Techniques, Tools, Platforms, Languages/Frameworks) and four 
                rings (Adopt, Trial, Assess, Hold). Items are automatically positioned based on AI analysis of your 
                emergent points.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TechRadar;
