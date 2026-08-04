import Link from "next/link";

//＃＃＃＃＃＃＃＃＃＃
//データの定義部分
//＃＃＃＃＃＃＃＃＃＃
interface apiPokemon {
  //interfaceはオブジェクトの中身・データの構造の定義。
  name: string;
  url: string;
}

// URLの?page=○を受け取るためのデータ型
interface HomeProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

//＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
//Home関数 アプリを実行すると最初に実行される関数
//＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
export default async function Home({ searchParams }: HomeProps) {
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  // ページネーションについて
  // 全国図鑑1番から1025番までを、1ページ30匹ずつ表示する
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃

  // URLの?page=○から現在のページ番号を取得
  const pageParams = await searchParams;
  const pageNumber = Number(pageParams.page);

  // 表示対象のポケモン総数
  const totalPokemonCount = 1025;

  // 1ページに表示するポケモン数
  const pokemonPerPage = 30;

  // 全ページ数を計算
  const totalPages = Math.ceil(
    totalPokemonCount / pokemonPerPage
  );

  // pageがない場合や不正な値の場合は1ページ目を表示
  const requestedPage =
    Number.isInteger(pageNumber) && pageNumber > 0
      ? pageNumber
      : 1;

  // 1未満や最終ページより大きいページ番号にならないようにする
  const currentPage = Math.min(
    Math.max(requestedPage, 1),
    totalPages
  );

  // APIで何匹目から取得するか計算
  const offset = (currentPage - 1) * pokemonPerPage;

  // 現在のページで残っているポケモン数
  const remainingPokemonCount =
    totalPokemonCount - offset;

  // 最終ページでは残っている数だけ取得する
  const currentPagePokemonCount = Math.min(
    pokemonPerPage,
    remainingPokemonCount
  );

  // 前後のページ番号
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;

  // 開発時、中身確認用
  // console.log("現在のページは", currentPage);
  // console.log("取得開始位置は", offset);
  // console.log("今回取得する件数は", currentPagePokemonCount);
  // console.log("全部のページ数は", totalPages);

  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  //pokeAPI（一般に公開されているポケモンの膨大なデータの元）に接続(fetch)して30件ずつ取得。取得したデータをdataに格納
  //取得した30匹分のポケモンのデータ（nameと詳細データへのアクセスさきのurl）はapiPokemonsに入れる。
  //offsetを使い、現在のページに応じて取得開始位置を変更する
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${currentPagePokemonCount}&offset=${offset}`
  ); //pokeAPIから現在のページに表示するポケモンを取得する

  const data = await response.json(); //取得したデータをjavascriptで使えるように変換しdataに入れる

  // console.log("dataは", data); //開発時、中身確認用

  const apiPokemons: apiPokemon[] = data.results; // dataのresultsから名前と詳細URLを取り出し、apiPokemonsに入れる

  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  //1匹分のポケモンのurlをapiPokemonsからmap(対応付けるの意)で取得。1匹あたりのポケモンのデータは仮でpokemonとする。
  //pokemonUrlにこの処理を格納
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃

  const pokemonUrl = apiPokemons.map((pokemon) => {
    return pokemon.url;
  });

  //console.log(pokemonUrl);

  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  // 30匹分のURLから1匹分ず取り出しpokemonDetailResultsとする
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃

  const pokemonsDetails = pokemonUrl.map(async (url) => {
    const detailPokemonData = await fetch(url);
    const pokemonDetail = await detailPokemonData.json();

    //console.log("ポケモン1匹あたりの詳細データは：", pokemonDetail);

    return pokemonDetail;
  });

  const pokemonDetailsResults = await Promise.all(
    pokemonsDetails
  );

  // console.log("ポケモンの30匹分の詳細データから画像URLを取得、1匹目の画像のURLは", pokemonDetailsResults[0].sprites.other["official-artwork"].front_default);
  //console.log("1匹目の詳細データははこれ", pokemonDetailsResults[0], "だよ");

  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  // ポケモンのタイプについて
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃

  //console.log("1匹目のポケモンのタイプのひとつめは", pokemonDetailsResults[0].types[0].type.name, "です");

  const pokemonAllDetailTypesUrls =
    pokemonDetailsResults.map((pokemonDetailData) => {
      const pokemonTypeUrls =
        pokemonDetailData.types.map(
          (
            pokemonTypeData: {
              type: {
                name: string;
                url: string;
              };
            }
          ) => {
            const pokemonTypeUrl =
              pokemonTypeData.type.url; //１，まずタイプ１件分からURLを取り出す

            // console.log("タイプのURLは", pokemonTypeUrl);

            return pokemonTypeUrl; //２，１件分のタイプURLをmapの結果として返す
          }
        );

      return pokemonTypeUrls;
    });

  //console.log("ポケモンのタイプURLはこれ", pokemonAllDetailTypesUrls, "です");

  const responcePokemonAllTypesDetailUrl =
    pokemonAllDetailTypesUrls.map(
      async (pokemonTypeUrls) => {
        const pokemonTypes = pokemonTypeUrls.map(
          async (pokemonTypeUrl: string) => {
            const responcePokemonTypeUrl =
              await fetch(pokemonTypeUrl);

            return await responcePokemonTypeUrl.json();
          }
        );

        return await Promise.all(pokemonTypes);
      }
    );

  const pokemonTypesResults = await Promise.all(
    responcePokemonAllTypesDetailUrl
  );

  //console.log("ポケモンのタイプは", pokemonTypesResults, "です");

  const pokemonsJaTypes = pokemonTypesResults.map(
    (pokemonJaTypes) => {
      const pokemonJaTypeData = pokemonJaTypes.map(
        (pokemonJaType) => {
          const pokemonJaTypeName =
            pokemonJaType.names.find(
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

          // 日本語タイプがない場合に表示する文字
          if (!pokemonJaTypeName) {
            return "タイプ未取得";
          }

          return pokemonJaTypeName.name;
        }
      );

      return pokemonJaTypeData;
    }
  );

  // console.log("ポケモンの1匹目のタイプは", pokemonsJaTypes); //ポケモンのタイプ日本語で表示

  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  //ポケモンを日本語名で取得
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃

  //console.log("ポケモンの日本語名がある詳細データは", pokemonDetailsResults[0].species.url, "です");

  const pokemonSpeciesUrls =
    pokemonDetailsResults.map(
      (pokemonSpeciesUrlData) => {
        const pokemonSpeciesUrl =
          pokemonSpeciesUrlData.species.url;

        return pokemonSpeciesUrl;
      }
    );

  //console.log("ポケモンのSpeciesのURLは", pokemonSpeciesUrls);

  const responsePokemonSpeciesUrls =
    pokemonSpeciesUrls.map(async (speciesUrl) => {
      const pokemonSpeciesUrl = await fetch(speciesUrl);
      const pokemonSpeciesData =
        await pokemonSpeciesUrl.json();

      //console.log("ポケモンのSpeciesのデータは", pokemonSpeciesData);

      return pokemonSpeciesData;
    });

  const pokemonSpeciesDataResults = await Promise.all(
    responsePokemonSpeciesUrls
  );

  //console.log("speciesの詳細データは", pokemonSpeciesDataResults);

  const pokemonJaNames = pokemonSpeciesDataResults.map(
    (pokemonJaName) => {
      const pokemonJaNameData =
        pokemonJaName.names.find(
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

      // 日本語名が存在しない場合は英語名を表示する
      if (!pokemonJaNameData) {
        return "名前未取得";
      }

      return pokemonJaNameData.name;
    }
  );

  //console.log("ポケモンのJaNameは", pokemonJaNames);

  //##########################################################
  // ポケモンの説明文を取得
  //###########################################################

  const pokemonDescriptions =
    pokemonSpeciesDataResults.map(
      (pokemonDescriptionData) => {
        const pokemonDescription =
          pokemonDescriptionData.flavor_text_entries.find(
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

        // 日本語の説明文がない場合に表示する文章
        if (!pokemonDescription) {
          return "日本語の説明文は未取得です。";
        }

        return pokemonDescription.flavor_text
          .replace(/\n/g, " ")
          .replace(/\f/g, " ");
      }
    );

  // console.log("ポケモンの説明文", pokemonDescriptions);

  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  //ポケモンの画像のデータ
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃

  const pokemonImages = pokemonDetailsResults.map(
    (pokemonImageData) => {
      const pokemonImage =
        pokemonImageData.sprites.other[
          "official-artwork"
        ].front_default;

      //console.log("ポケモンの画像データは", pokemonImage);

      // 公式画像がない場合は通常画像を使用する
      if (!pokemonImage) {
        return pokemonImageData.sprites.front_default;
      }

      return pokemonImage;
    }
  );

  // ページ番号の配列を作成
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Header部分 */}
      <h1 className="text-3xl font-bold text-center mb-8">
        ポケモン図鑑
      </h1>

      {/* Main部分 */}

      {/* 現在のページ情報 */}
      <div className="text-center mb-5">
        <p className="font-bold">
          {currentPage} / {totalPages} ページ
        </p>

        <p className="text-sm text-gray-500 mt-1">
          図鑑番号 {offset + 1} 〜{" "}
          {Math.min(
            offset + currentPagePokemonCount,
            totalPokemonCount
          )}
        </p>
      </div>

      {/* ポケモンのカード表示するエリア全体 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-300 mx-auto">
        {/*ポケモンのそれぞれの番号を取得する############ */}
        {/* APIから取得したポケモンのURLを"/"ごとに分解しurlPartsとする */}
        {apiPokemons.map((pokemon, index) => {
          const urlParts = pokemon.url.split("/");

          //console.log("1匹あたりのポケモンのURLを分解したものはこれ：" + urlParts);

          //urlPartsの中の配列の後ろから2番目のもの（番号）を取得し、pokemonNumberとする
          const pokemonNumber =
            urlParts[urlParts.length - 2];

          // ############################################

          // ############################################
          //return の先はポケモン1匹あたりのカードの表示部分
          return (
            //######################
            // ポケモンのカード単体
            // keyはReact1枚ずつに対するReactへの目印
            //######################
            <Link
              key={pokemon.url}
              href={`/pokemon/${pokemonNumber}`}
              className="block h-full"
            >
              <div className="h-full border p-3 rounded-lg bg-white shadow-sm hover:bg-gray-100 hover:shadow-md cursor-pointer flex flex-col">
                {/* ポケモンの画像 */}
                <div className="h-44 mb-2 flex justify-center items-center">
                  {pokemonImages[index] ? (
                    <img
                      src={pokemonImages[index]}
                      alt={pokemon.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-sm text-gray-400">
                      画像未取得
                    </div>
                  )}
                </div>

                {/* ポケモンの番号・名前・タイプ */}
                <div className="flex items-center justify-center gap-4 mb-2">
                  {/* ポケモンの図鑑番号 */}
                  <div className="text-gray-600">
                    #{pokemonNumber}
                  </div>

                  {/* ポケモンの名前 */}
                  <div className="font-bold text-lg">
                    {pokemonJaNames[index]}
                  </div>

                  {/* ポケモンのタイプ */}
                  <div>
                    {pokemonsJaTypes[index].join("・")}
                  </div>
                </div>

                {/* ポケモンの説明文 */}
                <div className="text-sm border rounded px-3 py-2 w-full leading-5 bg-gray-50 h-21 overflow-hidden flex items-center">
                  <p className="w-full text-left">
                    {pokemonDescriptions[index]}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ページネーション */}
      <nav
        aria-label="ポケモン一覧のページ切り替え"
        className="w-full max-w-300 mx-auto mt-10"
      >
        {/* 前へ・次へボタン */}
        <div className="flex items-center justify-center gap-4 mb-5">
          {/* 1ページ目以外で前へボタンを表示 */}
          {currentPage > 1 ? (
            <Link
              href={`/?page=${previousPage}`}
              className="border border-red-300 rounded-lg bg-white px-5 py-2 font-bold text-red-600 hover:bg-red-50"
            >
              ← 前へ
            </Link>
          ) : (
            <span className="border border-gray-200 rounded-lg bg-gray-100 px-5 py-2 text-gray-400">
              ← 前へ
            </span>
          )}

          {/* 現在のページ */}
          <span className="font-bold">
            {currentPage} / {totalPages}
          </span>

          {/* 最終ページ以外で次へボタンを表示 */}
          {currentPage < totalPages ? (
            <Link
              href={`/?page=${nextPage}`}
              className="border border-red-300 rounded-lg bg-white px-5 py-2 font-bold text-red-600 hover:bg-red-50"
            >
              次へ →
            </Link>
          ) : (
            <span className="border border-gray-200 rounded-lg bg-gray-100 px-5 py-2 text-gray-400">
              次へ →
            </span>
          )}
        </div>

        {/* ページ番号 */}
        <div className="flex flex-wrap justify-center gap-2">
          {pageNumbers.map((page) => {
            return (
              <Link
                key={page}
                href={`/?page=${page}`}
                aria-current={
                  currentPage === page ? "page" : undefined
                }
                className={
                  currentPage === page
                    ? "flex h-9 w-9 items-center justify-center rounded-full border border-red-600 bg-red-600 font-bold text-white"
                    : "flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white hover:border-red-400 hover:bg-red-50"
                }
              >
                {page}
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

