import Link from 'next/link'
import Layout from '../components/Layout'

const IndexPage = () => (
  <Layout title="Eureka">

    <div className="App">
    <h1>Eureka</h1>
    <Link href="/game">Start a new game</Link>
    </div>
  </Layout>
)

export default IndexPage
