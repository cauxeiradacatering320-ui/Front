'use client';

import { useAuthStore } from '@/store/authStore';
import { useDashboard } from '@/hooks/useDashboard';
import { formatPriceMask } from '@/utils/format';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  type PieLabelRenderProps,
} from 'recharts';

const GOLD = '#D4AF37';
const DARK_GOLD = '#B87333';
const GOLD_GRADIENT = ['#D4AF37', '#C59A2F', '#B8860B', '#A67C00', '#8B6914', '#D4AF37', '#E8C84A', '#F0D060'];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0a0a0a] border border-red-900/30 rounded-xl p-6">
        <p className="text-red-400">Erro ao carregar dados do dashboard.</p>
      </div>
    );
  }

  const vendasChartData = data?.vendasPorModulo.map((v) => ({
    nome: v.titulo.length > 20 ? v.titulo.slice(0, 20) + '...' : v.titulo,
    vendas: v.total_vendas,
    faturamento: v.faturamento / 100,
  })) || [];

  const pieData = data?.vendasPorModulo.map((v) => ({
    name: v.titulo.length > 18 ? v.titulo.slice(0, 18) + '...' : v.titulo,
    value: v.total_vendas,
  })) || [];

  const topCurso = data?.cursoMaisVendido;

  const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-[#111] border border-[#D4AF37]/20 rounded-xl px-4 py-3 shadow-xl shadow-black/50">
        <p className="text-neutral-400 text-xs mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {formatter ? formatter(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Admin Dashboard
        </h1>
        <p className="text-neutral-400 mt-1">
          Bem-vindo, <strong className="text-[#D4AF37]">{user?.nome}</strong>.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Cursos"
          value={data?.totalCursos ?? 0}
          subtitle="cursos publicados"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          }
        />
        <StatCard
          title="Curso Mais Vendido"
          value={topCurso?.titulo || 'Nenhum'}
          subtitle={topCurso ? `${topCurso.total_vendas} vendas` : 'sem vendas'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          }
        />
        <StatCard
          title="Faturamento Total"
          value={`${formatPriceMask(String(data?.faturamentoTotal ?? 0))} KZ`}
          subtitle="vendas aprovadas"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          }
        />
        <StatCard
          title="Total de Alunos"
          value={data?.totalAlunos ?? 0}
          subtitle="com acesso ativo"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Módulo - Bar Chart */}
        <div className="bg-[#0a0a0a] border border-[#D4AF37]/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#D4AF37] rounded-full" />
            Vendas por Módulo
          </h3>
          {vendasChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={vendasChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="nome" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#1a1a1a' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#1a1a1a' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="vendas"
                  fill="url(#goldBar)"
                  radius={[6, 6, 0, 0]}
                  name="Vendas"
                  maxBarSize={60}
                />
                <defs>
                  <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={DARK_GOLD} />
                    <stop offset="100%" stopColor={GOLD} />
                  </linearGradient>
                  <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <p className="text-sm">Nenhuma venda registrada</p>
            </div>
          )}
        </div>

        {/* Distribuição de Vendas - Pie Chart */}
        <div className="bg-[#0a0a0a] border border-[#D4AF37]/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#B87333] rounded-full" />
            Distribuição de Vendas
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  dataKey="value"
                  paddingAngle={3}
                  stroke="#0a0a0a"
                  strokeWidth={2}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={GOLD_GRADIENT[index % GOLD_GRADIENT.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-sm text-neutral-400">{value}</span>
                  )}
                  wrapperStyle={{ paddingTop: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7z" />
              </svg>
              <p className="text-sm">Nenhuma venda registrada</p>
            </div>
          )}
        </div>
      </div>

      {/* Faturamento por Módulo - Area Chart */}
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-gradient-to-b from-[#D4AF37] to-[#B87333] rounded-full" />
          Faturamento por Módulo (KZ)
        </h3>
        {vendasChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={vendasChartData}>
              <defs>
                <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={DARK_GOLD} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="nome" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#1a1a1a' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#1a1a1a' }} />
              <Tooltip
                content={<CustomTooltip formatter={(v: number) => `${v.toLocaleString('pt-PT')} KZ`} />}
              />
              <Area
                type="monotone"
                dataKey="faturamento"
                stroke={GOLD}
                strokeWidth={2}
                fill="url(#goldAreaGrad)"
                name="Faturamento"
                dot={{ fill: GOLD, stroke: '#0a0a0a', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: DARK_GOLD, stroke: '#0a0a0a', strokeWidth: 2, r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Nenhum faturamento registrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#0a0a0a] border border-[#D4AF37]/10 rounded-2xl p-5 hover:border-[#D4AF37]/25 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{title}</p>
        <div className="text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white break-words">{value}</p>
      <p className="text-xs mt-1 text-neutral-500">{subtitle}</p>
    </div>
  );
}
