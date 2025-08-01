import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { GetServerSidePropsContext } from 'next'
import { Liquid } from 'liquidjs'
import { useRouter } from 'next/router'

import layoutLiquid from '../themes/_layout.liquid'
import templateLiquid from '../themes/page_content.liquid'
import { title } from 'process'
import mockData from '../mocks/mock-data'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { } = context;

  const engine = new Liquid()
  const html = await engine.parseAndRender(layoutLiquid, {
    title,
    is_pre_rendered: true,
    page_content: '<div id="dynamic-content"></div>'
  })

  return {
    props: {
      layoutHTML: html,
    }
  }
}

const engine = new Liquid()

export default function ProductPage({
  layoutHTML,
}: { layoutHTML: string }) {
  const router = useRouter()

  const [slug, setSlug] = useState(router.query.slug as string)
  const [htmlContent, setHtmlContent] = useState('')

  const changeSlug = (newSlug: string) => {
    window.history.pushState(null, '', `/${newSlug}`);
    setSlug(newSlug);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('img.product-item')) {
        e.preventDefault();

        const newSlug = target.dataset.slug;
        if (newSlug) {
          changeSlug(newSlug);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const dynamicCntent = document.getElementById('dynamic-content')
    if (dynamicCntent) {
      dynamicCntent.innerHTML = htmlContent;
    }
  }, [htmlContent])

  useEffect(() => {
    setHtmlContent('loading...')
    Promise.resolve(mockData.get(slug)).then((data) => {
      // setTimeout(() => {
        const ctx = {
          ...data,
          slug: slug,
        }

        engine.parseAndRender(templateLiquid, ctx).then((html) => {
          setHtmlContent(html)
        })
      // }, 1000)
    })
  }, [slug]);

  return (
    <div dangerouslySetInnerHTML={{ __html: layoutHTML }} />
  )
}
