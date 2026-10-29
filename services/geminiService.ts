import type { Post, ReferenceImageType } from '../types';

/**
 * Temporary local fallback so the app remains usable without shipping a private
 * Gemini API key to the browser. Connect a server-side generation endpoint here
 * to enable real AI content and image generation.
 */
export async function generateCampaignContent(
  title: string,
  topic: string,
  targetAudience: string,
  durationDays: number,
  postsPerDay: number,
  platforms: string[],
  _referenceImage?: string,
  _referenceImageType?: ReferenceImageType
): Promise<Post[]> {
  const count = Math.max(1, Math.min(30, Math.floor(durationDays))) *
    Math.max(1, Math.min(5, Math.floor(postsPerDay)));
  return Array.from({ length: count }, (_, index) => {
    const day = Math.floor(index / Math.max(1, postsPerDay)) + 1;
    return {
      id: `post-${Date.now()}-${index}`,
      day,
      title: `${title}: فكرة اليوم ${day} · ${(index % Math.max(1, postsPerDay)) + 1}`,
      content: `محتوى تجريبي حول «${topic}» موجّه إلى ${targetAudience || 'الجمهور العام'}. أضف نصًا موثوقًا ومراجعته قبل النشر.\n\nالمنصات المستهدفة: ${platforms.join('، ')}.`,
      hashtags: ['#محتوى', '#تسويق'],
      imagePrompt: `Illustration for ${topic}`,
      status: 'pending',
      scheduledTime: new Date(Date.now() + index * 86400000 / Math.max(1, postsPerDay)).toISOString()
    };
  });
}

export async function generatePostImage(_prompt: string, _referenceImage?: string): Promise<string | null> {
  // Intentionally no client-side API key: implement this via a protected server endpoint.
  return null;
}
