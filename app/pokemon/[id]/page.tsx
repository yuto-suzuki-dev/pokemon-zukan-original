import Link from "next/link";

interface DetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// タイプごとのアイコンと色
const pokemonTypeDesign: {
  [key: string]: {
    icon: string;
    className: string;
  };
} = {
  ノーマル: {
    icon: "○",
    className: "bg-stone-100 border-stone-300 text-stone-700",
  },
  ほのお: {
    icon: "🔥",
    className: "bg-orange-100 border-orange-300 text-orange-700",
  },
  みず: {
    icon: "💧",
    className: "bg-blue-100 border-blue-300 text-blue-700",
  },
  でんき: {
    icon: "⚡",
    className: "bg-yellow-100 border-yellow-300 text-yellow-700",
  },
  くさ: {
    icon: "🌿",
    className: "bg-green-100 border-green-300 text-green-700",
  },
  こおり: {
    icon: "❄️",
    className: "bg-cyan-100 border-cyan-300 text-cyan-700",
  },
  かくとう: {
    icon: "✊",
    className: "bg-red-100 border-red-300 text-red-700",
  },
  どく: {
    icon: "☠️",
    className: "bg-purple-100 border-purple-300 text-purple-700",
  },
  じめん: {
    icon: "⛰️",
    className: "bg-amber-100 border-amber-300 text-amber-700",
  },
  ひこう: {
    icon: "🪽",
    className: "bg-sky-100 border-sky-300 text-sky-700",
  },
  エスパー: {
    icon: "🔮",
    className: "bg-pink-100 border-pink-300 text-pink-700",
  },
  むし: {
    icon: "🐛",
    className: "bg-lime-100 border-lime-300 text-lime-700",
  },
  いわ: {
    icon: "🪨",
    className: "bg-yellow-100 border-yellow-400 text-yellow-800",
  },
  ゴースト: {
    icon: "👻",
    className: "bg-indigo-100 border-indigo-300 text-indigo-700",
  },
  ドラゴン: {
    icon: "🐉",
    className: "bg-violet-100 border-violet-300 text-violet-700",
  },
  あく: {
    icon: "🌑",
    className: "bg-gray-200 border-gray-400 text-gray-800",
  },
  はがね: {
    icon: "⚙️",
    className: "bg-slate-100 border-slate-300 text-slate-700",
  },
  フェアリー: {
    icon: "✨",
    className: "bg-rose-100 border-rose-300 text-rose-700",
  },
};

