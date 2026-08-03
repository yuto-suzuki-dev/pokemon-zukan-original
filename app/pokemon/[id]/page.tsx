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

const responcePokemonAbilities = pokemonAbilities.map(async (pokemonAbilityUrl: string) => {
  const responcePokemonAbility = await fetch(pokemonAbilityUrl);
  return await responcePokemonAbility.json();
});

const pokemonAbilitiesData = await Promise.all(responcePokemonAbilities);

// 日本語の特性名を取得
const pokemonJaAbilities = pokemonAbilitiesData.map((pokemonAbilityData) => {
  const pokemonJaAbility = pokemonAbilityData.names.find(
    (abilityData: { language: { name: string }; name: string }) => {
      return abilityData.language.name === "ja";
    }
  );

  return pokemonJaAbility.name;
});

// 開発時、中身確認用
// console.log("ポケモンの特性は", pokemonJaAbilities);



  // 日本語名取得用のURL
  const pokemonSpeciesUrl = pokemonDetail.species.url;

  // Speciesの詳細データを取得
  const responcePokemonSpecies = await fetch(pokemonSpeciesUrl);
  const pokemonSpeciesData = await responcePokemonSpecies.json();

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
      (nameData: { language: { name: string }; name: string }) => {
        return nameData.language.name === "ja";
      }
    );

    return jaName.name;
  })
);

// console.log("進化ポケモン日本語名", evolutionJaNames);


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

      <div className="mt-5">
        <p>HP：{pokemonStatus[0].statusValue}</p>
        <p>こうげき：{pokemonStatus[1].statusValue}</p>
        <p>ぼうぎょ：{pokemonStatus[2].statusValue}</p>
        <p>とくこう：{pokemonStatus[3].statusValue}</p>
        <p>とくぼう：{pokemonStatus[4].statusValue}</p>
        <p>すばやさ：{pokemonStatus[5].statusValue}</p>
      </div>
      
      <p>特性：{pokemonJaAbilities.join("・")}</p>

      <p>進化：{evolutionJaNames.join(" → ")}</p>

    </>
  );
}
