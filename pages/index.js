import styled from 'styled-components'
import Emphasis from '../components/Emphasis'
import SEO from '../components/SEO'

const Container = styled.div`
  box-sizing: content-box;
  max-width: 425px;
  padding: 5vh 10vw;
`

const Li = styled.li`
  margin-bottom: 0.5rem;
`

const P = styled.p`
  margin: 1.75rem 0;
  font-size: 1.5rem;
`

const LINKS = [
  { variant: 'pink', href: 'https://techbookclub.dev', name: 'newsletter' },
  { variant: 'blue', href: 'https://github.com/mgmarlow', name: 'open source' },
  { variant: 'yellow', href: 'https://mgmarlow.itch.io/', name: 'games' },
]

export default function Home() {
  return (
    <>
      <SEO title="mgmarlow.com" />

      <Container>
        <article>
          <P>
            I'm <strong>Graham Marlow</strong>, a software engineer who's spent
            too much time on the web.
          </P>

          <ul>
            {LINKS.map(({ variant, href, name, outbound = true }) => (
              <Li key={name}>
                <p>
                  <Emphasis href={href} variant={variant} outbound={outbound}>
                    {name}
                  </Emphasis>
                </p>
              </Li>
            ))}
          </ul>
        </article>
      </Container>
    </>
  )
}
