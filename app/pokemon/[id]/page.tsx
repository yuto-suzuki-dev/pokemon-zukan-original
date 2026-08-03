interface DetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PokemonDetailPage({ params }: DetailPageProps) {

  const { id } = await params;

  return (
    <>
      <h1>ポケモン詳細画面</h1>

      <p>図鑑番号：{id}</p>
    </>
  );
}
