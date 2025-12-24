function LoadingOverlay({ show, text }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[60] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  )
}

export default LoadingOverlay
