import React from 'react';
import type { Post } from '../types';
import { Button } from './Button';

type Props = { posts: Post[]; referenceImage?: string; onUpdate: (post: Post) => void; onDelete: (id: string) => void };

export const PostList: React.FC<Props> = ({ posts, onUpdate, onDelete }) => {
  if (!posts.length) return <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">لا توجد منشورات في هذه الحملة.</div>;
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <article key={post.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">اليوم {post.day} · {post.status === 'published' ? 'منشور' : post.status === 'failed' ? 'فشل' : 'قيد الانتظار'}</div>
              <h4 className="mt-1 font-semibold text-gray-900">{post.title}</h4>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{post.content}</p>
              {!!post.hashtags?.length && <p className="mt-2 text-sm text-indigo-600">{post.hashtags.join(' ')}</p>}
              {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="mt-3 max-h-64 rounded-md object-contain" />}
            </div>
            <div className="flex gap-2">
              {post.status !== 'published' && <Button variant="secondary" onClick={() => onUpdate({ ...post, status: 'published' })}>تحديد كمنشور</Button>}
              <Button variant="danger" onClick={() => onDelete(post.id)}>حذف</Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
