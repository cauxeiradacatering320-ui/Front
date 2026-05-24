'use client';

import { useAuthStore } from '@/store/authStore';
import { useDashboard } from '@/hooks/useDashboard';
import { formatKz } from '@/utils/format';
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
  type PieLabelRenderProps,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <p className="text-gray-500">Carregando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <p className="text-red-600">Erro ao carregar dados do dashboard.</p>
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">
          Bem-vindo ao painel administrativo, <strong>{user?.nome}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Cursos"
          value={data?.totalCursos ?? 0}
          subtitle="cursos publicados"
          color="indigo"
        />
        <StatCard
          title="Curso Mais Vendido"
          value={data?.cursoMaisVendido?.titulo || 'Nenhum'}
          subtitle={`${data?.cursoMaisVendido?.total_vendas ?? 0} vendas`}
          color="green"
        />
        <StatCard
          title="Faturamento Total"
          value={formatKz(data?.faturamentoTotal ?? 0)}
          subtitle="vendas aprovadas"
          color="amber"
        />
        <StatCard
          title="Total de Alunos"
          value={data?.totalAlunos ?? 0}
          subtitle="com acesso ativo"
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendas por Módulo</h3>
          {vendasChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={vendasChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="nome" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="vendas" fill="#6366f1" radius={[4, 4, 0, 0]} name="Vendas" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-16">Nenhuma venda registrada</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição de Vendas</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }: PieLabelRenderProps) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-sm text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-16">Nenhuma venda registrada</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Faturamento por Módulo (KZ)</h3>
        {vendasChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={vendasChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="nome" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                formatter={(value: unknown) => [`${Number(value).toLocaleString('pt-PT')} KZ`, 'Faturamento']}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="faturamento" fill="#10b981" radius={[4, 4, 0, 0]} name="Faturamento" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-16">Nenhum faturamento registrado</p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  color: 'indigo' | 'green' | 'amber' | 'blue';
}) {
  const colorMap = {
    indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    green: 'bg-green-50 border-green-100 text-green-700',
    amber: 'bg-amber-50 border-amber-100 text-amber-700',
    blue: 'bg-blue-50 border-blue-100 text-blue-700',
  };

  return (
    <div className={`p-5 rounded-xl border ${colorMap[color]}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-2xl font-bold mt-1 break-words">{value}</p>
      <p className="text-xs mt-1 opacity-70">{subtitle}</p>
    </div>
  );
}
