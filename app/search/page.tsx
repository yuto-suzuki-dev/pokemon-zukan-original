"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

//＃＃＃＃＃＃＃＃＃＃
//データの定義部分
//＃＃＃＃＃＃＃＃＃＃

interface apiPokemon {
  name: string;
  url: string;
}

interface pokemonSpeciesName {
  language: {
    name: string;
  };
  name: string;
}

export default function SearchPage() {

  // 入力されたポケモン名を保存
  const [pokemonName, setPokemonName] = useState("");

  // 検索中かどうかを保存
  const [isLoading, setIsLoading] = useState(false);

  // エラーメッセージを保存
  const [errorMessage, setErrorMessage] = useState("");

  // 詳細画面へ移動するために使用
  const router = useRouter();

  // ポケモンを検索する処理
  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 入力欄の前後にある空白を削除
    const searchPokemonName = pokemonName.trim();

    // 未入力の場合は検索しない
    if (!searchPokemonName) {
      setErrorMessage("ポケモン名を入力してください");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {

      // 一覧画面と同じ30匹分のデータを取得
      const responce = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=30"
      );

      const data = await responce.json();
      const apiPokemons: apiPokemon[] = data.results;

      // 30匹分のSpeciesデータを取得
      const pokemonSpeciesData = apiPokemons.map(async (pokemon) => {
        const pokemonResponce = await fetch(pokemon.url);
        const pokemonDetail = await pokemonResponce.json();

        const speciesResponce = await fetch(pokemonDetail.species.url);
        const speciesData = await speciesResponce.json();

        // 日本語名を取得
        const pokemonJaName = speciesData.names.find(
          (nameData: pokemonSpeciesName) => {
            return nameData.language.name === "ja";
          }
        );

        return {
          id: pokemonDetail.id,
          englishName: pokemon.name,
          japaneseName: pokemonJaName.name,
        };
      });

      const pokemonSpeciesResults = await Promise.all(pokemonSpeciesData);

      // 入力された日本語名または英語名と一致するポケモンを探す
      const searchResult = pokemonSpeciesResults.find((pokemon) => {
        return (
          pokemon.japaneseName === searchPokemonName ||
          pokemon.englishName.toLowerCase() === searchPokemonName.toLowerCase()
        );
      });

      // 開発時、中身確認用
      // console.log("検索結果は", searchResult);

      // 一致するポケモンがない場合
      if (!searchResult) {
        setErrorMessage("該当するポケモンが見つかりませんでした");
        return;
      }

      // 該当するポケモンの詳細画面へ移動
      router.push(`/pokemon/${searchResult.id}`);

    } catch (error) {
      console.error("ポケモンの検索に失敗しました", error);
      setErrorMessage("検索中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="font-bold text-2xl text-center mt-5">
        ポケモン検索
      </h1>

      {/* ポケモン検索フォーム */}
      <form onSubmit={handleSearch}>

        <div className="flex justify-center mt-8">
          <input
            type="text"
            placeholder="ポケモン名を入力"
            value={pokemonName}
            onChange={(event) => setPokemonName(event.target.value)}
            className="border rounded px-3 py-2 w-80"
          />
        </div>

        {/* エラーメッセージ */}
        {errorMessage && (
          <p className="text-center mt-3">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-center gap-4 mt-5">
          <button
            type="submit"
            disabled={isLoading}
            className="border rounded px-5 py-2 hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? "検索中..." : "検索"}
          </button>

          <Link
            href="/"
            className="border rounded px-5 py-2 hover:bg-gray-100"
          >
            一覧へ戻る
          </Link>
        </div>

      </form>
    </>
  );
}
