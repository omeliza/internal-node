const { createHash } =  require("crypto");

process.on('message', (data) => {
  const hash = generateHash(data.value);
  // process.send(hash);
})

function generateHash(el) {
  const hash = createHash('sha256').update(String(el));
  return hash.digest('hex')
}