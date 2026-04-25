import { Nav } from '@/components/Nav'
import { WordmarkIntro } from '@/components/WordmarkIntro'
import { getProducts } from '@/lib/kv'
import { HomeClient } from './HomeClient'

export default async function Home() {
  const products = await getProducts()

  return (
    <>
      <WordmarkIntro />
      <Nav />
      <HomeClient products={products} />
    </>
  )
}
