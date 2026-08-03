import Link from "next/link";

//＃＃＃＃＃＃＃＃＃＃
//データの定義部分
//＃＃＃＃＃＃＃＃＃＃
interface apiPokemon { //interfaceはオブジェクトの中身・データの構造の定義。
  name: string;
  url: string;
}
//＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
//Home関数 アプリを実行すると最初に実行される関数
//＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
export default async function Home() {
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  //pokeAPI（一般に公開されているポケモンの膨大なデータの元）に接続(fetch)して30件ずつ取得。取得したデータをdataに格納 
  //取得した30匹分のポケモンのデータ（nameと詳細データへのアクセスさきのurl）はapiPokemonsに入れる。
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=30"); //pokeAPIからポケモンのデータを30件ずつ取得する
  const data = await response.json(); //取得したデータをjavascriptで使えるように変換しdataに入れる
  // console.log("dataは" , data); //開発時、中身確認用
  const apiPokemons: apiPokemon[] = data.results; //// dataのresultsから30匹分の名前と詳細URLを取り出し、apiPokemonsに入れる
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  //1匹分のポケモンのurlをapiPokemonsからmap(対応付けるの意)で取得。1匹あたりのポケモンのデータは仮でpokemonとする。
  //pokemonUrlにこの処理を格納
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  const pokemonUrl = apiPokemons.map((pokemon) => {
    return pokemon.url;
  })
  //console.log(pokemonUrl); 
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  // 30匹分のURLから1匹分ず取り出しpokemonDetailResultsとする
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃

  const pokemonsDetails = pokemonUrl.map(async (url) => {
    const detailPokemonData = await fetch(url);
    const pokemonDetail = await detailPokemonData.json();
    //console.log("ポケモン1匹あたりの詳細データは：",  pokemonDetail);
    return pokemonDetail;
  });
  const pokemonDetailsResults = await Promise.all(pokemonsDetails);
  // console.log("ポケモンの30匹分の詳細データから画像URLを取得、1匹目の画像のURLは", pokemonDetailsResults[0].sprites.other["official-artwork"].front_default);
  //console.log("1匹目の詳細データははこれ", pokemonDetailsResults[0],"だよ");

  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  // ポケモンのタイプについて
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  //console.log("1匹目のポケモンのタイプのひとつめは", pokemonDetailsResults[0].types[0].type.name,"です");
  const pokemonAllDetailTypesUrls = pokemonDetailsResults.map((pokemonDetailData) => {
      const pokemonTypeUrls = pokemonDetailData.types.map((pokemonTypeData: { type: { name: string; url: string; }; }) => {
        const pokemonTypeUrl = pokemonTypeData.type.url; //１，まずタイプ１件分からURLを取り出す
       // console.log("タイプのURLは", pokemonTypeUrl);
      return pokemonTypeUrl; //２，１件分のタイプURLをmapの結果として返す
    });
    return pokemonTypeUrls;
  });
  //console.log("ポケモンのタイプURLはこれ",pokemonAllDetailTypesUrls,"です");

  const responcePokemonAllTypesDetailUrl = pokemonAllDetailTypesUrls.map(async(pokemonTypeUrls) => {
    const pokemonTypes = pokemonTypeUrls.map(async(pokemonTypeUrl : string) => {
     const responcePokemonTypeUrl = await fetch(pokemonTypeUrl);
      return await responcePokemonTypeUrl.json();
    });
    return  await Promise.all(pokemonTypes);
  });
  const pokemonTypesResults = await Promise.all(responcePokemonAllTypesDetailUrl);
  //console.log("ポケモンのタイプは",pokemonTypesResults,"です");
  
  const pokemonsJaTypes = pokemonTypesResults.map((pokemonJaTypes) => {
    const pokemonJaTypeData = pokemonJaTypes.map((pokemonJaType) => {
      const pokemonJaTypeName = pokemonJaType.names.find((typeData: {language: {name: string};}) => {
        return typeData.language.name === "ja";
      });
      return pokemonJaTypeName.name;
    });
    return pokemonJaTypeData;
  });
 // console.log("ポケモンの1匹目のタイプは",pokemonsJaTypes); //ポケモンのタイプ日本語で表示




  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  //ポケモンを日本語名で取得
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  //console.log("ポケモンの日本語名がある詳細データは",pokemonDetailsResults[0].species.url,"です");
  const pokemonSpeciesUrls = pokemonDetailsResults.map((pokemonSpeciesUrlData) => {
    const pokemonSpeciesUrl = pokemonSpeciesUrlData.species.url;
    return pokemonSpeciesUrl;
  });
  //console.log("ポケモンのSpeciesのURLは",pokemonSpeciesUrls);
  const responsePokemonSpeciesUrls = pokemonSpeciesUrls.map(async (speciesUrl) => {
    const pokemonSpeciesUrl = await fetch(speciesUrl);
    const pokemonSpeciesData = await pokemonSpeciesUrl.json();
    //console.log("ポケモンのSpeciesのデータは",pokemonSpeciesData);
    return pokemonSpeciesData;
  });
  const pokemonSpeciesDataResults = await Promise.all(responsePokemonSpeciesUrls);
  //console.log("speciesの詳細データは",pokemonSpeciesDataResults);
  const pokemonJaNames = pokemonSpeciesDataResults.map((pokemonJaName) => {
    const pokemonJaNameData = pokemonJaName.names.find((nameData: { language: { name: string }; name: string }) => {
      return nameData.language.name === "ja";
    });
    return pokemonJaNameData.name;
  });
  //console.log("ポケモンのJaNameは",pokemonJaNames);

  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  //ポケモンの画像のデータ
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  const pokemonImages = pokemonDetailsResults.map((pokemonImageData) => {
    const pokemonImage = pokemonImageData.sprites.other["official-artwork"].front_default;
    //console.log("ポケモンの画像データは", pokemonImage);
    return pokemonImage;
  }
  )

  return (
    <>
      {/* Header部分 */}
      <h1 className="font-bold">ポケモン図鑑</h1>

      {/* Main部分 */}

      {/* 検索ボタン */}
      <button className="block py-2 w-20 border mb-5 bg-gray-50 mx-auto hover:bg-gray-100 cursor-pointer">検索する</button>

      {/* ポケモンのカード表示するエリア全体 */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-[1200px] mx-auto">


        {/*ポケモンのそれぞれの番号を取得する############ */}
        {/* APIから取得したポケモンのURLを"/"ごとに分解しurlPartsとする */}
        {apiPokemons.map((pokemon, index) => {
          const urlParts = pokemon.url.split("/");
          //console.log("1匹あたりのポケモンのURLを分解したものはこれ：" + urlParts);

          //urlPartsの中の配列の後ろから2番目のもの（番号）を取得し、pokemonNumberとする
          const pokemonNumber = urlParts[urlParts.length - 2];

          // ############################################


          // ############################################
          //return の先はポケモン1匹あたりのカードの表示部分
         return (
  //######################
  // ポケモンのカード単体
  // keyはReact1枚ずつに対するReactへの目印
  //######################
  <Link key={pokemon.url} href={`/pokemon/${pokemonNumber}`}>
    <div className="border p-4 rounded hover:bg-gray-100 cursor-pointer">

      {/* ポケモンの画像 */}
      <div className="h-80 mb-5 flex justify-center items-center">
        <img
          src={pokemonImages[index]}
          alt={pokemon.name}
          className="max-w-full max-h-full"
        />
      </div>

      {/* ポケモンの図鑑番号 */}
      <div className="text-center">
        #{pokemonNumber}
      </div>

      {/* ポケモンの名前 */}
      <div className="font-bold text-center">
        {pokemonJaNames[index]}
      </div>

      {/* ポケモンのタイプ */}
      <div className="text-center">
        {pokemonsJaTypes[index].join("・")}
      </div>

      {/* ポケモンの説明文 */}
      <div className="text-sm border rounded py-2 w-20 text-center mx-auto mt-2 mb-2">
        未取得
      </div>

    </div>
        </Link>
    );
  })}
      </div>
    </>
  );
}
