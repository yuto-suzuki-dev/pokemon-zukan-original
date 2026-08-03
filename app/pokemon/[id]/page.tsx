import Link from "next/link";

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
  const pokemonImage =
    pokemonDetail.sprites.other["official-artwork"].front_default;

  // ポケモンのタイプについて
  const pokemonTypeUrls = pokemonDetail.types.map(
    (pokemonTypeData: { type: { name: string; url: string } }) => {
      return pokemonTypeData.type.url;
    }
  );

  const responcePokemonTypes = pokemonTypeUrls.map(
    async (pokemonTypeUrl: string) => {
      const responcePokemonType = await fetch(pokemonTypeUrl);
      return await responcePokemonType.json();
    }
  );

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

  // ポケモンのステータスを取得
  const pokemonStatus = pokemonDetail.stats.map(
    (pokemonStatusData: {
      base_stat: number;
      stat: { name: string };
    }) => {
      return {
        statusName: pokemonStatusData.stat.name,
        statusValue: pokemonStatusData.base_stat,
      };
    }
  );

  // 開発時、中身確認用
  // console.log("ポケモンのステータスは", pokemonStatus);

  // ポケモンの特性を取得
  const pokemonAbilities = pokemonDetail.abilities.map(
    (pokemonAbilityData: {
      ability: { name: string; url: string };
    }) => {
      return pokemonAbilityData.ability.url;
    }
  );

  const responcePokemonAbilities = pokemonAbilities.map(
    async (pokemonAbilityUrl: string) => {
      const responcePokemonAbility = await fetch(pokemonAbilityUrl);
      return await responcePokemonAbility.json();
    }
  );

  const pokemonAbilitiesData = await Promise.all(
    responcePokemonAbilities
  );

  // 日本語の特性名を取得
  const pokemonJaAbilities = pokemonAbilitiesData.map(
    (pokemonAbilityData) => {
      const pokemonJaAbility = pokemonAbilityData.names.find(
        (abilityData: {
          language: { name: string };
          name: string;
        }) => {
          return abilityData.language.name === "ja";
        }
      );

      return pokemonJaAbility.name;
    }
  );

  // 開発時、中身確認用
  // console.log("ポケモンの特性は", pokemonJaAbilities);

  // 日本語名取得用のURL
  const pokemonSpeciesUrl = pokemonDetail.species.url;

  // Speciesの詳細データを取得
  const responcePokemonSpecies = await fetch(pokemonSpeciesUrl);
  const pokemonSpeciesData = await responcePokemonSpecies.json();

  // ポケモンの説明文を取得
  const pokemonDescriptionData =
    pokemonSpeciesData.flavor_text_entries.find(
      (flavorTextData: {
        language: { name: string };
        flavor_text: string;
      }) => {
        return flavorTextData.language.name === "ja";
      }
    );

  const pokemonDescription = pokemonDescriptionData.flavor_text
    .replace(/\n/g, " ")
    .replace(/\f/g, " ");

  // 開発時、中身確認用
  // console.log("ポケモンの説明文は", pokemonDescription);

  // 進化チェーンのURLを取得
  const evolutionChainUrl = pokemonSpeciesData.evolution_chain.url;

  // 進化チェーンのデータを取得
  const responceEvolutionChain = await fetch(evolutionChainUrl);
  const evolutionChainData = await responceEvolutionChain.json();

  // 開発時、中身確認用
  // console.log("進化チェーンのデータは", evolutionChainData);

  // 進化するポケモンを取得
  const evolutionPokemons = [];

  let evolutionData = evolutionChainData.chain;

  while (evolutionData) {
    evolutionPokemons.push(evolutionData.species.name);

    if (evolutionData.evolves_to.length === 0) {
      break;
    }

    evolutionData = evolutionData.evolves_to[0];
  }

  // console.log("進化ポケモンは", evolutionPokemons);

  // 進化ポケモンを日本語名に変換
  const evolutionJaNames = await Promise.all(
    evolutionPokemons.map(async (pokemonName: string) => {
      const responceSpecies = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
      );

      const speciesData = await responceSpecies.json();

      const jaName = speciesData.names.find(
        (nameData: {
          language: { name: string };
          name: string;
        }) => {
          return nameData.language.name === "ja";
        }
      );

      return jaName.name;
    })
  );

  // console.log("進化ポケモン日本語名", evolutionJaNames);

  // 日本語名を取得
  const pokemonJaName = pokemonSpeciesData.names.find(
    (nameData: {
      language: { name: string };
      name: string;
    }) => {
      return nameData.language.name === "ja";
    }
  );

  // 開発時、中身確認用
  // console.log("ポケモンの詳細データは", pokemonDetail);
  // console.log("ポケモンの画像は", pokemonImage);
  // console.log("ポケモンの日本語名は", pokemonJaName);

  // 前後のポケモンの図鑑番号を取得
  const pokemonNumber = Number(id);
  const previousPokemonNumber = pokemonNumber - 1;
  const nextPokemonNumber = pokemonNumber + 1;

  // 前のポケモンの日本語名を取得
  let previousPokemonJaName = "";

  if (pokemonNumber > 1) {
    const responcePreviousPokemonSpecies = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${previousPokemonNumber}`
    );

    const previousPokemonSpeciesData =
      await responcePreviousPokemonSpecies.json();

    const previousPokemonNameData =
      previousPokemonSpeciesData.names.find(
        (nameData: {
          language: { name: string };
          name: string;
        }) => {
          return nameData.language.name === "ja";
        }
      );

    previousPokemonJaName = previousPokemonNameData.name;
  }

  // 次のポケモンの日本語名を取得
  const responceNextPokemonSpecies = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${nextPokemonNumber}`
  );

  const nextPokemonSpeciesData =
    await responceNextPokemonSpecies.json();

  const nextPokemonNameData = nextPokemonSpeciesData.names.find(
    (nameData: {
      language: { name: string };
      name: string;
    }) => {
      return nameData.language.name === "ja";
    }
  );

  const nextPokemonJaName = nextPokemonNameData.name;

  // 開発時、中身確認用
  // console.log("前のポケモンは", previousPokemonJaName);
  // console.log("次のポケモンは", nextPokemonJaName);

  return (
    <main className="min-h-screen bg-gray-50 px-4 pt-4 pb-6">

      {/* 戻るボタン・前後のポケモン・名前と図鑑番号 */}
      <div className="relative w-full max-w-6xl mx-auto mb-4 min-h-17.5">

        {/* 一覧画面へ戻る */}
        <div className="absolute left-0 top-0">
          <Link
            href="/"
            className="border rounded-full px-5 py-2 bg-white hover:bg-gray-100"
          >
            戻る
          </Link>
        </div>

        {/* 前のポケモンへ移動 */}
        <div className="absolute left-28 top-0 text-center">
          {pokemonNumber > 1 && (
            <Link
              href={`/pokemon/${previousPokemonNumber}`}
              className="hover:underline"
            >
              <p>
                ← {previousPokemonJaName}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                #{String(previousPokemonNumber).padStart(4, "0")}
              </p>
            </Link>
          )}
        </div>

        {/* ポケモンの名前と図鑑番号 */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 text-center">
          <h1 className="text-3xl font-bold">
            {pokemonJaName.name}
          </h1>

          <p className="text-gray-600 mt-1">
            #{String(pokemonNumber).padStart(4, "0")}
          </p>
        </div>

        {/* 次のポケモンへ移動 */}
        <div className="absolute right-0 top-0 text-center">
          <Link
            href={`/pokemon/${nextPokemonNumber}`}
            className="hover:underline"
          >
            <p>
              {nextPokemonJaName} →
            </p>

            <p className="text-sm text-gray-600 mt-1">
              #{String(nextPokemonNumber).padStart(4, "0")}
            </p>
          </Link>
        </div>

      </div>

      {/* ポケモンの詳細情報全体 */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">

        {/* 左側：画像とステータス */}
        <div className="border rounded bg-white p-5 shadow-sm">

          {/* ポケモンの画像 */}
          <div className="h-72 flex justify-center items-center mb-5">
            <img
              src={pokemonImage}
              alt={pokemonDetail.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* ポケモンのステータス */}
          <div className="grid grid-cols-3 gap-3">

            <div className="text-center">
              <p className="font-bold">HP</p>
              <p>{pokemonStatus[0].statusValue}</p>
            </div>

            <div className="text-center">
              <p className="font-bold">こうげき</p>
              <p>{pokemonStatus[1].statusValue}</p>
            </div>

            <div className="text-center">
              <p className="font-bold">ぼうぎょ</p>
              <p>{pokemonStatus[2].statusValue}</p>
            </div>

            <div className="text-center">
              <p className="font-bold">とくこう</p>
              <p>{pokemonStatus[3].statusValue}</p>
            </div>

            <div className="text-center">
              <p className="font-bold">とくぼう</p>
              <p>{pokemonStatus[4].statusValue}</p>
            </div>

            <div className="text-center">
              <p className="font-bold">すばやさ</p>
              <p>{pokemonStatus[5].statusValue}</p>
            </div>

          </div>
        </div>

        {/* 右側：タイプ・特性・説明文 */}
        <div className="border rounded bg-white p-6 shadow-sm">

          {/* ポケモンのタイプ */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3">
              タイプ
            </h2>

            <div className="flex gap-3">
              {pokemonJaTypes.map((pokemonType: string) => {
                return (
                  <span
                    key={pokemonType}
                    className="border rounded px-5 py-2 bg-gray-50"
                  >
                    {pokemonType}
                  </span>
                );
              })}
            </div>
          </div>

          {/* ポケモンの特性 */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3">
              特性
            </h2>

            <p className="border rounded px-4 py-3 bg-gray-50">
              {pokemonJaAbilities.join("・")}
            </p>
          </div>

          {/* ポケモンの説明文 */}
          <div>
            <h2 className="font-bold text-lg mb-3">
              ポケモンの説明
            </h2>

            <p className="border rounded px-4 py-3 bg-gray-50 leading-6">
              {pokemonDescription}
            </p>
          </div>

        </div>
      </div>

      {/* ポケモンの進化 */}
      <div className="w-full max-w-5xl mx-auto mt-6 border rounded bg-white p-6 shadow-sm">

        <h2 className="font-bold text-xl text-center mb-4">
          進化
        </h2>

        <p className="text-center text-lg">
          {evolutionJaNames.join(" → ")}
        </p>

      </div>

    </main>
  );
}
