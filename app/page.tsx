interface ApiPokemon {
  name: string;
  url: string;
}

export default async function Home() {

  const responce = await fetch("https://pokeapi.co/api/v2/pokemon?limit=30");

  const data = await responce.json();
  console.log(data);
  const apiPokemons: ApiPokemon[] = data.results;

  const pokemons = apiPokemons;
  console.log(apiPokemons[0]);

  return (
    <>
      <h1 className="font-bold">ポケモン図鑑</h1>
      <button className="block py-2 w-20 border mb-5 bg-gray-50 mx-auto hover:bg-gray-100 cursor-pointer">検索する</button>

      <div className="grid grid-cols-3 gap-6 w-full max-w-[1200px] mx-auto">
        {pokemons.map((pokemon) => (
          <div key={pokemon.url} className="border p-4 rounded hover:bg-gray-100 cursor-pointer">

            <div className="h-80  mb-5 flex justify-center items-center">
              <img src="/img/pa-ko.JPG"  alt="ポケモンの画像エリア" className="max-w-full max-h-full"/>
            </div>
            
            <div className="text-center">
              #{pokemon.url}
            </div>
            
            <div className="font-bold text-center">
              {pokemon.name}
            </div>
            
            <div className="text-sm border rounded py-2 w-20 text-center mx-auto mt-2 mb-2">
              未取得
            </div>

          </div>
        ))}
      </div>
    </>
  )   
}
