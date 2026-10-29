import React from 'react';
import type { Campaign } from '../types';

export const CampaignCard: React.FC<{ campaign: Campaign; onClick: () => void }> = ({ campaign, onClick }) => {
  const total = campaign.posts.length;
  const published = campaign.posts.filter(post => post.status === 'published').length;
  const progress = total ? Math.round((published / total) * 100) : 0;
  return (
    <button type="button" onClick={onClick} className="w-full rounded-lg border border-gray-200 bg-white p-5 text-right shadow-sm transition hover:border-indigo-300 hover:shadow">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
        <span className="rounded bg-indigo-50 px-2 py-1 text-xs text-indigo-700">{campaign.state}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-gray-600">{campaign.topic}</p>
      <div className="mt-4 flex justify-between text-xs text-gray-500"><span>{total} منشورات</span><span>{progress}% مكتمل</span></div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress}%` }} /></div>
    </button>
  );
};
