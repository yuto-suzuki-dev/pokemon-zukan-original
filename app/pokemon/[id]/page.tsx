interface DetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PokemonDetailPage({ params }: DetailPageProps) {

  // URLから図鑑番号を取得
  const { id } = await params;

  // ポケモンの詳細データを取得
  const responce = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemonDetail = await responce.json();

  // ポケモンの画像を取得
  const pokemonImage = pokemonDetail.sprites.other["official-artwork"].front_default;

  // 開発時、中身確認用
  // console.log("ポケモンの詳細データは", pokemonDetail);
  // console.log("ポケモンの画像は", pokemonImage);

  return (
    <>
      <h1>ポケモン詳細画面</h1>

      <div className="flex justify-center my-5">
        <img
          src={pokemonImage}
          alt={pokemonDetail.name}
          className="w-80 h-80"
        />
      </div>

      <p>図鑑番号：{id}</p>

      <p>英語名：{pokemonDetail.name}</p>
    </>
  );
}
