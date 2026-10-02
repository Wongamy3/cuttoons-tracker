import { Link } from 'react-router-dom'

const PAYMENT_METHODS = ['Cash', 'Cash App', 'Apple Pay']

const faqs = [
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
    question: 'Do you require payment up front?',
    answer: (
      <p>
        Just a deposit to get started — it reserves your spot in the queue and covers materials. The
        remaining balance isn't due until your piece is finished.
      </p>
    ),
  },
  {
    question: 'Do the pieces come with hardware to hang?',
    answer: (
      <p>
        Yes! Every painting comes ready to hang. Depending on the size and weight, we'll attach either a
        hanging track or sawtooth hangers so installation is quick and secure.
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
  {
    question: 'How long do custom orders take?',
    answer: (
      <p>
        Turnaround depends on how many orders are ahead of yours — you can check our current queue on the{' '}
        <Link to="/shop/contact" className="font-semibold text-comic-600 underline underline-offset-2">
          Contact Us
        </Link>{' '}
        page. Feel free to send us a message for a more specific estimate.
      </p>
    ),
  },
]

export default function FAQ() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-8">
      <h1 className="font-comic text-4xl text-black">FAQs</h1>
      <p className="mt-2 text-sm text-slate-600">Answers to the questions we hear most often.</p>

      <div className="mt-6 space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="font-comic text-xl text-black">{faq.question}</h2>
            <div className="mt-1.5 text-sm leading-relaxed text-slate-600">{faq.answer}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
