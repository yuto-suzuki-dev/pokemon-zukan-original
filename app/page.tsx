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
  
  const responce = await fetch("https://pokeapi.co/api/v2/pokemon?limit=30"); //pokeAPIからポケモンのデータを30件ずつ取得する
  const data = await responce.json(); //取得したデータをjavascriptで使えるように変換しdataに入れる
  // console.log("dataは" , data); //開発時、中身確認用


  const apiPokemons: apiPokemon[] = data.results; //// dataのresultsから30匹分の名前と詳細URLを取り出し、apiPokemonsに入れる

  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  //1匹分のポケモンのurlをapiPokemonsからmap(対応付けるの意)で取得。1匹あたりのポケモンのデータは仮でpokemonとする。
  //pokemonUrlにこの処理を格納
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃

  const pokemonUrl = apiPokemons.map((pokemon) => {
    return pokemon.url;
  })
  // console.log(pokemonUrl); //開発時、中身確認用


  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  // 30匹分のURLから1匹分ず取り出しpokemonDetailとする
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃

  const pokemonsDetails = pokemonUrl.map(async(url) => {
    const detailPokemonData = await fetch(url);
    const pokemonDetail = await detailPokemonData.json();
    console.log("ポケモン1匹あたりの詳細データは：",  pokemonDetail);
    return pokemonDetail;
  });

  const pokemonDetailsResults = await Promise.all(pokemonsDetails);
  // console.log("ポケモンの30匹分の詳細データから画像URLを取得、1匹目の画像のURLは", pokemonDetailsResults[0].sprites.other["official-artwork"].front_default);

  const pokemonImages = pokemonDetailsResults.map((pokemonImageData) => {
    const pokemonImage = pokemonImageData.sprites.other["official-artwork"].front_default;
    console.log("ポケモンの画像データは", pokemonImage);
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
        {apiPokemons.map((pokemon,index) => {
          const urlParts = pokemon.url.split("/"); 
          //console.log("1匹あたりのポケモンのURLを分解したものはこれ：" + urlParts);

          //urlPartsの中の配列の後ろから2番目のもの（番号）を取得し、pokemonNumberとする
          const pokemonNumber = urlParts[urlParts.length -2]; 

          // ############################################


          // ############################################
          //return の先はポケモン1匹あたりのカードの表示部分
          // ############################################
          return (
          //######################
          // ポケモンのカード単体 
          // keyはReact1枚ずつに対するReactへの目印
          //######################
          <div key={pokemon.url} className="border p-4 rounded hover:bg-gray-100 cursor-pointer">

            {/* ポケモンの画像 */}
            <div className="h-80  mb-5 flex justify-center items-center">
              <img src={pokemonImages[index]}  alt={pokemon.name} className="max-w-full max-h-full"/>
            </div>
            
            {/* ポケモンの図鑑番号 */}
            <div className="text-center">
              #{pokemonNumber}
            </div>
            
            {/* ポケモンの名前 */}
            <div className="font-bold text-center">
              {pokemon.name}
            </div>
            
            {/* ポケモンの説明文 */}
            <div className="text-sm border rounded py-2 w-20 text-center mx-auto mt-2 mb-2">
              未取得
            </div>

          </div>
          )
        })}
      </div>
    </>
  )   
}
