import { fetchWithEvolution } from './src/services/evolution'

async function run() {
  const data = await fetchWithEvolution(`/instance/fetchInstances`, {
    method: 'GET'
  })
  console.log(JSON.stringify(data, null, 2))
}
run().catch(console.error)
