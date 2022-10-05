const queries = location.search.split("&");
for (let i = 0; i < queries.length; ++i) {
  const matches = queries[i].match(/theme=(.+)/);
  if (matches !== null && matches.length === 2 && matches[1] === "dark") {
    document.body.classList.add("bg-dark", "text-light");
    break;
  }
}