export default async function PokemonDetailPage({
  params,
}: DetailPageProps) {

  // URLから図鑑番号を取得
  const { id } = await params;

  // ポケモンの詳細データを取得
  const responce = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${id}`
  );

  const pokemonDetail = await responce.json();

  // ポケモンの画像を取得
  const pokemonImage =
    pokemonDetail.sprites.other["official-artwork"].front_default;

  // ポケモンの高さを取得
  // APIの高さは10分の1メートル単位なので10で割る
  const pokemonHeight = pokemonDetail.height / 10;

  // ポケモンの重さを取得
  // APIの重さは10分の1キログラム単位なので10で割る
  const pokemonWeight = pokemonDetail.weight / 10;

  // 開発時、中身確認用
  // console.log("ポケモンの高さは", pokemonHeight);
  // console.log("ポケモンの重さは", pokemonWeight);

  // ポケモンのタイプについて
  const pokemonTypeUrls = pokemonDetail.types.map(
    (
      pokemonTypeData: {
        type: {
          name: string;
          url: string;
        };
      }
    ) => {
      return pokemonTypeData.type.url;
    }
  );

  const responcePokemonTypes = pokemonTypeUrls.map(
    async (pokemonTypeUrl: string) => {

      const responcePokemonType = await fetch(pokemonTypeUrl);

      return await responcePokemonType.json();
    }
  );

  const pokemonTypesData = await Promise.all(
    responcePokemonTypes
  );

  // 日本語タイプを取得
  const pokemonJaTypes = pokemonTypesData.map(
    (pokemonTypeData) => {

      const pokemonJaType = pokemonTypeData.names.find(
        (
          typeData: {
            language: {
              name: string;
            };
            name: string;
          }
        ) => {
          return typeData.language.name === "ja";
        }
      );

      return pokemonJaType.name;
    }
  );

  // 開発時、中身確認用
  // console.log("ポケモンのタイプは", pokemonJaTypes);

  // ポケモンのステータスを取得
  const pokemonStatus = pokemonDetail.stats.map(
    (
      pokemonStatusData: {
        base_stat: number;
        stat: {
          name: string;
        };
      }
    ) => {
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
    (
      pokemonAbilityData: {
        ability: {
          name: string;
          url: string;
        };
      }
    ) => {
      return pokemonAbilityData.ability.url;
    }
  );

  const responcePokemonAbilities = pokemonAbilities.map(
    async (pokemonAbilityUrl: string) => {

      const responcePokemonAbility =
        await fetch(pokemonAbilityUrl);

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
        (
          abilityData: {
            language: {
              name: string;
            };
            name: string;
          }
        ) => {
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
  const responcePokemonSpecies = await fetch(
    pokemonSpeciesUrl
  );

  const pokemonSpeciesData =
    await responcePokemonSpecies.json();

  // ポケモンの分類を取得
  const pokemonCategoryData = pokemonSpeciesData.genera.find(
    (
      categoryData: {
        language: {
          name: string;
        };
        genus: string;
      }
    ) => {
      return categoryData.language.name === "ja";
    }
  );

  const pokemonCategory = pokemonCategoryData.genus;

  // 開発時、中身確認用
  // console.log("ポケモンの分類は", pokemonCategory);

  // ポケモンの説明文を取得
  const pokemonDescriptionData =
    pokemonSpeciesData.flavor_text_entries.find(
      (
        flavorTextData: {
          language: {
            name: string;
          };
          flavor_text: string;
        }
      ) => {
        return flavorTextData.language.name === "ja";
      }
    );

  const pokemonDescription =
    pokemonDescriptionData.flavor_text
      .replace(/\n/g, " ")
      .replace(/\f/g, " ");

  // 開発時、中身確認用
  // console.log("ポケモンの説明文は", pokemonDescription);

  // 進化チェーンのURLを取得
  const evolutionChainUrl =
    pokemonSpeciesData.evolution_chain.url;

  // 進化チェーンのデータを取得
  const responceEvolutionChain = await fetch(
    evolutionChainUrl
  );

  const evolutionChainData =
    await responceEvolutionChain.json();

  // 開発時、中身確認用
  // console.log("進化チェーンのデータは", evolutionChainData);

  // 進化するポケモンを取得
  const evolutionPokemons: string[] = [];

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
        (
          nameData: {
            language: {
              name: string;
            };
            name: string;
          }
        ) => {
          return nameData.language.name === "ja";
        }
      );

      return jaName.name;
    })
  );

  // console.log("進化ポケモン日本語名", evolutionJaNames);

  // 進化ポケモンの画像・番号・日本語タイプを取得
  const evolutionPokemonDetails = await Promise.all(
    evolutionPokemons.map(async (pokemonName: string, index: number) => {

      // 進化ポケモン1匹分の詳細データを取得
      const responceEvolutionPokemon = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );

      const evolutionPokemonData =
        await responceEvolutionPokemon.json();

      // 進化ポケモンの画像を取得
      const evolutionPokemonImage =
        evolutionPokemonData.sprites.other[
          "official-artwork"
        ].front_default;

      // 進化ポケモンの図鑑番号を取得
      const evolutionPokemonNumber =
        evolutionPokemonData.id;

      // 進化ポケモンのタイプURLを取得
      const evolutionPokemonTypeUrls =
        evolutionPokemonData.types.map(
          (
            pokemonTypeData: {
              type: {
                name: string;
                url: string;
              };
            }
          ) => {
            return pokemonTypeData.type.url;
          }
        );

      // 進化ポケモンのタイプ詳細データを取得
      const evolutionPokemonTypesData =
        await Promise.all(
          evolutionPokemonTypeUrls.map(
            async (pokemonTypeUrl: string) => {

              const responcePokemonType =
                await fetch(pokemonTypeUrl);

              return await responcePokemonType.json();
            }
          )
        );

      // 進化ポケモンの日本語タイプを取得
      const evolutionPokemonJaTypes =
        evolutionPokemonTypesData.map(
          (pokemonTypeData) => {

            const pokemonJaType =
              pokemonTypeData.names.find(
                (
                  typeData: {
                    language: {
                      name: string;
                    };
                    name: string;
                  }
                ) => {
                  return typeData.language.name === "ja";
                }
              );

            return pokemonJaType.name;
          }
        );

      return {
        id: evolutionPokemonNumber,
        image: evolutionPokemonImage,
        jaName: evolutionJaNames[index],
        types: evolutionPokemonJaTypes,
      };
    })
  );

  // 開発時、中身確認用
  // console.log(
  //   "進化ポケモンのカード用データは",
  //   evolutionPokemonDetails
  // );

  // 日本語名を取得
  const pokemonJaName = pokemonSpeciesData.names.find(
    (
      nameData: {
        language: {
          name: string;
        };
        name: string;
      }
    ) => {
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
        (
          nameData: {
            language: {
              name: string;
            };
            name: string;
          }
        ) => {
          return nameData.language.name === "ja";
        }
      );

    previousPokemonJaName =
      previousPokemonNameData.name;
  }

  // 次のポケモンの日本語名を取得
  const responceNextPokemonSpecies = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${nextPokemonNumber}`
  );

  const nextPokemonSpeciesData =
    await responceNextPokemonSpecies.json();

  const nextPokemonNameData =
    nextPokemonSpeciesData.names.find(
      (
        nameData: {
          language: {
            name: string;
          };
          name: string;
        }
      ) => {
        return nameData.language.name === "ja";
      }
    );

  const nextPokemonJaName =
    nextPokemonNameData.name;

  // 開発時、中身確認用
  // console.log("前のポケモンは", previousPokemonJaName);
  // console.log("次のポケモンは", nextPokemonJaName);

  return (
    <main className="min-h-screen bg-slate-50 px-4 pt-4 pb-8">

      {/* 戻るボタン・前後のポケモン・名前と図鑑番号 */}
      <div className="relative w-full max-w-6xl mx-auto mb-4 min-h-17.5">

        {/* 一覧画面へ戻る */}
        <div className="absolute left-0 top-0">
          <Link
            href="/"
            className="border border-slate-300 rounded-full px-5 py-2 bg-white hover:bg-slate-100 shadow-sm"
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
              <p className="font-medium">
                ← {previousPokemonJaName}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                #{String(previousPokemonNumber).padStart(4, "0")}
              </p>
            </Link>
          )}
        </div>

        {/* ポケモンの名前と図鑑番号 */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            {pokemonJaName.name}
          </h1>

          <p className="text-slate-500 mt-1">
            #{String(pokemonNumber).padStart(4, "0")}
          </p>
        </div>

        {/* 次のポケモンへ移動 */}
        <div className="absolute right-0 top-0 text-center">
          <Link
            href={`/pokemon/${nextPokemonNumber}`}
            className="hover:underline"
          >
            <p className="font-medium">
              {nextPokemonJaName} →
            </p>

            <p className="text-sm text-slate-500 mt-1">
              #{String(nextPokemonNumber).padStart(4, "0")}
            </p>
          </Link>
        </div>

      </div>

      {/* ポケモンの詳細情報全体 */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6">

        {/* 左側：画像とステータス */}
        <div className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm">

          {/* ポケモンの画像 */}
         <div className="h-72 flex justify-center items-center mb-5 rounded-lg">
            <img
              src={pokemonImage}
              alt={pokemonDetail.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* ポケモンのステータス */}
          <div className="grid grid-cols-6 gap-1 border border-slate-200 rounded-lg bg-slate-50 px-2 py-3">

            <div className="text-center">
              <p className="text-[10px] font-bold text-red-600">
                HP
              </p>

              <p className="text-sm font-bold mt-1">
                {pokemonStatus[0].statusValue}
              </p>
            </div>

            <div className="text-center">
              <p className="text-[10px] font-bold text-orange-600">
                こうげき
              </p>

              <p className="text-sm font-bold mt-1">
                {pokemonStatus[1].statusValue}
              </p>
            </div>

            <div className="text-center">
              <p className="text-[10px] font-bold text-amber-600">
                ぼうぎょ
              </p>

              <p className="text-sm font-bold mt-1">
                {pokemonStatus[2].statusValue}
              </p>
            </div>

            <div className="text-center">
              <p className="text-[10px] font-bold text-blue-600">
                とくこう
              </p>

              <p className="text-sm font-bold mt-1">
                {pokemonStatus[3].statusValue}
              </p>
            </div>

            <div className="text-center">
              <p className="text-[10px] font-bold text-indigo-600">
                とくぼう
              </p>

              <p className="text-sm font-bold mt-1">
                {pokemonStatus[4].statusValue}
              </p>
            </div>

            <div className="text-center">
              <p className="text-[10px] font-bold text-green-600">
                すばやさ
              </p>

              <p className="text-sm font-bold mt-1">
                {pokemonStatus[5].statusValue}
              </p>
            </div>

          </div>
        </div>

        {/* 右側：基本情報・タイプ・説明文 */}
        <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm">

          {/* 高さ・重さ・分類・特性 */}
          <div className="grid grid-cols-4 gap-3 mb-7">

            {/* 高さ */}
            <div className="border border-sky-200 rounded-lg bg-sky-50 px-2 py-4 text-center">
              <p className="text-sm font-bold text-sky-700 mb-2">
                高さ
              </p>

              <p className="font-bold">
                {pokemonHeight}m
              </p>
            </div>

            {/* 重さ */}
            <div className="border border-orange-200 rounded-lg bg-orange-50 px-2 py-4 text-center">
              <p className="text-sm font-bold text-orange-700 mb-2">
                重さ
              </p>

              <p className="font-bold">
                {pokemonWeight}kg
              </p>
            </div>

            {/* 分類 */}
            <div className="border border-green-200 rounded-lg bg-green-50 px-2 py-4 text-center">
              <p className="text-sm font-bold text-green-700 mb-2">
                分類
              </p>

              <p className="text-sm font-bold">
                {pokemonCategory}
              </p>
            </div>

            {/* 特性 */}
            <div className="border border-purple-200 rounded-lg bg-purple-50 px-2 py-4 text-center">
              <p className="text-sm font-bold text-purple-700 mb-2">
                特性
              </p>

              <p className="text-sm font-bold">
                {pokemonJaAbilities.join("・")}
              </p>
            </div>

          </div>

          {/* ポケモンのタイプ */}
          <div className="mb-7">
            <h2 className="font-bold text-lg text-slate-700 mb-3">
              タイプ
            </h2>

            <div className="flex flex-wrap gap-3">
              {pokemonJaTypes.map((pokemonType: string) => {

                const typeDesign =
                  pokemonTypeDesign[pokemonType] ?? {
                    icon: "●",
                    className:
                      "bg-slate-100 border-slate-300 text-slate-700",
                  };

                return (
                  <div
                    key={pokemonType}
                    className={`flex items-center gap-2 border rounded-full px-5 py-2 font-bold ${typeDesign.className}`}
                  >
                    <span aria-hidden="true">
                      {typeDesign.icon}
                    </span>

                    <span>
                      {pokemonType}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ポケモンの説明文 */}
          <div>
            <h2 className="font-bold text-lg text-slate-700 mb-3">
              ポケモンの説明
            </h2>

            <div className="border border-slate-200 rounded-lg bg-slate-50 px-5 py-4 min-h-24 flex items-center">
              <p className="leading-7">
                {pokemonDescription}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ポケモンの進化 */}
      <section className="w-full max-w-5xl mx-auto mt-6">

        <h2 className="font-bold text-xl text-slate-700 mb-4">
          進化
        </h2>

        {/* 進化ポケモンのカード表示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {evolutionPokemonDetails.map(
            (
              evolutionPokemon: {
                id: number;
                image: string;
                jaName: string;
                types: string[];
              },
              index: number
            ) => {
              return (
                <div
                  key={evolutionPokemon.id}
                  className="relative"
                >

                  {/* 2匹目以降に進化の矢印を表示 */}
                  {index > 0 && (
                    <div className="hidden md:block absolute -left-5 top-1/2 -translate-y-1/2 text-2xl text-slate-400">
                      →
                    </div>
                  )}

                  <Link
                    href={`/pokemon/${evolutionPokemon.id}`}
                    className="block h-full"
                  >
                    <article className="h-full border border-slate-200 rounded-xl bg-white p-5 shadow-sm hover:bg-slate-100 hover:shadow-md">

                      {/* 進化ポケモンの画像 */}
                      <div className="h-40 flex justify-center items-center mb-3">
                        <img
                          src={evolutionPokemon.image}
                          alt={evolutionPokemon.jaName}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>

                      {/* 進化ポケモンの日本語名 */}
                      <h3 className="font-bold text-xl text-center text-slate-800">
                        {evolutionPokemon.jaName}
                      </h3>

                      {/* 進化ポケモンの図鑑番号 */}
                      <p className="text-center text-sm text-slate-500 mt-1">
                        #{String(evolutionPokemon.id).padStart(4, "0")}
                      </p>

                      {/* 進化ポケモンのタイプ */}
                      <div className="flex flex-wrap justify-center gap-2 mt-4">

                        {evolutionPokemon.types.map(
                          (pokemonType: string) => {

                            const typeDesign =
                              pokemonTypeDesign[pokemonType] ?? {
                                icon: "●",
                                className:
                                  "bg-slate-100 border-slate-300 text-slate-700",
                              };

                            return (
                              <span
                                key={pokemonType}
                                className={`flex items-center gap-1 border rounded-full px-3 py-1 text-sm font-bold ${typeDesign.className}`}
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

                    </article>
                  </Link>

                </div>
              );
            }
          )}

        </div>

      </section>

    </main>
  );
}
