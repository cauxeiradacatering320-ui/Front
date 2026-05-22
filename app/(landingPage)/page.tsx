export default function LandingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo à Plataforma EAD
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Aprenda no seu ritmo com cursos de qualidade.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Módulo {i}</h3>
            <p className="text-sm text-gray-500">Descrição do módulo em breve.</p>
          </div>
        ))}
      </section>
    </div>
  );
}
