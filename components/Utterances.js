import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'

/**
 * 评论插件
 * @param issueTerm
 * @param layout
 * @returns {JSX.Element}
 * @constructor
 */
const Utterances = ({ issueTerm, layout }) => {
  const { isDarkMode } = useGlobal()

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const anchor = document.getElementById('comments');
    if (!anchor) {
      return
    }
    const script = document.createElement('script');
    script.onload = () => setLoading(false);
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', true);
    script.setAttribute('repo', siteConfig('COMMENT_UTTERRANCES_REPO'));
    // Page id stays attached to the post if the title or slug changes.
    script.setAttribute('issue-term', issueTerm || 'pathname');
    // 初始主题
    script.setAttribute('theme', isDarkMode ? 'github-dark' : 'github-light');
    anchor.appendChild(script);

    return () => {
      script.remove()
      anchor.querySelector('iframe.utterances-frame')?.remove()
    };
  }, [issueTerm]);

  useEffect(() => {
    // 直接设置 iframe 的类来改变主题，不重新加载脚本
    const iframe = document.querySelector('iframe.utterances-frame');
    if (iframe) {
      iframe.contentWindow.postMessage({
        type: 'set-theme',
        theme: isDarkMode ? 'github-dark' : 'github-light'
      }, 'https://utteranc.es');
    }
  }, [isDarkMode]);

  return (
    <div id="comments" className='utterances'>
      {isLoading && (
        <div className="flex justify-center items-center m-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-400 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}

export default Utterances
