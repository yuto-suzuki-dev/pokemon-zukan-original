import { NextResponse } from "next/server";

// 検索で選択できる地方
type RegionKey =
  | "all"
  | "kanto"
  | "johto"
  | "hoenn"
  | "sinnoh"
  | "unova"
  | "kalos"
  | "alola"
  | "galar"
  | "hisui"
  | "paldea";

interface SearchRequest {
  keyword?: string;
  region?: string;
}

interface NamedApiResource {
  name: string;
  url: string;
}

interface RegionResponse {
  pokedexes: NamedApiResource[];
}

interface PokedexEntry {
  pokemon_species: NamedApiResource;
}

interface PokedexResponse {
  pokemon_entries: PokedexEntry[];
}

interface PokemonSpeciesName {
  name: string;
  pokemon_species_id: number;
}

interface PokemonSearchResult {
  id: number;
  jaName: string;
  image: string;
}

interface GraphQLResponse {
  data?: {
    pokemonspeciesname: PokemonSpeciesName[];
  };
  errors?: {
    message: string;
  }[];
}

// この図鑑で扱う全国図鑑番号の最大値
const totalPokemonCount = 1025;

// 選択可能な地方
const regionKeys: RegionKey[] = [
  "all",
  "kanto",
  "johto",
  "hoenn",
  "sinnoh",
  "unova",
  "kalos",
  "alola",
  "galar",
  "hisui",
  "paldea",
];

// 受け取った文字が正しい地方の値か確認する
const isRegionKey = (
  region: string
): region is RegionKey => {
  return regionKeys.includes(region as RegionKey);
};

// APIのURLからポケモンの図鑑番号を取得する
const getPokemonSpeciesId = (
  pokemonSpeciesUrl: string
) => {
  const urlParts = pokemonSpeciesUrl
    .split("/")
    .filter(Boolean);

  return Number(urlParts[urlParts.length - 1]);
};

// 選択した地方の地方図鑑に登録されているポケモン番号を取得する
const getRegionPokemonSpeciesIds = async (
  region: RegionKey
) => {
  // 「すべての地方」の場合は全国図鑑1番から1025番を対象にする
  if (region === "all") {
    return Array.from(
      {
        length: totalPokemonCount,
      },
      (_, index) => {
        return index + 1;
      }
    );
  }

  // 選択された地方のデータを取得する
  const regionResponse = await fetch(
    `https://pokeapi.co/api/v2/region/${region}`,
    {
      next: {
        revalidate: 86400,
      },
    }
  );

  if (!regionResponse.ok) {
    throw new Error(
      `地方データの取得に失敗しました。status: ${regionResponse.status}`
    );
  }

  const regionData: RegionResponse =
    await regionResponse.json();

  // その地方に関連するすべての地方図鑑を取得する
  const pokedexResponses = regionData.pokedexes.map(
    async (pokedex) => {
      const pokedexResponse = await fetch(
        pokedex.url,
        {
          next: {
            revalidate: 86400,
          },
        }
      );

      if (!pokedexResponse.ok) {
        throw new Error(
          `地方図鑑の取得に失敗しました。status: ${pokedexResponse.status}`
        );
      }

      return (await pokedexResponse.json()) as PokedexResponse;
    }
  );

  const pokedexResults = await Promise.all(
    pokedexResponses
  );

  // 各地方図鑑に登録されているポケモン番号を取り出す
  const pokemonSpeciesIds = pokedexResults.flatMap(
    (pokedexData) => {
      return pokedexData.pokemon_entries.map(
        (pokedexEntry) => {
          return getPokemonSpeciesId(
            pokedexEntry.pokemon_species.url
          );
        }
      );
    }
  );

  // 同じポケモンが複数の地方図鑑にいても重複しないようにする
  // このアプリで扱う1025番までに限定する
  const uniquePokemonSpeciesIds = [
    ...new Set(pokemonSpeciesIds),
  ]
    .filter((pokemonSpeciesId) => {
      return (
        pokemonSpeciesId >= 1 &&
        pokemonSpeciesId <= totalPokemonCount
      );
    })
    .sort((firstId, secondId) => {
      return firstId - secondId;
    });

  return uniquePokemonSpeciesIds;
};

// ポケモンを日本語名と地方図鑑で検索する
export async function POST(request: Request) {
  try {
    const requestBody: SearchRequest =
      await request.json();

    // 入力されたポケモン名
    const keyword = requestBody.keyword?.trim();

    // 画面から送られてきた地方
    const requestedRegion =
      requestBody.region ?? "all";

    if (!keyword) {
      return NextResponse.json(
        {
          message:
            "ポケモン名を入力してください。",
        },
        {
          status: 400,
        }
      );
    }

    // 不正な地方が送られた場合は「すべての地方」にする
    const selectedRegion: RegionKey =
      isRegionKey(requestedRegion)
        ? requestedRegion
        : "all";

    // 選択した地方図鑑に登録されているポケモン番号を取得
    const pokemonSpeciesIds =
      await getRegionPokemonSpeciesIds(
        selectedRegion
      );

    // 地方図鑑に登録されているポケモンがいない場合
    if (pokemonSpeciesIds.length === 0) {
      return NextResponse.json({
        results: [],
        count: 0,
      });
    }

    // 開発時、中身確認用
    // console.log("検索する名前は", keyword);
    // console.log("選択された地方は", selectedRegion);
    // console.log(
    //   "地方図鑑に登録されている番号は",
    //   pokemonSpeciesIds
    // );

    // 日本語名の部分一致と地方図鑑の登録番号で検索
    const graphQLQuery = `
      query SearchPokemon(
        $keyword: String!
        $pokemonSpeciesIds: [Int!]!
      ) {
        pokemonspeciesname(
          where: {
            name: {
              _ilike: $keyword
            }
            language_id: {
              _eq: 1
            }
            pokemon_species_id: {
              _in: $pokemonSpeciesIds
            }
          }
          order_by: {
            pokemon_species_id: asc
          }
          limit: 1025
        ) {
          name
          pokemon_species_id
        }
      }
    `;

    const graphQLResponse = await fetch(
      "https://graphql.pokeapi.co/v1beta2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: graphQLQuery,
          variables: {
            keyword: `%${keyword}%`,
            pokemonSpeciesIds,
          },
        }),

        // 同じ検索結果を一定時間保存
        next: {
          revalidate: 86400,
        },
      }
    );

    if (!graphQLResponse.ok) {
      throw new Error(
        `PokeAPIとの通信に失敗しました。status: ${graphQLResponse.status}`
      );
    }

    const graphQLData: GraphQLResponse =
      await graphQLResponse.json();

    if (graphQLData.errors?.length) {
      console.error(
        "PokeAPI GraphQLエラー",
        graphQLData.errors
      );

      throw new Error(
        graphQLData.errors[0].message
      );
    }

    const pokemonSpeciesNames =
      graphQLData.data?.pokemonspeciesname ?? [];

    // 画面表示用の検索結果を作成
    const results: PokemonSearchResult[] =
      pokemonSpeciesNames.map((pokemon) => {
        return {
          id: pokemon.pokemon_species_id,
          jaName: pokemon.name,
          image:
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/` +
            `sprites/pokemon/other/official-artwork/` +
            `${pokemon.pokemon_species_id}.png`,
        };
      });

    return NextResponse.json({
      results,

      // 検索結果の件数
      count: results.length,
    });
  } catch (error) {
    console.error("検索APIエラー", error);

    return NextResponse.json(
      {
        message:
          "ポケモンの検索中にエラーが発生しました。",
      },
      {
        status: 500,
      }
    );
  }
}
