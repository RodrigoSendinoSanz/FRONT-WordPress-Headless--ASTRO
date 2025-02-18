const domain = import.meta.env.PUBLIC_WP_DOMAIN; // Deberías usar PUBLIC_WP_DOMAIN
const apiURL = `${domain}wp-json/wp/v2`;

export const getPageInfo = async (slug: string) => {
    const response = await fetch(`${apiURL}/pages?slug=${slug}`)

    if(!response.ok) throw new Error("Falied to fetch page info")

    const [data] = await response.json()
    const { title: { rendered: title}, content: {rendered: content} } = data
    
    return { title, content }
};

export const getAllPostsSlugs = async () => {
    const response = await fetch(`${apiURL}/posts?per_page=100`)
    if(!response.ok) throw new Error("Falied to fetch all posts")

    const results = await response.json()
    if(!results.length) throw new Error("No posts found")

    const slugs = results.map((post) => post.slug)
    return slugs
}

export const getPostInfo = async (slug: string) => {
    const response = await fetch(`${apiURL}/posts?slug=${slug}`)

    if(!response.ok) throw new Error("Falied to fetch page info")

    const [data] = await response.json()
    const { title: { rendered: title}, content: {rendered: content}, yoast_head_json: seo } = data
    
    return { title, content, seo }
};

export const getLastestPost =  async ({ perPage = 10 }: {perPage?: number } = {}) => {
    const response = await fetch(`${apiURL}/posts?per_page=${perPage}&_embed`)

    if(!response.ok) throw new Error("Falied to fetch page info")

    const results = await response.json()
    if(!results.length) throw new Error("No posts found")

    const posts = results.map(post => {
         const { 
          title: { rendered: title},
          excerpt: {rendered: excerpt}, 
          content: {rendered: content},
          date,
          slug
         } = post

         const featuredImage = post._embedded['wp:featuredmedia'][0].source_url

        // const title = post.title.rendered
        // const excerpt = post.excerpt.rendered
        // const content = post.content.rendered
        // const { date, slug } = post

        return { title, excerpt, content, date, slug, featuredImage }
    })

    return posts
}

