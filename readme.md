function read() {
  const file = fs.readFileSync(DB_PATH);
  return JSON.parse(file);
}

function save(data) {
  const file = fs.writeFileSync(DB_PATH, JSON.stringify(data));
}