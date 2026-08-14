import * as contentful from 'contentful';
import type { Asset, Entry, EntrySkeletonType } from 'contentful';

export interface BlogPostFields {
  title: string;
  slug: string;
  heroImage?: Asset;
  description: string;
  body: string;
  author?: Entry<EntrySkeletonType>;
  publishDate: string;
  tags?: string[];
}

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

type BlogPostEntry = Entry<EntrySkeletonType<BlogPostFields>, undefined, 'blogPost'>;

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
});

const DEFAULT_HERO = '/images/lew-in-hall.jpg';

function assetUrl(asset?: Asset): string | undefined {
  const url = asset?.fields?.file?.url;
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

function assetAlt(asset: Asset | undefined, fallback: string): string {
  return (asset?.fields?.title as string | undefined) ?? fallback;
}

export function mapBlogPost(entry: BlogPostEntry): BlogPost {
  const { title, slug, heroImage, description, body, publishDate, tags } = entry.fields;

  return {
    title,
    slug,
    heroImageUrl: assetUrl(heroImage) ?? DEFAULT_HERO,
    heroImageAlt: assetAlt(heroImage, title),
    description,
    body,
    publishDate: new Date(publishDate),
    tags: tags ?? [],
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { items } = await contentfulClient.getEntries<BlogPostFields>({
    content_type: 'blogPost',
    order: ['-fields.publishDate'],
    include: 2,
  });

  return items.map(mapBlogPost);
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const { items } = await contentfulClient.getEntries<BlogPostFields>({
    content_type: 'blogPost',
    'fields.slug': slug,
    include: 2,
    limit: 1,
  });

  const entry = items[0];
  return entry ? mapBlogPost(entry) : undefined;
}
