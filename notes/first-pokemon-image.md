# 1匹目のポケモン画像を取得する処理

一覧データの1匹目から詳細URLを取り出し、
詳細データから画像URLを取得する練習コード。

```ts
const firstPokemonUrl = apiPokemons[0].url; //まずは一匹目のポケモンのurlを取得し、firstPokemonUrlとする
console.log(firstPokemonUrl); //確認用、消してよい

const responceUrl = await fetch(firstPokemonUrl); //pokeAPIから１匹目のポケモンのURLを取得する
const detailData = await responceUrl.json(); //取得したデータをjavascriptで使えるように変換しdetailDataに入れる
console.log("１匹目のポケモンの詳細データは",detailData); //目視で画像のデータがどこにあるか確認する。確認用、消してよい
console.log("１匹目のポケモンの画像データは",detailData.sprites.other["official-artwork"].front_default); //// 確認した画像の階層から画像URLを取得する。確認用、消してよい

const firstPokemonImage = detailData.sprites.other["official-artwork"].front_default;//１匹目のポケモンの画像はfirstPokemonImageとする
console.log("１匹目のポケモン（フシギダネ）の画像は",firstPokemonImage);
```
