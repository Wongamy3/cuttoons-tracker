import { Link } from 'react-router-dom'

export default function About() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-8">
      <h1 className="font-comic text-4xl text-black">About CutToons</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
        <p>
          Hi, we're Jeremy Flores and Amy Wong — two San Antonio locals who started CutToons during Covid,
          just as something fun to do with our hands. What began as a hobby slowly grew into a real
          business, and we still love every bit of it today.
        </p>
        <p>
          Jeremy's been artistic since he was a kid, always drawn to painting, while Amy grew up into
          woodworking. Put the two together and it turned out to be the perfect combination — Jeremy's
          artwork, brought to life on pieces Amy helps shape and cut.
        </p>
        <p>
          The name CutToons actually comes from Amy's dad. English was his second language, and he'd
          always say "cuttoons" instead of "cartoons" — it stuck with her, and felt like the perfect name
          once this hobby became something more.
        </p>
        <p>
          Jeremy's favorite pieces to create are anime and TV characters. He grew up watching anime, and
          Dragon Ball Z was always his favorite — it's a big reason why so much of our work leans anime. He
          loves how unique, diverse, and culturally rich the art style is.
        </p>
        <p>
          Every piece still starts with your idea — a photo, a favorite character, a memory you want to
          hold onto. We hand-draw the design, project it onto a medium-density fiberboard (MDF) panel, cut
          it to shape with a jigsaw, and add detailed edge work with a router. From there it's hand-painted
          in acrylic and finished with a glossy, durable coat of epoxy — so every commission really is one
          of a kind.
        </p>
        <p>
          We both still have our regular jobs, but CutToons is something we get to do together, just for
          the love of it. Jeremy especially loves bringing people's ideas to life — creating pieces that
          are meaningful, have a story behind them, and getting to share his artwork with others.
        </p>
        <p>
          Interested in a custom commission?{' '}
          <Link to="/contact" className="font-semibold text-comic-600 underline underline-offset-2">
            Reach out
          </Link>{' '}
          — we'd love to bring your idea to life.
        </p>
      </div>
    </main>
  )
}
