import React from 'react'
import SketchBrowser from '../experiments/sketch-browser'
import Footer from '../components/footer'

// TODO: Ensure this doesn't keep adding scripts on multiple page visits
const loadP5 = () =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script')
    document.body.appendChild(script)
    script.onload = resolve
    script.onerror = reject
    script.async = true
    script.src = 'https://cdn.jsdelivr.net/npm/p5@1.0.0/lib/p5.js'
  })

const ExperimentsPage = () => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    loadP5().then(() => {
      setMounted(true)
    })
  }, [setMounted])

  if (!mounted) {
    return <p>loading...</p>
  }

  return (
    <>
      <SketchBrowser />
      <Footer />
    </>
  )
}

export default ExperimentsPage
