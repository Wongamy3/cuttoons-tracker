import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function ChevronIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

const PAYMENT_METHODS = ['Cash', 'Cash App', 'Apple Pay']

const faqs = [
  {
    question: 'How are your pieces created?',
    answer: (
      <p>
        Every piece starts as a hand-drawn design on iPad. We project that design onto a medium-density
        fiberboard (MDF) panel to keep everything perfectly proportioned, then cut it out with a jigsaw
        and add detailed edge work with a router. From there, it's hand-painted with acrylic and finished
        with a glossy, durable coat of epoxy. You can watch the whole process in action on our{' '}
        <Link to="/about" className="font-semibold text-comic-600 underline underline-offset-2">
          About page
        </Link>
        , where we've got a timelapse of a piece coming together start to finish.
      </p>
    ),
  },
  {
    question: 'Can I send my own photo or idea for the painting?',
    answer: (
      <p>
        Absolutely! When you reach out, you can share a photo, character, or idea you'd like brought to
        life, along with any reference images — the more details you give us, the closer we can get your
        piece to the vision in your head.
      </p>
    ),
  },
  {
    question: 'How does pricing work?',
    answer: (
      <p>
        A 1ft piece is typically $50. From 2ft up to 8ft, pricing works out to about $100 per foot. Every
        piece gets the same level of care and detail no matter the size — the price increase simply
        reflects the extra materials, like epoxy, and time that larger pieces take.
      </p>
    ),
  },
  {
    question: 'Do you require payment up front?',
    answer: (
      <p>
        Just a deposit to get started — it reserves your spot in the queue and covers materials. The
        remaining balance isn't due until your piece is finished.
      </p>
    ),
  },
  {
    question: 'What payment methods do you accept?',
    answer: (
      <>
        <p>We accept the following for commissions and purchases:</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="font-comic rounded-full bg-comic-500 px-3 py-1.5 text-sm tracking-wide text-white shadow-sm">
            Square — Preferred
          </span>
          {PAYMENT_METHODS.map((method) => (
            <span
              key={method}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-black"
            >
              {method}
            </span>
          ))}
        </div>
      </>
    ),
  },
  {
    question: 'How long do custom orders take?',
    answer: (
      <p>
        Turnaround depends on how many orders are ahead of yours — you can check our current queue on the{' '}
        <Link to="/contact" className="font-semibold text-comic-600 underline underline-offset-2">
          Contact Us
        </Link>{' '}
        page. Feel free to send us a message for a more specific estimate.
      </p>
    ),
  },
  {
    question: 'Do you ship paintings, or is pickup only?',
    answer: (
      <p>
        Both! You're welcome to pick up locally in San Antonio, or we can ship your finished piece to you
        — just let us know your preference when you place your order.
      </p>
    ),
  },
  {
    question: 'Do the pieces come with hardware to hang?',
    answer: (
      <p>
        Yes! Every painting comes ready to hang. Depending on the size and weight, we'll attach either a
        French cleat or sawtooth hangers so installation is quick and secure.
      </p>
    ),
  },
  {
    question: 'Can I add other custom touches to my piece?',
    answer: (
      <p>
        Definitely! A few popular options are a wood frame around square or rectangular pieces, epoxy
        poured over a signature or small keepsake you'd like preserved inside the piece, or other
        hardware you have in mind — just let us know what you're envisioning and we'll make it happen.
      </p>
    ),
  },
  {
    question: 'Can you add lights?',
    answer: (
      <p>
        Yes! For an additional fee, we can install color-changing LED lights to make your piece really
        stand out.
      </p>
    ),
  },
]

export default function FAQ() {
  const [openIndexes, setOpenIndexes] = useState(() => new Set())
  const itemRefs = useRef([])

  function toggle(i) {
    setOpenIndexes((cur) => {
      const next = new Set(cur)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  function jumpTo(i) {
    setOpenIndexes((cur) => new Set(cur).add(i))
    requestAnimationFrame(() => {
      itemRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-8">
      <h1 className="font-comic text-4xl text-black">FAQs</h1>
      <p className="mt-2 text-sm text-slate-600">Answers to the questions we hear most often.</p>

      <nav className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="font-comic text-sm tracking-wide text-slate-500">Jump to a question</p>
        <ul className="mt-2 space-y-1.5">
          {faqs.map((faq, i) => (
            <li key={faq.question}>
              <button
                type="button"
                onClick={() => jumpTo(i)}
                className="text-left text-sm font-medium text-comic-600 underline underline-offset-2"
              >
                {faq.question}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndexes.has(i)
          return (
            <div
              key={faq.question}
              ref={(el) => (itemRefs.current[i] = el)}
              className="scroll-mt-24 rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 text-left"
              >
                <h2 className="font-comic text-xl text-black">{faq.question}</h2>
                <ChevronIcon
                  className={'h-5 w-5 flex-shrink-0 text-slate-400 transition duration-150 ' + (isOpen ? 'rotate-180' : '')}
                />
              </button>
              {isOpen && <div className="mt-1.5 text-sm leading-relaxed text-slate-600">{faq.answer}</div>}
            </div>
          )
        })}
      </div>
    </main>
  )
}
