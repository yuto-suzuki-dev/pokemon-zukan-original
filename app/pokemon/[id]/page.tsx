import Link from "next/link";

// ############################################
// URLからポケモンの図鑑番号を受け取るための型
// ############################################
interface DetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// API内にある名前とURLの型
interface NamedApiResource {
  name: string;
  url: string;
}

// 日本語名などのデータ型
interface PokemonNameData {
  language: {
    name: string;
  };
  name: string;
}

// ポケモンの分類データ型
interface PokemonCategoryData {
  language: {
    name: string;
  };
  genus: string;
}

// ポケモンの説明文データ型
interface PokemonFlavorTextData {
  language: {
    name: string;
  };
  flavor_text: string;
}

// ポケモンのタイプデータ型
interface PokemonTypeData {
  type: NamedApiResource;
}

// ポケモンのステータスデータ型
interface PokemonStatData {
  base_stat: number;
  stat: NamedApiResource;
}

// ポケモンの特性データ型
interface PokemonAbilityData {
  ability: NamedApiResource;
}

// ポケモンが登録されている図鑑のデータ型
interface PokemonPokedexNumberData {
  entry_number: number;
  pokedex: NamedApiResource;
}

// 図鑑の詳細データ型
interface PokedexData {
  region: NamedApiResource | null;
}

// 進化情報のデータ型
interface EvolutionChainData {
  species: NamedApiResource;
  evolves_to: EvolutionChainData[];
}

// 進化カードで使用するデータ型
interface EvolutionPokemonData {
  id: number;
  name: string;
  image: string | null;
  types: string[];
}

// 地方名を日本語へ変換する
const regionJapaneseNames: Record<string, string> = {
  kanto: "カントー地方",
  johto: "ジョウト地方",
  hoenn: "ホウエン地方",
  sinnoh: "シンオウ地方",
  unova: "イッシュ地方",
  kalos: "カロス地方",
  alola: "アローラ地方",
  galar: "ガラル地方",
  hisui: "ヒスイ地方",
  paldea: "パルデア地方",
};

// 地方の表示順
const regionDisplayOrder: Record<string, number> = {
  kanto: 1,
  johto: 2,
  hoenn: 3,
  sinnoh: 4,
  unova: 5,
  kalos: 6,
  alola: 7,
  galar: 8,
  hisui: 9,
  paldea: 10,
};

// タイプごとのアイコンと色
const pokemonTypeDesign: {
  [key: string]: {
    icon: string;
    className: string;
  };
} = {
  ノーマル: {
    icon: "○",
    className:
      "bg-stone-100 border-stone-300 text-stone-700",
  },
  ほのお: {
    icon: "🔥",
    className:
      "bg-orange-100 border-orange-300 text-orange-700",
  },
  みず: {
    icon: "💧",
    className:
      "bg-blue-100 border-blue-300 text-blue-700",
  },
  でんき: {
    icon: "⚡",
    className:
      "bg-yellow-100 border-yellow-300 text-yellow-700",
  },
  くさ: {
    icon: "🌿",
    className:
      "bg-green-100 border-green-300 text-green-700",
  },
  こおり: {
    icon: "❄️",
    className:
      "bg-cyan-100 border-cyan-300 text-cyan-700",
  },
  かくとう: {
    icon: "✊",
    className:
      "bg-red-100 border-red-300 text-red-700",
  },
  どく: {
    icon: "☠️",
    className:
      "bg-purple-100 border-purple-300 text-purple-700",
  },
  じめん: {
    icon: "⛰️",
    className:
      "bg-amber-100 border-amber-300 text-amber-700",
  },
  ひこう: {
    icon: "🪽",
    className:
      "bg-sky-100 border-sky-300 text-sky-700",
  },
  エスパー: {
    icon: "🔮",
    className:
      "bg-pink-100 border-pink-300 text-pink-700",
  },
  むし: {
    icon: "🐛",
    className:
      "bg-lime-100 border-lime-300 text-lime-700",
  },
  いわ: {
    icon: "🪨",
    className:
      "bg-yellow-100 border-yellow-400 text-yellow-800",
  },
  ゴースト: {
    icon: "👻",
    className:
      "bg-indigo-100 border-indigo-300 text-indigo-700",
  },
  ドラゴン: {
    icon: "🐉",
    className:
      "bg-violet-100 border-violet-300 text-violet-700",
  },
  あく: {
    icon: "🌑",
    className:
      "bg-gray-200 border-gray-400 text-gray-800",
  },
  はがね: {
    icon: "⚙️",
    className:
      "bg-slate-100 border-slate-300 text-slate-700",
  },
  フェアリー: {
    icon: "✨",
    className:
      "bg-rose-100 border-rose-300 text-rose-700",
  },
};

