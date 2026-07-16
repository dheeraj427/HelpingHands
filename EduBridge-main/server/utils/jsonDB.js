const fs = require("fs");
const path = require("path");

const dataFolder = path.join(__dirname, "..", "data");

function getFile(fileName) {
  return path.join(dataFolder, fileName);
}

function read(fileName) {
  try {
    const file = getFile(fileName);

    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, "[]");
      return [];
    }

    const data = fs.readFileSync(file, "utf8");

    if (!data.trim()) return [];

    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err.message);
    return [];
  }
}

function write(fileName, data) {
  try {
    const file = getFile(fileName);

    fs.writeFileSync(
      file,
      JSON.stringify(data, null, 2),
      "utf8"
    );

    return true;
  } catch (err) {
    console.error(`Error writing ${fileName}:`, err.message);
    return false;
  }
}

function nextId(prefix, list) {
  if (!list.length) return `${prefix}-1001`;

  const numbers = list
    .map(item => {
      const parts = (item.trackingId || "").split("-");
      return Number(parts[parts.length - 1]);
    })
    .filter(n => !isNaN(n));

  const max = numbers.length ? Math.max(...numbers) : 1000;

  return `${prefix}-${max + 1}`;
}

module.exports = {
  read,
  write,
  nextId
};