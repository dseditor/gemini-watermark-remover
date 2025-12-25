function LoadingOverlay({ show, text }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 glass-dark backdrop-blur-md z-[60] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-cyan-400 mb-4" style={{
          filter: 'drop-shadow(0 0 10px rgba(0, 245, 255, 0.5))'
        }}></div>
        <p className="text-cyan-200 font-medium">{text}</p>
      </div>
    </div>
  )
}

export default LoadingOverlay