// ###########################################################
// ポケモン詳細ページ
// ###########################################################
export default async function PokemonDetailPage({
  params,
}: DetailPageProps) {
  // URLからポケモンの図鑑番号を取得
  const pokemonParams = await params;
  const pokemonNumber = Number(pokemonParams.id);

  // この図鑑で表示するポケモンの最大数
  const totalPokemonCount = 1025;

  // ###########################################################
  // ポケモンの基本情報を取得
  // ###########################################################

  const pokemonResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`
  );

  const pokemonDetail = await pokemonResponse.json();

  // 開発時、中身確認用
  // console.log("ポケモンの詳細データは", pokemonDetail);

  // ポケモンの画像を取得
  const pokemonImage =
    pokemonDetail.sprites.other["official-artwork"]
      .front_default ??
    pokemonDetail.sprites.front_default ??
    null;

  // 高さはAPI内では10分の1メートル単位
  const pokemonHeight = pokemonDetail.height / 10;

  // 重さはAPI内では10分の1キログラム単位
  const pokemonWeight = pokemonDetail.weight / 10;

  // ###########################################################
  // ポケモンのタイプを日本語で取得
  // ###########################################################

  const pokemonTypeUrls = pokemonDetail.types.map(
    (pokemonTypeData: PokemonTypeData) => {
      return pokemonTypeData.type.url;
    }
  );

  const pokemonTypeResponses = pokemonTypeUrls.map(
    async (pokemonTypeUrl: string) => {
      const pokemonTypeResponse = await fetch(
        pokemonTypeUrl
      );

      return await pokemonTypeResponse.json();
    }
  );

  const pokemonTypeResults = await Promise.all(
    pokemonTypeResponses
  );

  const pokemonJaTypes = pokemonTypeResults.map(
    (pokemonTypeResult, index) => {
      // 日本語のタイプ名を探す
      const pokemonJaTypeName =
        pokemonTypeResult.names.find(
          (typeNameData: PokemonNameData) => {
            return typeNameData.language.name === "ja";
          }
        );

      // 日本語名がない場合は英語名を探す
      const pokemonEnTypeName =
        pokemonTypeResult.names.find(
          (typeNameData: PokemonNameData) => {
            return typeNameData.language.name === "en";
          }
        );

      return (
        pokemonJaTypeName?.name ??
        pokemonEnTypeName?.name ??
        pokemonDetail.types[index].type.name
      );
    }
  );

  // ###########################################################
  // ポケモンのステータスを取得
  // ###########################################################

  const getPokemonStat = (statName: string) => {
    const pokemonStat = pokemonDetail.stats.find(
      (pokemonStatData: PokemonStatData) => {
        return pokemonStatData.stat.name === statName;
      }
    );

    return pokemonStat?.base_stat ?? 0;
  };

  const pokemonHp = getPokemonStat("hp");
  const pokemonAttack = getPokemonStat("attack");
  const pokemonDefense = getPokemonStat("defense");

  const pokemonSpecialAttack = getPokemonStat(
    "special-attack"
  );

  const pokemonSpecialDefense = getPokemonStat(
    "special-defense"
  );

  const pokemonSpeed = getPokemonStat("speed");

  // ###########################################################
  // ポケモンの特性を日本語で取得
  // ###########################################################

  const pokemonAbilityUrls = pokemonDetail.abilities.map(
    (pokemonAbilityData: PokemonAbilityData) => {
      return pokemonAbilityData.ability.url;
    }
  );

  const pokemonAbilityResponses =
    pokemonAbilityUrls.map(
      async (pokemonAbilityUrl: string) => {
        const pokemonAbilityResponse = await fetch(
          pokemonAbilityUrl
        );

        return await pokemonAbilityResponse.json();
      }
    );

  const pokemonAbilityResults = await Promise.all(
    pokemonAbilityResponses
  );

  const pokemonJaAbilities =
    pokemonAbilityResults.map(
      (pokemonAbilityResult, index) => {
        // 日本語の特性名を探す
        const pokemonJaAbilityName =
          pokemonAbilityResult.names.find(
            (abilityNameData: PokemonNameData) => {
              return (
                abilityNameData.language.name === "ja"
              );
            }
          );

        // 日本語名がない場合は英語名を探す
        const pokemonEnAbilityName =
          pokemonAbilityResult.names.find(
            (abilityNameData: PokemonNameData) => {
              return (
                abilityNameData.language.name === "en"
              );
            }
          );

        return (
          pokemonJaAbilityName?.name ??
          pokemonEnAbilityName?.name ??
          pokemonDetail.abilities[index].ability.name
        );
      }
    );

  const pokemonAbilitiesText =
    pokemonJaAbilities.join("・");

  // ###########################################################
  // speciesから日本語名・分類・説明文などを取得
  // ###########################################################

  const pokemonSpeciesResponse = await fetch(
    pokemonDetail.species.url
  );

  const pokemonSpeciesData =
    await pokemonSpeciesResponse.json();

  // ###########################################################
  // ポケモンの日本語名を取得
  // ###########################################################

  const pokemonJaNameData =
    pokemonSpeciesData.names?.find(
      (pokemonNameData: PokemonNameData) => {
        return pokemonNameData.language.name === "ja";
      }
    );

  const pokemonEnNameData =
    pokemonSpeciesData.names?.find(
      (pokemonNameData: PokemonNameData) => {
        return pokemonNameData.language.name === "en";
      }
    );

  const pokemonJaName =
    pokemonJaNameData?.name ??
    pokemonEnNameData?.name ??
    pokemonDetail.name;

  // ###########################################################
  // ポケモンの分類を取得
  // ###########################################################

  const pokemonJaCategoryData =
    pokemonSpeciesData.genera?.find(
      (categoryData: PokemonCategoryData) => {
        return categoryData.language.name === "ja";
      }
    );

  const pokemonEnCategoryData =
    pokemonSpeciesData.genera?.find(
      (categoryData: PokemonCategoryData) => {
        return categoryData.language.name === "en";
      }
    );

  const pokemonCategory =
    pokemonJaCategoryData?.genus ??
    pokemonEnCategoryData?.genus ??
    "分類未取得";

  // ###########################################################
  // ポケモンの説明文を日本語で取得
  // ###########################################################

  const pokemonDescriptionData =
    pokemonSpeciesData.flavor_text_entries?.find(
      (
        flavorTextData: PokemonFlavorTextData
      ) => {
        return flavorTextData.language.name === "ja";
      }
    );

  const pokemonDescription =
    pokemonDescriptionData?.flavor_text
      ?.replace(/\n/g, " ")
      .replace(/\f/g, " ") ??
    "日本語の説明文がないため未実装";

  // ###########################################################
  // ポケモンが登録されている地方図鑑を取得
  // ###########################################################

  // 全国図鑑以外の図鑑を取り出す
  const regionalPokedexNumbers: PokemonPokedexNumberData[] =
    (
      pokemonSpeciesData.pokedex_numbers ?? []
    ).filter(
      (
        pokedexNumberData: PokemonPokedexNumberData
      ) => {
        return (
          pokedexNumberData.pokedex.name !== "national"
        );
      }
    );

  // 各図鑑の詳細データを取得する
  const regionalPokedexResponses =
    regionalPokedexNumbers.map(
      async (
        pokedexNumberData: PokemonPokedexNumberData
      ): Promise<PokedexData | null> => {
        const pokedexResponse = await fetch(
          pokedexNumberData.pokedex.url
        );

        // 1件の取得に失敗しても詳細画面全体は止めない
        if (!pokedexResponse.ok) {
          return null;
        }

        return await pokedexResponse.json();
      }
    );

  const regionalPokedexResults = await Promise.all(
    regionalPokedexResponses
  );

  // 図鑑データから地方名を取り出す
  const regionNames = regionalPokedexResults
    .map((pokedexData) => {
      return pokedexData?.region?.name ?? null;
    })
    .filter(
      (regionName): regionName is string => {
        return regionName !== null;
      }
    );

  // 同じ地方に複数の図鑑があっても重複表示しない
  const uniqueRegionNames = [
    ...new Set(regionNames),
  ].sort((firstRegion, secondRegion) => {
    return (
      (regionDisplayOrder[firstRegion] ?? 999) -
      (regionDisplayOrder[secondRegion] ?? 999)
    );
  });

  // 地方名を日本語へ変換する
  const regionalPokedexNames =
    uniqueRegionNames.map((regionName) => {
      return (
        regionJapaneseNames[regionName] ??
        regionName
      );
    });

  // ###########################################################
  // 前後のポケモンを取得
  // ###########################################################

  const previousPokemonNumber =
    pokemonNumber > 1
      ? pokemonNumber - 1
      : null;

  const nextPokemonNumber =
    pokemonNumber < totalPokemonCount
      ? pokemonNumber + 1
      : null;

  // 前のポケモンの日本語名
  let previousPokemonJaName = "";

  if (previousPokemonNumber !== null) {
    const previousPokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${previousPokemonNumber}`
    );

    const previousPokemonData =
      await previousPokemonResponse.json();

    const previousPokemonNameData =
      previousPokemonData.names?.find(
        (pokemonNameData: PokemonNameData) => {
          return (
            pokemonNameData.language.name === "ja"
          );
        }
      );

    const previousPokemonEnNameData =
      previousPokemonData.names?.find(
        (pokemonNameData: PokemonNameData) => {
          return (
            pokemonNameData.language.name === "en"
          );
        }
      );

    previousPokemonJaName =
      previousPokemonNameData?.name ??
      previousPokemonEnNameData?.name ??
      `No.${previousPokemonNumber}`;
  }

  // 次のポケモンの日本語名
  let nextPokemonJaName = "";

  if (nextPokemonNumber !== null) {
    const nextPokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${nextPokemonNumber}`
    );

    const nextPokemonData =
      await nextPokemonResponse.json();

    const nextPokemonNameData =
      nextPokemonData.names?.find(
        (pokemonNameData: PokemonNameData) => {
          return (
            pokemonNameData.language.name === "ja"
          );
        }
      );

    const nextPokemonEnNameData =
      nextPokemonData.names?.find(
        (pokemonNameData: PokemonNameData) => {
          return (
            pokemonNameData.language.name === "en"
          );
        }
      );

    nextPokemonJaName =
      nextPokemonNameData?.name ??
      nextPokemonEnNameData?.name ??
      `No.${nextPokemonNumber}`;
  }

  // ###########################################################
  // ポケモンの進化情報を取得
  // ###########################################################

  const evolutionPokemonList: NamedApiResource[] =
    [];

  // 分岐する進化先をすべて配列へ追加する
  const collectEvolutionPokemon = (
    evolutionData: EvolutionChainData
  ) => {
    // 現在のポケモンを配列へ追加
    evolutionPokemonList.push(
      evolutionData.species
    );

    // 進化先をすべて順番に確認する
    evolutionData.evolves_to.forEach(
      (nextEvolutionData) => {
        collectEvolutionPokemon(
          nextEvolutionData
        );
      }
    );
  };

  if (pokemonSpeciesData.evolution_chain?.url) {
    const evolutionChainResponse = await fetch(
      pokemonSpeciesData.evolution_chain.url
    );

    const evolutionChainData =
      await evolutionChainResponse.json();

    // 進化前から分岐先まですべて取得する
    collectEvolutionPokemon(
      evolutionChainData.chain
    );
  }

  // 開発時、中身確認用
  // console.log(
  //   "進化するポケモンは",
  //   evolutionPokemonList
  // );

  const evolutionPokemonResponses =
    evolutionPokemonList.map(
      async (
        evolutionPokemon: NamedApiResource
      ): Promise<EvolutionPokemonData> => {
        // speciesのURLから図鑑番号を取り出す
        const evolutionUrlParts =
          evolutionPokemon.url.split("/");

        const evolutionPokemonId = Number(
          evolutionUrlParts[
            evolutionUrlParts.length - 2
          ]
        );

        // 進化するポケモンの基本情報を取得
        const evolutionDetailResponse =
          await fetch(
            `https://pokeapi.co/api/v2/pokemon/${evolutionPokemonId}`
          );

        const evolutionDetail =
          await evolutionDetailResponse.json();

        // 進化するポケモンのspecies情報を取得
        const evolutionSpeciesResponse =
          await fetch(evolutionPokemon.url);

        const evolutionSpeciesData =
          await evolutionSpeciesResponse.json();

        // 日本語名を取得
        const evolutionJaNameData =
          evolutionSpeciesData.names?.find(
            (
              pokemonNameData: PokemonNameData
            ) => {
              return (
                pokemonNameData.language.name ===
                "ja"
              );
            }
          );

        // 日本語名がない場合に使用する英語名
        const evolutionEnNameData =
          evolutionSpeciesData.names?.find(
            (
              pokemonNameData: PokemonNameData
            ) => {
              return (
                pokemonNameData.language.name ===
                "en"
              );
            }
          );

        const evolutionPokemonJaName =
          evolutionJaNameData?.name ??
          evolutionEnNameData?.name ??
          evolutionPokemon.name;

        // 画像を取得
        const evolutionPokemonImage =
          evolutionDetail.sprites.other[
            "official-artwork"
          ].front_default ??
          evolutionDetail.sprites.front_default ??
          null;

        // タイプの詳細URLを取得
        const evolutionTypeUrls =
          evolutionDetail.types.map(
            (
              evolutionTypeData: PokemonTypeData
            ) => {
              return evolutionTypeData.type.url;
            }
          );

        const evolutionTypeResponses =
          evolutionTypeUrls.map(
            async (
              evolutionTypeUrl: string
            ) => {
              const evolutionTypeResponse =
                await fetch(evolutionTypeUrl);

              return await evolutionTypeResponse.json();
            }
          );

        const evolutionTypeResults =
          await Promise.all(
            evolutionTypeResponses
          );

        // タイプを日本語へ変換
        const evolutionPokemonJaTypes =
          evolutionTypeResults.map(
            (evolutionTypeResult, index) => {
              const evolutionJaTypeName =
                evolutionTypeResult.names?.find(
                  (
                    pokemonNameData: PokemonNameData
                  ) => {
                    return (
                      pokemonNameData.language
                        .name === "ja"
                    );
                  }
                );

              const evolutionEnTypeName =
                evolutionTypeResult.names?.find(
                  (
                    pokemonNameData: PokemonNameData
                  ) => {
                    return (
                      pokemonNameData.language
                        .name === "en"
                    );
                  }
                );

              return (
                evolutionJaTypeName?.name ??
                evolutionEnTypeName?.name ??
                evolutionDetail.types[index]
                  .type.name
              );
            }
          );

        return {
          id: evolutionPokemonId,
          name: evolutionPokemonJaName,
          image: evolutionPokemonImage,
          types: evolutionPokemonJaTypes,
        };
      }
    );

  const evolutionPokemonResults =
    await Promise.all(
      evolutionPokemonResponses
    );

  // ###########################################################
  // 詳細ページの表示部分
  // ###########################################################

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4">

      {/* 戻る・前後のポケモン・現在のポケモン */}
      <div className="mx-auto mb-8 grid w-full max-w-7xl grid-cols-3 items-start">

        {/* 左側 */}
        <div className="flex items-start gap-10">

          {/* 一覧へ戻る */}
          <Link
            href="/"
            className="rounded-full border border-slate-300 bg-white px-6 py-2 shadow-sm hover:bg-slate-100"
          >
            戻る
          </Link>

          {/* 前のポケモン */}
          {previousPokemonNumber !== null && (
            <Link
              href={`/pokemon/${previousPokemonNumber}`}
              className="text-left hover:text-red-600"
            >
              <p className="font-medium">
                ← {previousPokemonJaName}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                #
                {String(
                  previousPokemonNumber
                ).padStart(4, "0")}
              </p>
            </Link>
          )}

        </div>

        {/* 現在のポケモン */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            {pokemonJaName}
          </h1>

          <p className="mt-1 text-slate-500">
            #
            {String(pokemonNumber).padStart(
              4,
              "0"
            )}
          </p>
        </div>

        {/* 次のポケモン */}
        <div className="text-right">
          {nextPokemonNumber !== null && (
            <Link
              href={`/pokemon/${nextPokemonNumber}`}
              className="inline-block hover:text-red-600"
            >
              <p className="font-medium">
                {nextPokemonJaName} →
              </p>

              <p className="mt-1 text-sm text-slate-500">
                #
                {String(
                  nextPokemonNumber
                ).padStart(4, "0")}
              </p>
            </Link>
          )}
        </div>

      </div>

      {/* ポケモンの詳細情報全体 */}
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-[360px_1fr]">

        {/* 左側：画像とステータス */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          {/* ポケモンの画像 */}
          <div className="mb-5 flex h-72 items-center justify-center rounded-lg">
            {pokemonImage ? (
              <img
                src={pokemonImage}
                alt={pokemonJaName}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <p className="text-slate-400">
                画像未取得
              </p>
            )}
          </div>

          {/* ポケモンのステータス */}
          <div className="grid grid-cols-6 gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-3">

            {/* HP */}
            <div className="text-center">
              <p className="text-[10px] font-bold text-red-600">
                HP
              </p>

              <p className="mt-2 font-bold">
                {pokemonHp}
              </p>
            </div>

            {/* こうげき */}
            <div className="text-center">
              <p className="text-[10px] font-bold text-orange-600">
                こうげき
              </p>

              <p className="mt-2 font-bold">
                {pokemonAttack}
              </p>
            </div>

            {/* ぼうぎょ */}
            <div className="text-center">
              <p className="text-[10px] font-bold text-amber-600">
                ぼうぎょ
              </p>

              <p className="mt-2 font-bold">
                {pokemonDefense}
              </p>
            </div>

            {/* とくこう */}
            <div className="text-center">
              <p className="text-[10px] font-bold text-blue-600">
                とくこう
              </p>

              <p className="mt-2 font-bold">
                {pokemonSpecialAttack}
              </p>
            </div>

            {/* とくぼう */}
            <div className="text-center">
              <p className="text-[10px] font-bold text-purple-600">
                とくぼう
              </p>

              <p className="mt-2 font-bold">
                {pokemonSpecialDefense}
              </p>
            </div>

            {/* すばやさ */}
            <div className="text-center">
              <p className="text-[10px] font-bold text-green-600">
                すばやさ
              </p>

              <p className="mt-2 font-bold">
                {pokemonSpeed}
              </p>
            </div>

          </div>
        </div>

        {/* 右側：基本情報・タイプ・地方・説明 */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          {/* 高さ・重さ・分類・特性 */}
          <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">

            {/* 高さ */}
            <div className="flex min-h-32 flex-col justify-center rounded-lg border border-sky-100 bg-sky-50 p-4 text-center">
              <p className="font-bold text-slate-700">
                高さ
              </p>

              <p className="mt-3 font-bold">
                {pokemonHeight}m
              </p>
            </div>

            {/* 重さ */}
            <div className="flex min-h-32 flex-col justify-center rounded-lg border border-sky-100 bg-sky-50 p-4 text-center">
              <p className="font-bold text-slate-700">
                重さ
              </p>

              <p className="mt-3 font-bold">
                {pokemonWeight}kg
              </p>
            </div>

            {/* 分類 */}
            <div className="flex min-h-32 flex-col justify-center rounded-lg border border-sky-100 bg-sky-50 p-4 text-center">
              <p className="font-bold text-slate-700">
                分類
              </p>

              <p className="mt-3 wrap-break-words font-bold">
                {pokemonCategory}
              </p>
            </div>

            {/* 特性 */}
            <div className="flex min-h-32 flex-col justify-center rounded-lg border border-sky-100 bg-sky-50 p-4 text-center">
              <p className="font-bold text-slate-700">
                特性
              </p>

              <p className="mt-3 wrap-break-words font-bold">
                {pokemonAbilitiesText}
              </p>
            </div>

          </div>

          {/* タイプと地方 */}
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">

            {/* ポケモンのタイプ */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-800">
                タイプ
              </h2>

              <div className="flex flex-wrap gap-3">
                {pokemonJaTypes.map(
                  (pokemonType: string) => {
                    const typeDesign =
                      pokemonTypeDesign[
                        pokemonType
                      ] ?? {
                        icon: "●",
                        className:
                          "bg-slate-100 border-slate-300 text-slate-700",
                      };

                    return (
                      <span
                        key={pokemonType}
                        className={`flex items-center gap-2 rounded-full border px-6 py-3 font-bold ${typeDesign.className}`}
                      >
                        <span aria-hidden="true">
                          {typeDesign.icon}
                        </span>

                        <span>
                          {pokemonType}
                        </span>
                      </span>
                    );
                  }
                )}
              </div>
            </section>

            {/* ポケモンが登録されている地方 */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-800">
                地方
              </h2>

              {regionalPokedexNames.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {regionalPokedexNames.map(
                    (regionName) => {
                      return (
                        <span
                          key={regionName}
                          className="rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700"
                        >
                          {regionName}
                        </span>
                      );
                    }
                  )}
                </div>
              ) : (
                <p className="text-slate-500">
                  登録情報なし
                </p>
              )}
            </section>

          </div>

          {/* ポケモンの説明 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              ポケモンの説明
            </h2>

            <div className="flex min-h-31 items-center rounded-lg border border-slate-200 bg-slate-50 px-6 py-6">
              <p className="leading-8">
                {pokemonDescription}
              </p>
            </div>
          </section>

        </div>
      </div>

      {/* 進化情報 */}
      {evolutionPokemonResults.length > 0 && (
        <section className="mx-auto mt-10 mb-10 w-full max-w-5xl">

          <h2 className="mb-6 text-center text-2xl font-bold text-slate-800">
            進化
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {evolutionPokemonResults.map(
              (evolutionPokemon) => {
                return (
                  <Link
                    key={evolutionPokemon.id}
                    href={`/pokemon/${evolutionPokemon.id}`}
                    className="w-full rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm hover:bg-slate-50 hover:shadow-md"
                  >
                    {/* 進化するポケモンの画像 */}
                    <div className="mb-3 flex h-40 items-center justify-center">
                      {evolutionPokemon.image ? (
                        <img
                          src={
                            evolutionPokemon.image
                          }
                          alt={
                            evolutionPokemon.name
                          }
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <p className="text-sm text-slate-400">
                          画像未取得
                        </p>
                      )}
                    </div>

                    {/* 図鑑番号 */}
                    <p className="text-sm text-slate-500">
                      #
                      {String(
                        evolutionPokemon.id
                      ).padStart(4, "0")}
                    </p>

                    {/* 日本語名 */}
                    <p className="mt-1 text-lg font-bold">
                      {evolutionPokemon.name}
                    </p>

                    {/* タイプ */}
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      {evolutionPokemon.types.map(
                        (
                          evolutionPokemonType
                        ) => {
                          const typeDesign =
                            pokemonTypeDesign[
                              evolutionPokemonType
                            ] ?? {
                              icon: "●",
                              className:
                                "bg-slate-100 border-slate-300 text-slate-700",
                            };

                          return (
                            <span
                              key={
                                evolutionPokemonType
                              }
                              className={`flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-bold ${typeDesign.className}`}
                            >
                              <span aria-hidden="true">
                                {typeDesign.icon}
                              </span>

                              <span>
                                {
                                  evolutionPokemonType
                                }
                              </span>
                            </span>
                          );
                        }
                      )}
                    </div>
                  </Link>
                );
              }
            )}
          </div>

        </section>
      )}

    </main>
  );
}
