import { useEffect, useRef } from 'react'

// Traced from the original signature photo (potrace) so it can be animated
// as a genuine stroke draw-on, rather than just fading in a static image.
const SIGNATURE_PATH =
  'M 78.250 33.749 L 54 34.036 54 39.518 L 54 45 82.889 45 L 111.779 45 112.405 56.750 C 113.558 78.411, 117.140 187.699, 116.818 191.415 L 116.500 195.088 85 168.926 C 67.675 154.537, 51.597 141.196, 49.272 139.280 L 45.044 135.795 42.272 139.045 C 40.747 140.832, 39.172 142.847, 38.771 143.522 C 38.287 144.335, 51.518 155.934, 78.021 177.930 C 100.009 196.180, 118 211.709, 118 212.439 C 118 214.032, 121.630 214.855, 125.898 214.228 C 128.687 213.819, 129.012 213.406, 129.118 210.137 C 129.184 208.136, 129.183 206.160, 129.117 205.745 C 128.945 204.667, 126.026 126.158, 126.012 122.250 L 126 119 160.500 119 L 195 119 195 113.500 L 195 108 160.177 108 L 125.354 108 124.335 76.750 C 123.775 59.563, 123.400 45.383, 123.501 45.241 C 123.603 45.098, 139.731 44.687, 159.343 44.329 L 195 43.676 195 38.338 L 195 33 148.750 33.231 C 123.313 33.359, 91.588 33.592, 78.250 33.749 M 380.782 48.207 C 380.527 48.918, 374.509 82.462, 367.409 122.748 C 360.309 163.035, 354.275 195.981, 354 195.961 C 353.725 195.941, 346.111 184.016, 337.081 169.462 C 328.050 154.908, 320.314 143, 319.890 143 C 319.465 143, 318.835 143.457, 318.490 144.016 C 318.144 144.575, 317.420 144.759, 316.880 144.426 C 315.831 143.778, 311 148.434, 311 150.092 C 311 151.367, 284.689 195.950, 283.920 195.979 C 283.600 195.990, 272.647 166.188, 259.580 129.750 C 246.512 93.313, 235.663 63.340, 235.471 63.144 C 234.887 62.549, 225.594 66.332, 224.129 67.762 C 223.112 68.753, 192.099 208.188, 192.014 212.150 C 191.996 213.004, 201.949 215.384, 202.642 214.691 C 202.936 214.398, 205.828 201.905, 209.070 186.930 C 212.311 171.956, 215.084 159.585, 215.232 159.439 C 215.906 158.775, 256.575 157.189, 257.154 157.805 C 257.514 158.187, 262.412 171.392, 268.039 187.148 L 278.270 215.796 282 215.605 C 285.406 215.430, 289 213.262, 289 211.383 C 289 210.542, 318.282 160.923, 318.569 161.278 C 318.668 161.400, 326.467 173.875, 335.902 189 C 345.336 204.125, 353.380 216.467, 353.778 216.427 C 356.570 216.147, 363.136 212.159, 363.538 210.500 C 365.942 200.571, 391.897 49.513, 391.294 48.960 C 390.857 48.561, 388.418 47.937, 385.873 47.574 C 382.513 47.095, 381.120 47.268, 380.782 48.207 M 230.700 86.574 C 228.960 92.715, 217.739 147.073, 218.132 147.465 C 218.715 148.048, 251.900 146.433, 252.543 145.790 C 252.798 145.535, 248.111 131.674, 242.127 114.988 C 235.323 96.017, 231.042 85.370, 230.700 86.574'

export default function AnimatedSignature({ className }) {
  const strokeRef = useRef(null)
  const fillRef = useRef(null)

  useEffect(() => {
    const strokeEl = strokeRef.current
    const fillEl = fillRef.current
    if (!strokeEl || !fillEl) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      fillEl.style.opacity = '1'
      return
    }

    const length = strokeEl.getTotalLength()
    strokeEl.style.strokeDasharray = `${length}`
    strokeEl.style.strokeDashoffset = `${length}`
    fillEl.style.opacity = '0'
    // Force layout so the browser registers the starting state before transitioning.
    strokeEl.getBoundingClientRect()

    strokeEl.style.transition = 'stroke-dashoffset 1.6s ease'
    fillEl.style.transition = 'opacity 0.5s ease'
    fillEl.style.transitionDelay = '1.3s'

    requestAnimationFrame(() => {
      strokeEl.style.strokeDashoffset = '0'
      fillEl.style.opacity = '1'
    })
  }, [])

  return (
    <svg viewBox="0 0 442 259" className={className} role="img" aria-label="CutToons signature">
      <path ref={fillRef} d={SIGNATURE_PATH} fill="black" />
      <path
        ref={strokeRef}
        d={SIGNATURE_PATH}
        fill="none"
        stroke="black"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
