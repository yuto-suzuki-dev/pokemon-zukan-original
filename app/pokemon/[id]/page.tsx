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

// ポケモンのタイプについて
const pokemonTypeUrls = pokemonDetail.types.map(
  (pokemonTypeData: { type: { name: string; url: string } }) => {
    return pokemonTypeData.type.url;
  }
);

const responcePokemonTypes = pokemonTypeUrls.map(async (pokemonTypeUrl: string) => {
  const responcePokemonType = await fetch(pokemonTypeUrl);
  return await responcePokemonType.json();
});

const pokemonTypesData = await Promise.all(responcePokemonTypes);

// 日本語タイプを取得
const pokemonJaTypes = pokemonTypesData.map((pokemonTypeData) => {
  const pokemonJaType = pokemonTypeData.names.find(
    (typeData: { language: { name: string }; name: string }) => {
      return typeData.language.name === "ja";
    }
  );

  return pokemonJaType.name;
});

// 開発時、中身確認用
// console.log("ポケモンのタイプは", pokemonJaTypes);


  // 日本語名取得用のURL
  const pokemonSpeciesUrl = pokemonDetail.species.url;

  // Speciesの詳細データを取得
  const responcePokemonSpecies = await fetch(pokemonSpeciesUrl);
  const pokemonSpeciesData = await responcePokemonSpecies.json();

  // 日本語名を取得
  const pokemonJaName = pokemonSpeciesData.names.find(
    (nameData: { language: { name: string }; name: string }) => {
      return nameData.language.name === "ja";
    }
  );

  // 開発時、中身確認用
  // console.log("ポケモンの詳細データは", pokemonDetail);
  // console.log("ポケモンの画像は", pokemonImage);
  // console.log("ポケモンの日本語名は", pokemonJaName);

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

      <p>ポケモンの名前：{pokemonJaName.name}</p>

      <p>タイプ：{pokemonJaTypes.join("・")}</p>

    </>
  );
}
