'use client';

import Link from 'next/link';
import { useModulosAdmin } from '@/hooks/useModulos';
import { formatKz } from '@/utils/format';
import React, { useEffect, useState } from 'react';
import { Modulo } from '@/types';

export default function AdminModulos() {
  const { data: modulos, isLoading, error } = useModulosAdmin();
  const [status,setSatus] = useState("todos")
  const moduloFiltred = modulos?.filter((modulo) => status === "todos" ? modulos : modulo.status === status)
  

  const mudarSatus =(e: React.ChangeEvent<HTMLSelectElement>)=>{
    setSatus(e.target.value)
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Módulos</h2>
        <Link
          href="/admin/modulos/novo"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
        >
          Criar Módulo
        </Link>
      </div>

      {isLoading && <p className="text-gray-500">Carregando...</p>}

      {error && (
        <p className="text-red-500">Erro ao carregar módulos: {error.message}</p>
      )}

      {modulos && modulos.length === 0 && (
        <p className="text-gray-500">Nenhum módulo encontrado.</p>
      )}


       {modulos && modulos.length > 0 && (
      <select onChange={mudarSatus}>
        <option value="todos">Todos</option>
        <option value="publicado">Publicado</option>
        <option value="rascunho">Rascunho</option>
        <option value="arquivado">Arquivados</option>
      </select>)}

      {modulos && modulos.length > 0 && (
        <div className="grid gap-4">
          {moduloFiltred!.map((modulo) => (
            <Link
              key={modulo.id}
              href={`/admin/modulos/${modulo.id}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {modulo.thumbnail_url && (
                  <img
                    src={modulo.thumbnail_url}
                    alt={modulo.titulo}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{modulo.titulo}</h3>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {modulo.descricao || 'Sem descrição'}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      modulo.status === 'publicado'
                        ? 'bg-green-100 text-green-700'
                        : modulo.status === 'rascunho'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {modulo.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {modulo.gratuito ? 'Grátis' : formatKz(modulo.preco_centavos)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
