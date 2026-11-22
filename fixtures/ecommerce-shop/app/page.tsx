export default function Shop() {
  return (
    <div className="p-6">
      <h1>Product Catalog</h1>
      <form>
        <input type="text" placeholder="Search catalog..." />
        <button type="submit" className="w-6 h-6 p-0.5 bg-gray-200">
          <svg className="w-4 h-4"><path d="M0 0h24v24H0z" /></svg>
        </button>
      </form>
    </div>
  );
}
