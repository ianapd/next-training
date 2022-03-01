export default async function handler(req, res) {
  console.log("Revalidating...")
  let revalidated = false

  try {
    await res.unstable_revalidate('/')
    revalidated = true
  } catch (err) {
    console.log(err)
  }

  res.json({
    revalidated
  })
}