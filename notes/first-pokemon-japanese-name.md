 //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  //ポケモンを日本語名で取得
  //＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
  //console.log("ポケモンの日本語名がある詳細データは",pokemonDetailsResults[0].species.url,"です");
  const responceDetailUrl = await fetch(pokemonDetailsResults[0].species.url);
  const detailUrlData = await responceDetailUrl.json();
  //console.log("フェッチした詳細なデータはこれ",detailUrlData,"です");
  //console.log("フェッチした詳細なデータのnamesを表示します。中身は",detailUrlData.names,"です");
  const jaPokemonName = detailUrlData.names.find((nameData: {language:{name: string};name: string}) => {
    return nameData.language.name === "ja"
  });
  console.log("ポケモンの日本語名を取得した！ポケモンの名前は",jaPokemonName.name,"だった");
