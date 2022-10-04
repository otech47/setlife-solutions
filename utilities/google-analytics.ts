// log the pageview with their URL
export const pageview = (url: string) => {
    if (window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
            page_path: url,
        })
    }
}