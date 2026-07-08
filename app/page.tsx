interface ApiPokemon {
  name: string;
  url: string;
}

export default async function Home() {

  const responce = await fetch("https://pokeapi.co/api/v2/pokemon?limit=30"); //pokeAPIからポケモンのデータを30件ずつ取得する
  const data = await responce.json(); //取得したデータをjavascriptで使えるように変換しdataに入れる
  // console.log(data); //開発時、中身確認用
  const apiPokemons: ApiPokemon[] = data.results; //取得して変換したポケモンのデータはapiPokemonsとする。apiPokemonsはインターフェースのApiPokemonのデータ型形式


  const firstPokemonUrl = apiPokemons[0].url; //まずは一匹目のポケモンのurlを取得し、firstPokemonUrlとする
  // console.log(firstPokemonUrl); //確認用、消してよい

  const responceUrl = await fetch(firstPokemonUrl); //pokeAPIから１匹目のポケモンのURLを取得する
  const detailData = await responceUrl.json(); //取得したデータをjavascriptで使えるように変換しdetailDataに入れる
  // console.log("１匹目のポケモンの詳細データは",detailData); //目視で画像のデータがどこにあるか確認する。確認用、消してよい
  // console.log("１匹目のポケモンの画像データは",detailData.sprites.other["official-artwork"].front_default); //// 確認した画像の階層から画像URLを取得する。確認用、消してよい

  const firstPokemonImage = detailData.sprites.other["official-artwork"].front_default;//１匹目のポケモンの画像はfirstPokemonImageとする
  // console.log("１匹目のポケモン（フシギダネ）の画像は",firstPokemonImage);
  return (
    <>
      <h1 className="font-bold">ポケモン図鑑</h1>
      <button className="block py-2 w-20 border mb-5 bg-gray-50 mx-auto hover:bg-gray-100 cursor-pointer">検索する</button>

      <div className="grid grid-cols-3 gap-6 w-full max-w-[1200px] mx-auto">  {/* ポケモンのカード表示するエリア全体 */}
        {apiPokemons.map((pokemon) => {
          const urlParts = pokemon.url.split("/"); //APIから取得したポケモンのURLを"/"ごとに分解しurlPartsとする
          // console.log(urlParts); // 開発時、中身確認用

          const pokemonNumber = urlParts[urlParts.length -2]; //urlPartsの中の配列の後ろから２番目のもの（番号）を取得し、pokemonNumberとする

          return (
          <div key={pokemon.url} className="border p-4 rounded hover:bg-gray-100 cursor-pointer"> {/*ポケモンのカード単体*/}

            <div className="h-80  mb-5 flex justify-center items-center"> {/*ポケモンの画像*/}
              <img src={firstPokemonImage}  alt="フシギダネ" className="max-w-full max-h-full"/>
            </div>
            
            <div className="text-center"> {/*ポケモンの図鑑番号*/}
              #{pokemonNumber}
            </div>
            
            <div className="font-bold text-center"> {/*ポケモンの名前*/}
              {pokemon.name}
            </div>
            
            <div className="text-sm border rounded py-2 w-20 text-center mx-auto mt-2 mb-2"> {/*ポケモンの説明文*/}
              未取得
            </div>

          </div>
          )
        })}
      </div>
    </>
  )   
}
