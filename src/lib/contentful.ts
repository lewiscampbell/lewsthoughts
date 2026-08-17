import { getCollection } from 'astro:content';

export interface BlogPost {
  title: string;
  slug: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  description: string;
  body: string;
  publishDate: Date;
  tags: string[];
}

interface ContentfulLink {
  sys: { id: string; type?: string; linkType?: string };
}

interface ContentfulAsset {
  sys: { id: string };
  fields?: {
    title?: string;
    file?: { url?: string };
  };
}

interface ContentfulPost {
  fields: {
    title: string;
    slug: string;
    heroImage?: ContentfulAsset | ContentfulLink;
    description: string;
    body: string;
    publishDate: string;
    tags?: string[];
  };
}

interface ContentfulCollection {
  items?: ContentfulPost[];
  includes?: { Asset?: ContentfulAsset[] };
  message?: string;
}

const DEFAULT_HERO = '/images/lew-in-hall.jpg';

function assetUrl(asset?: ContentfulAsset): string | undefined {
  const url = asset?.fields?.file?.url;
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

function resolveAsset(
  image: ContentfulAsset | ContentfulLink | undefined,
  assets: ContentfulAsset[],
): ContentfulAsset | undefined {
  if (!image) return undefined;
  if ('fields' in image && image.fields) return image;
  return assets.find((asset) => asset.sys.id === image.sys.id);
}

function mapBlogPost(entry: ContentfulPost, assets: ContentfulAsset[]): BlogPost {
  const { title, slug, heroImage, description, body, publishDate, tags } = entry.fields;
  const asset = resolveAsset(heroImage, assets);

  return {
    title,
    slug,
    heroImageUrl: assetUrl(asset) ?? DEFAULT_HERO,
    heroImageAlt: asset?.fields?.title ?? title,
    description,
    body,
    publishDate: new Date(publishDate),
    tags: tags ?? [],
  };
}

async function fetchContentfulPosts(params: Record<string, string>): Promise<BlogPost[]> {
  const space = import.meta.env.CONTENTFUL_SPACE_ID;
  const token = import.meta.env.CONTENTFUL_DELIVERY_TOKEN;

  if (!space || !token) {
    throw new Error('Missing Contentful environment variables');
  }

  const query = new URLSearchParams({
    content_type: 'blogPost',
    include: '2',
    ...params,
  });

  const response = await fetch(
    `https://cdn.contentful.com/spaces/${space}/environments/master/entries?${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  );

  const data = (await response.json()) as ContentfulCollection;

  if (!response.ok) {
    throw new Error(data.message || `Contentful request failed (${response.status})`);
  }

  const assets = data.includes?.Asset ?? [];
  return (data.items ?? []).map((item) => mapBlogPost(item, assets));
}

async function getLocalPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog');

  return posts
    .map((post) => ({
      title: post.data.title,
      slug: post.slug,
      heroImageUrl: post.data.heroImage ?? DEFAULT_HERO,
      heroImageAlt: post.data.heroAlt ?? post.data.title,
      description: post.data.description,
      body: post.body,
      publishDate: post.data.pubDate,
      tags: [post.data.tag],
    }))
    .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    return await fetchContentfulPosts({
      order: '-fields.publishDate',
    });
  } catch (error) {
    console.error('Contentful unavailable, using local posts:', error);
    return getLocalPosts();
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  try {
    const [post] = await fetchContentfulPosts({
      'fields.slug': slug,
      limit: '1',
    });
    if (post) return post;
  } catch (error) {
    console.error('Contentful unavailable, using local posts:', error);
  }

  return (await getLocalPosts()).find((post) => post.slug === slug);
}
