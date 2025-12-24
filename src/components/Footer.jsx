function Footer({ t }) {
  return (
    <footer className="bg-emerald-600 text-white py-6 md:pt-12 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h5 className="text-2xl font-bold mb-4">{t('header.title')}</h5>
            <p className="text-emerald-100 text-sm max-w-sm">
              {t('footer.desc')}
            </p>
          </div>
          <div>
            <h6 className="font-bold mb-2 md:mb-4 text-emerald-100">{t('footer.links')}</h6>
            <ul className="space-y-1 md:space-y-2 text-sm text-emerald-50">
              <li><a href="/terms.html" className="hover:text-white">{t('footer.terms')}</a></li>
              <li><a href="https://github.com/journey-ad/gemini-watermark-remover" target="_blank" className="hover:text-white">Github</a></li>
              <li><a href="/userscript/gemini-watermark-remover.user.js" target="_blank" className="hover:text-white">{t('nav.userscript')}</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-2 md:mb-4 text-emerald-100">{t('footer.tech')}</h6>
            <ul className="space-y-1 md:space-y-2 text-sm text-emerald-50">
              <li><a href="https://allenkuo.medium.com/removing-gemini-ai-watermarks-a-deep-dive-into-reverse-alpha-blending-bbbd83af2a3f" target="_blank" className="hover:text-white">{t('nav.principle')}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-emerald-500 pt-8 text-center text-sm text-emerald-200">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
