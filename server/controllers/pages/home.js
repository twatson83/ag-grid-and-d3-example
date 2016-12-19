
export async function getHome(req, res) {
  res.sendFile(__dirname  + '/index.html')
}