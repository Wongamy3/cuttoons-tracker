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
