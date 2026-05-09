export default function HindiField({ label, hindiLabel, instruction, example, tip, children, required }) {
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN'
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-semibold text-gray-700">
          👉 {hindiLabel || label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <button type="button" onClick={() => speak(instruction || hindiLabel || label)}
          className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">
          🔊 Suno
        </button>
      </div>
      {instruction && <p className="text-xs text-gray-500 mb-1 italic">{instruction}</p>}
      {children}
      {example && <p className="text-xs text-green-600 mt-1">✅ Example: {example}</p>}
      {tip && <p className="text-xs text-orange-500 mt-1">💡 {tip}</p>}
    </div>
  )
}