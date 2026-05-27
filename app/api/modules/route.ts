import { NextResponse } from "next/server";

export async function GET() {
  const modules = [
    { id: 1, title: "Nacional & Internacional", subtitle: "Gastronomia", desc: "A base culinária global" },
    { id: 2, title: "Pastelaria & Sobremesas", subtitle: "Doçaria fina", desc: "A arte do açúcar" },
    { id: 3, title: "Salgados & Snacks", subtitle: "Cozinha prática", desc: "Perfeição em pequenas porções" },
    { id: 4, title: "Petiscos & Finger Food", subtitle: "Eventos", desc: "Sofisticação em cada mordida" },
    { id: 5, title: "Cocktails & Mocktails", subtitle: "Mixologia", desc: "O equilíbrio dos sabores" },
    { id: 6, title: "Entradas & Mesa Posta", subtitle: "Etiqueta", desc: "A primeira impressão inesquecível" },
    { id: 7, title: "Cortes de Carnes Nobres", subtitle: "Churrasco", desc: "O segredo dos grandes mestres" },
  ];

  return NextResponse.json({ modules });
}
