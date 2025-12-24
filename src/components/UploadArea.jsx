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
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-soft p-2 md:p-3 border border-emerald-100">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-400 transition-all cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M 22.498 20.365 L 22.498 4.247 C 22.498 2.983 21.461 1.946 20.197 1.946 L 4.079 1.946 C 2.815 1.946 1.778 2.983 1.778 4.247 L 1.778 20.365 C 1.778 21.629 2.815 22.666 4.079 22.666 L 20.197 22.666 C 21.461 22.666 22.498 21.629 22.498 20.365 Z M 8.111 14.032 L 10.987 17.483 L 15.014 12.306 L 20.197 19.214 L 4.079 19.214 L 8.111 14.032 Z" fill="currentColor"></path>
            </svg>
          </div>
          <p className="mb-2 text-lg font-medium text-gray-700">{t('upload.text')}</p>
          <p className="text-sm text-gray-400">{t('upload.hint')}</p>
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
