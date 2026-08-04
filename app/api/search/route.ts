import { NextResponse } from "next/server";

interface SearchRequest {
  keyword?: string;
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

// ポケモンを日本語名で検索
export async function POST(request: Request) {
  try {
    const requestBody: SearchRequest = await request.json();
    const keyword = requestBody.keyword?.trim();

    if (!keyword) {
      return NextResponse.json(
        {
          message: "ポケモン名を入力してください。",
        },
        {
          status: 400,
        }
      );
    }

    // 日本語名を部分一致で検索
    const graphQLQuery = `
      query SearchPokemon($keyword: String!) {
        pokemonspeciesname(
          where: {
            name: { _ilike: $keyword }
            language_id: { _eq: 1 }
            pokemon_species_id: { _lte: 1025 }
          }
          order_by: {
            pokemon_species_id: asc
          }
          limit: 20
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
