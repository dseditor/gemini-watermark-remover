import { useRef } from 'react'

function UploadArea({ onFilesSelected, t }) {
  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onFilesSelected(files)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('dragover')
    const files = Array.from(e.dataTransfer.files || [])
    if (files.length > 0) {
      onFilesSelected(files)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('dragover')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragover')
  }

  return (
    <div className="max-w-4xl mx-auto glass rounded-2xl p-2 md:p-3 border border-cyan-500/30">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="upload-glow group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-cyan-400/50 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 hover:border-cyan-300 transition-all cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="w-16 h-16 glass rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-cyan-400/30">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M 22.498 20.365 L 22.498 4.247 C 22.498 2.983 21.461 1.946 20.197 1.946 L 4.079 1.946 C 2.815 1.946 1.778 2.983 1.778 4.247 L 1.778 20.365 C 1.778 21.629 2.815 22.666 4.079 22.666 L 20.197 22.666 C 21.461 22.666 22.498 21.629 22.498 20.365 Z M 8.111 14.032 L 10.987 17.483 L 15.014 12.306 L 20.197 19.214 L 4.079 19.214 L 8.111 14.032 Z" fill="currentColor"></path>
            </svg>
          </div>
          <p className="mb-2 text-lg font-medium text-cyan-200">{t('upload.text')}</p>
          <p className="text-sm text-cyan-300/60">{t('upload.hint')}</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}

export default UploadArea
