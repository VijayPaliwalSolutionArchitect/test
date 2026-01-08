import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { 
  Lightbulb, 
  Target, 
  Boxes, 
  AlertTriangle, 
  TrendingUp,
  Map,
  Zap,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

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

const MATURITY_COLORS = {
  'emerging': '#22c55e',
  'scaling': '#f59e0b',
  'mainstream': '#3b82f6',
  'unknown': '#94a3b8'
};

const Dashboard = () => {
  const { stats, fetchStats, generateAll, loading, points, fetchPoints } = useAppStore();
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchPoints();
  }, [fetchStats, fetchPoints]);

  const handleGenerateAll = async () => {
    setGenerating(true);
    try {
      await generateAll();
    } catch (error) {
      console.error('Generation failed:', error);
    }
    setGenerating(false);
  };

  const domainData = stats?.domain_distribution 
    ? Object.entries(stats.domain_distribution).map(([name, value]) => ({
        name,
        value,
        fill: DOMAIN_COLORS[name] || DOMAIN_COLORS.unknown
      }))
    : [];

  const maturityData = stats?.maturity_distribution
    ? Object.entries(stats.maturity_distribution).map(([name, value]) => ({
        name,
        value,
        fill: MATURITY_COLORS[name] || MATURITY_COLORS.unknown
      }))
    : [];

  const statCards = [
    { label: 'Emergent Points', value: stats?.total_points || 0, icon: Lightbulb, color: 'var(--color-primary)', link: '/points' },
    { label: 'Radar Items', value: stats?.radar_items || 0, icon: Target, color: '#8b5cf6', link: '/radar' },
    { label: 'Architectures', value: stats?.architectures || 0, icon: Boxes, color: '#06b6d4', link: '/architectures' },
    { label: 'Risks', value: stats?.risks || 0, icon: AlertTriangle, color: '#ef4444', link: '/risks' },
    { label: 'Opportunities', value: stats?.opportunities || 0, icon: TrendingUp, color: '#22c55e', link: '/risks' },
    { label: 'Roadmap Items', value: stats?.roadmap_items || 0, icon: Map, color: '#f59e0b', link: '/roadmap' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2" data-testid="dashboard-title">
            Tech Intelligence Dashboard
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            AI-powered technology sense-making platform
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link to="/points">
            <Button variant="primary" size="lg" data-testid="add-points-btn">
              <Lightbulb className="w-5 h-5 mr-2" />
              Add Emergent Points
            </Button>
          </Link>
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={handleGenerateAll}
            disabled={generating || loading || (stats?.total_points === 0)}
            data-testid="generate-all-btn"
          >
            {generating ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Zap className="w-5 h-5 mr-2" />
            )}
            {generating ? 'Generating...' : 'Generate All Outputs'}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} to={stat.link}>
                <Card 
                  className="text-center hover:border-[var(--color-primary)] transition-all cursor-pointer"
                  data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div 
                    className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {stat.label}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Charts Row */}
        {(domainData.length > 0 || maturityData.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Domain Distribution */}
            {domainData.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="w-5 h-5 text-[var(--color-primary)]" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Domain Distribution
                  </h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={domainData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {domainData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Maturity Distribution */}
            {maturityData.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-[var(--color-secondary)]" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Maturity Distribution
                  </h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={maturityData} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {maturityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Recent Points */}
        {points.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Recent Emergent Points
              </h3>
              <Link to="/points" className="text-[var(--color-primary)] hover:underline text-sm">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {points.slice(0, 5).map((point) => (
                <div 
                  key={point.id} 
                  className="flex items-start gap-4 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]"
                >
                  <div 
                    className="w-2 h-2 mt-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: DOMAIN_COLORS[point.domain] || DOMAIN_COLORS.unknown }}
                  />
                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium text-[var(--text-primary)] truncate">
                      {point.title}
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-1">
                      {point.analysis || point.description}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <span 
                      className="px-2 py-1 text-xs rounded-full"
                      style={{ 
                        backgroundColor: `${DOMAIN_COLORS[point.domain] || DOMAIN_COLORS.unknown}20`,
                        color: DOMAIN_COLORS[point.domain] || DOMAIN_COLORS.unknown
                      }}
                    >
                      {point.domain || 'unknown'}
                    </span>
                    <span 
                      className="px-2 py-1 text-xs rounded-full"
                      style={{ 
                        backgroundColor: `${MATURITY_COLORS[point.maturity] || MATURITY_COLORS.unknown}20`,
                        color: MATURITY_COLORS[point.maturity] || MATURITY_COLORS.unknown
                      }}
                    >
                      {point.maturity || 'unknown'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Empty State */}
        {stats?.total_points === 0 && (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Lightbulb className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              No Emergent Points Yet
            </h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              Start by adding technology signals, trends, risks, or ideas. The AI will automatically classify and analyze them.
            </p>
            <Link to="/points">
              <Button variant="primary" size="lg">
                <Lightbulb className="w-5 h-5 mr-2" />
                Add Your First Points
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
