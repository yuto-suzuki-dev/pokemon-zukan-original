export default function SearchPage() {
  return (
    <>
      <h1 className="font-bold text-2xl text-center mt-5">
        ポケモン検索
      </h1>

      <div className="flex justify-center mt-8">
        <input
          type="text"
          placeholder="ポケモン名を入力"
          className="border rounded px-3 py-2 w-80"
        />
      </div>

      <div className="flex justify-center gap-4 mt-5">
        <button className="border rounded px-5 py-2 hover:bg-gray-100 cursor-pointer">
          検索
        </button>

        <button className="border rounded px-5 py-2 hover:bg-gray-100 cursor-pointer">
          一覧へ戻る
        </button>
      </div>
    </>
  );
}
