"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

// 地方の選択肢
type RegionKey =
  | "all"
  | "kanto"
  | "johto"
  | "hoenn"
  | "sinnoh"
  | "unova"
  | "kalos"
  | "alola"
  | "galar"
  | "hisui"
  | "paldea";

interface SearchPokemon {
  id: number;
  jaName: string;
  image: string;
}

interface SearchResponse {
  results: SearchPokemon[];
  count?: number;
  message?: string;
}

// 地方図鑑の選択肢
const regionOptions: {
  value: RegionKey;
  label: string;
}[] = [
  {
    value: "all",
    label: "すべての地方",
  },
  {
    value: "kanto",
    label: "カントー地方",
  },
  {
    value: "johto",
    label: "ジョウト地方",
  },
  {
    value: "hoenn",
    label: "ホウエン地方",
  },
  {
    value: "sinnoh",
    label: "シンオウ地方",
  },
  {
    value: "unova",
    label: "イッシュ地方",
  },
  {
    value: "kalos",
    label: "カロス地方",
  },
  {
    value: "alola",
    label: "アローラ地方",
  },
  {
    value: "galar",
    label: "ガラル地方",
  },
  {
    value: "hisui",
    label: "ヒスイ地方",
  },
  {
    value: "paldea",
    label: "パルデア地方",
  },
];

export default function SearchModal() {
  // 検索モーダルの開閉状態
  const [isOpen, setIsOpen] =
    useState(false);

  // 検索欄へ入力した文字
  const [keyword, setKeyword] =
    useState("");

  // 選択した地方図鑑
  const [
    selectedRegion,
    setSelectedRegion,
  ] = useState<RegionKey>("all");

  // 検索結果
  const [
    searchResults,
    setSearchResults,
  ] = useState<SearchPokemon[]>([]);

  // 検索結果の件数
  const [resultCount, setResultCount] =
    useState(0);

  // 検索中かどうか
  const [isLoading, setIsLoading] =
    useState(false);

  // 検索結果が存在しない場合などのメッセージ
  const [message, setMessage] =
    useState("");

  // Escapeキーでモーダルを閉じる
  useEffect(() => {
    const closeModalWithEscapeKey = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setKeyword("");
        setSelectedRegion("all");
        setSearchResults([]);
        setResultCount(0);
        setMessage("");
      }
    };

    window.addEventListener(
      "keydown",
      closeModalWithEscapeKey
    );

    return () => {
      window.removeEventListener(
        "keydown",
        closeModalWithEscapeKey
      );
    };
  }, []);

  // モーダルを開く
  const openModal = () => {
    setIsOpen(true);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setIsOpen(false);
    setKeyword("");
    setSelectedRegion("all");
    setSearchResults([]);
    setResultCount(0);
    setMessage("");
  };

  // ポケモンを検索
  const handleSearch = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      setSearchResults([]);
      setResultCount(0);
      setMessage(
        "ポケモン名を入力してください。"
      );

      return;
    }

    setIsLoading(true);
    setMessage("");
    setSearchResults([]);
    setResultCount(0);

    try {
      const response = await fetch(
        "/api/search",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            keyword: trimmedKeyword,
            region: selectedRegion,
          }),
        }
      );

      const data: SearchResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "検索に失敗しました。"
        );
      }

      const results =
        data.results ?? [];

      const count =
        data.count ?? results.length;

      setSearchResults(results);
      setResultCount(count);

      if (results.length === 0) {
        setMessage(
          "該当するポケモンが見つかりませんでした。"
        );
      }
    } catch (error) {
      console.error(
        "ポケモン検索エラー",
        error
      );

      setSearchResults([]);
      setResultCount(0);

      setMessage(
        error instanceof Error
          ? error.message
          : "検索中にエラーが発生しました。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 検索モーダルを開くボタン */}
      <button
        type="button"
        onClick={openModal}
        className="flex w-40 cursor-pointer items-center gap-3 rounded-lg border-2 border-white bg-white px-4 py-2 text-slate-500 shadow-sm hover:bg-red-50"
      >
        <span
          aria-hidden="true"
          className="text-xl"
        >
          🔍
        </span>

        <span className="font-bold">
          検索する
        </span>
      </button>

      {/* 検索モーダル */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onMouseDown={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-modal-title"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >
            {/* モーダル上部 */}
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="search-modal-title"
                className="text-2xl font-bold text-slate-800"
              >
                ポケモン検索
              </h2>

              <button
                type="button"
                onClick={closeModal}
                aria-label="検索モーダルを閉じる"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-300 text-xl text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            {/* 検索フォーム */}
            <form
              onSubmit={handleSearch}
              className="space-y-4"
            >
              {/* ポケモン名 */}
              <div>
                <label
                  htmlFor="pokemon-search-keyword"
                  className="mb-2 block font-bold text-slate-700"
                >
                  ポケモン名
                </label>

                <input
                  id="pokemon-search-keyword"
                  type="text"
                  value={keyword}
                  onChange={(event) => {
                    setKeyword(
                      event.target.value
                    );
                  }}
                  placeholder="例）ピカチュウ、カヌチャン"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  autoFocus
                />
              </div>

              {/* 地方図鑑選択 */}
              <div>
                <label
                  htmlFor="pokemon-search-region"
                  className="mb-2 block font-bold text-slate-700"
                >
                  地方図鑑で絞り込む
                </label>

                <select
                  id="pokemon-search-region"
                  value={selectedRegion}
                  onChange={(event) => {
                    setSelectedRegion(
                      event.target
                        .value as RegionKey
                    );
                  }}
                  className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                >
                  {regionOptions.map(
                    (regionOption) => {
                      return (
                        <option
                          key={
                            regionOption.value
                          }
                          value={
                            regionOption.value
                          }
                        >
                          {
                            regionOption.label
                          }
                        </option>
                      );
                    }
                  )}
                </select>
              </div>

              {/* 検索ボタン */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                {isLoading
                  ? "検索中..."
                  : "検索"}
              </button>
            </form>

            {/* メッセージ */}
            {message && (
              <p className="mt-6 text-center text-slate-500">
                {message}
              </p>
            )}

            {/* 検索結果の件数 */}
            {searchResults.length > 0 && (
              <p className="mt-6 font-bold text-slate-700">
                {resultCount}
                件見つかりました
              </p>
            )}

            {/* 検索結果 */}
            {searchResults.length > 0 && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {searchResults.map(
                  (pokemon) => {
                    return (
                      <Link
                        key={pokemon.id}
                        href={`/pokemon/${pokemon.id}`}
                        onClick={
                          closeModal
                        }
                        className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-red-300 hover:bg-red-50"
                      >
                        {/* ポケモンの画像 */}
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center">
                          <img
                            src={
                              pokemon.image
                            }
                            alt={
                              pokemon.jaName
                            }
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* ポケモンの名前と番号 */}
                        <div>
                          <p className="text-sm text-slate-500">
                            #
                            {String(
                              pokemon.id
                            ).padStart(
                              4,
                              "0"
                            )}
                          </p>

                          <p className="mt-1 text-lg font-bold text-slate-800">
                            {
                              pokemon.jaName
                            }
                          </p>
                        </div>
                      </Link>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
