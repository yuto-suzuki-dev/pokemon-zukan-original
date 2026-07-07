interface ApiPokemon {
  name: string;
  url: string;
}

export default async function Home() {

  const responce = await fetch("https://pokeapi.co/api/v2/pokemon?limit=30"); //pokeAPIからポケモンのデータを30件ずつ取得する
  const data = await responce.json(); //取得したデータをjavascriptで使えるように変換しdataに入れる
  console.log(data); //開発時、中身確認用
  const apiPokemons: ApiPokemon[] = data.results; //取得して変換したポケモンのデータはapiPokemonsとする。apiPokemonsはインターフェースのApiPokemonのデータ型形式

  const pokemons = apiPokemons;
  console.log(apiPokemons[0]);

  return (
    <>
      <h1 className="font-bold">ポケモン図鑑</h1>
      <button className="block py-2 w-20 border mb-5 bg-gray-50 mx-auto hover:bg-gray-100 cursor-pointer">検索する</button>

      <div className="grid grid-cols-3 gap-6 w-full max-w-[1200px] mx-auto">  {/* ポケモンのカード表示するエリア全体 */}
        {pokemons.map((pokemon) => {
          const urlParts = pokemon.url.split("/"); //APIから取得したポケモンのURLを"/"ごとに分解しurlPartsとする
          console.log(urlParts); // 開発時、中身確認用

          const pokemonNumber = urlParts[urlParts.length -2]; //urlPartsの中の配列の後ろから２番目のもの（番号）を取得し、pokemonNumberとする
          

          return (
          <div key={pokemon.url} className="border p-4 rounded hover:bg-gray-100 cursor-pointer"> {/*ポケモンのカード単体*/}

            <div className="h-80  mb-5 flex justify-center items-center"> {/*ポケモンの画像*/}
              <img src="/img/pa-ko.JPG"  alt="ポケモンの画像エリア" className="max-w-full max-h-full"/>
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
