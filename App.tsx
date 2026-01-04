import React, { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { CampaignCard } from './components/CampaignCard';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { PostList } from './components/PostList';
import { Footer } from './components/Footer';
import { Campaign, User, CreateCampaignDTO, Post, ReferenceImageType } from './types';
import { generateCampaignContent, generatePostImage } from './services/geminiService';
import { saveCampaignsToStorage, loadCampaignsFromStorage } from './services/storageService';

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    userId: 'user-1',
    title: 'حملة الأداء العالي',
    topic: 'نصائح لتسريع أداء React',
    targetAudience: 'المبرمجين المبتدئين والمتوسطين',
    postsPerDay: 1,
    durationDays: 5,
    state: 'active',
    platforms: ['twitter', 'linkedin'],
    createdAt: new Date().toISOString(),
    posts: [
      { id: 'p1', day: 1, title: 'أساسيات Memoization', content: 'استخدم React.memo لمنع إعادة التصيير غير الضرورية للمكونات...', hashtags: ['#ReactJS', '#Coding', '#WebDev'], imagePrompt: 'A minimal vector illustration of computer memory blocks being optimized, blue color scheme', status: 'published', scheduledTime: new Date().toISOString() },
      { id: 'p2', day: 2, title: 'التحميل الكسول (Lazy Loading)', content: 'قم بتقسيم الكود باستخدام React.lazy لتقليل حجم الحزمة الأولية...', hashtags: ['#JavaScript', '#Performance', '#TechTips'], imagePrompt: 'A snail transforming into a cheetah, representing speed optimization, digital art style', status: 'pending', scheduledTime: new Date(Date.now() + 86400000).toISOString() }
    ]
  }
];

const PLATFORMS_LIST = [
    { id: 'facebook', label: 'فيسبوك (Facebook)' },
    { id: 'instagram', label: 'انستجرام (Instagram)' },
    { id: 'twitter', label: 'تويتر (X)' },
    { id: 'linkedin', label: 'لينكد إن (LinkedIn)' },
];

const IMAGE_TYPES: { id: ReferenceImageType; label: string }[] = [
    { id: 'logo', label: 'شعار (Logo)' },
    { id: 'character', label: 'شخصية (Character)' },
    { id: 'business', label: 'عمل/مكتب (Business)' },
    { id: 'expressive', label: 'تعبيري/فني (Abstract)' },
    { id: 'other', label: 'أخرى' },
];

const CAMPAIGN_TEMPLATES = [
    { title: 'جرعة تحفيز', topic: 'اقتباسات ملهمة ونصائح لتطوير الذات والإنتاجية', icon: '🚀' },
    { title: 'نصائح تقنية', topic: 'شروحات مبسطة لأحدث أدوات الذكاء الاصطناعي والتكنولوجيا', icon: '💻' },
    { title: 'تسويق رقمي', topic: 'استراتيجيات لزيادة المبيعات والوصول على السوشيال ميديا', icon: '📈' },
    { title: 'صحة وتغذية', topic: 'نصائح يومية لنمط حياة صحي وتغذية متوازنة ووصفات دايت', icon: '🥑' },
    { title: 'كواليس العمل', topic: 'مشاركة قصص يومية من بيئة العمل لبناء الثقة مع العملاء', icon: '🎬' },
    { title: 'عقارات واستثمار', topic: 'نصائح للمستثمرين في العقارات وعروض شقق مميزة', icon: '🏠' },
    { title: 'تجارة إلكترونية', topic: 'عروض خصومات، آراء عملاء، ومنتجات جديدة للمتجر', icon: '🛍️' },
    { title: 'علامة شخصية', topic: 'بناء البراند الشخصي ومشاركة الخبرات المهنية والدروس المستفادة', icon: '🌟' },
    { title: 'وصفات طبخ', topic: 'وصفات سريعة ولذيذة للمبتدئين والمحترفين مع نصائح مطبخية', icon: '🍳' },
    { title: 'سفر وسياحة', topic: 'أجمل الوجهات السياحية، نصائح للسفر الاقتصادي، ومغامرات', icon: '✈️' },
    { title: 'موضة وأزياء', topic: 'تنسيق ملابس، صيحات الموضة الجديدة، ونصائح أناقة', icon: '👗' },
    { title: 'أمومة وطفولة', topic: 'نصائح لتربية الأطفال، أنشطة تعليمية، ورعاية الرضع', icon: '👶' },
    { title: 'تعليم ولغات', topic: 'كلمات جديدة، قواعد مبسطة، ونصائح لتعلم اللغات بسرعة', icon: '🎓' },
    { title: 'مال واستثمار', topic: 'ثقافة مالية، ادخار، استثمار في الأسهم والعملات الرقمية', icon: '💰' },
    { title: 'ألعاب فيديو', topic: 'مراجعات ألعاب، أخبار الجيمرز، ولقطات لعب مثيرة', icon: '🎮' },
    { title: 'مراجعات كتب', topic: 'ملخصات كتب مفيدة، اقتباسات أدبية، وترشيحات للقراءة', icon: '📚' },
    { title: 'فنون يدوية', topic: 'أفكار DIY، إعادة تدوير، ومشاريع فنية بسيطة للمنزل', icon: '🎨' },
    { title: 'لياقة بدنية', topic: 'تمارين رياضية للمنزل والجيم، نصائح لبناء العضلات', icon: '💪' },
    { title: 'ترفيه وضحك', topic: 'مواقف مضحكة، ميمز (Memes) متعلقة بالمجال، وألغاز', icon: '😂' },
    { title: 'أخبار وترند', topic: 'تغطية سريعة لأحدث الأخبار والترندات العالمية والمحلية', icon: '🔥' },
    { title: 'عمل خيري', topic: 'قصص إنسانية، دعوة للتطوع، ونشر الوعي المجتمعي', icon: '❤️' },
    { title: 'تصوير فوتوغرافي', topic: 'نصائح لالتقاط صور احترافية، تعديل الصور، وزوايا التصوير', icon: '📸' },
    { title: 'ديكور داخلي', topic: 'تنسيق أثاث، ألوان دهانات، وأفكار لتجديد المنزل', icon: '🛋️' },
    { title: 'رعاية حيوانات', topic: 'نصائح لتربية القطط والكلاب، تغذية، وصحة الحيوانات الأليفة', icon: '🐱' },
    { title: 'عمل حر', topic: 'نصائح للفريلانسرز، إدارة الوقت، والتعامل مع العملاء', icon: '💼' },
    { title: 'صحة نفسية', topic: 'نصائح للتغلب على القلق، التأمل، والراحة النفسية', icon: '🧠' },
    { title: 'سيارات ومحركات', topic: 'مراجعات سيارات، صيانة دورية، وأخبار عالم السيارات', icon: '🚗' },
    { title: 'جمال وعناية', topic: 'روتين العناية بالبشرة والشعر، ومراجعات منتجات تجميل', icon: '💄' },
    { title: 'تنظيم مناسبات', topic: 'أفكار لتنظيم الحفلات، الأعراس، وأعياد الميلاد', icon: '🎉' },
    { title: 'برمجة وتكويد', topic: 'نصائح برمجية، حلول لمشاكل الكود، وأدوات للمطورين', icon: '👨‍💻' },
];

const AUDIENCE_PRESETS = [
    'رواد الأعمال وأصحاب الشركات الناشئة',
    'الطلاب والباحثين الأكاديميين',
    'الأمهات وربات البيوت',
    'المسوقين وصناع المحتوى',
    'المبرمجين وعشاق التقنية',
    'الرياضيين والمهتمين بالصحة',
    'المستثمرين والمتداولين',
    'محبي السفر والمغامرات',
    'عشاق الطهي والطعام',
    'المصممين والفنانين',
    'محبي الألعاب (Gamers)',
    'أصحاب الحيوانات الأليفة',
    'الباحثين عن عمل',
    'المستقلين (Freelancers)',
    'الجمهور العام (General)'
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
      const savedUser = localStorage.getItem('app_user');
      return savedUser ? JSON.parse(savedUser) : null;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  const [view, setView] = useState<'dashboard' | 'create' | 'detail'>('dashboard');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const [newCampaignData, setNewCampaignData] = useState<CreateCampaignDTO>({
    title: '',
    topic: '',
    targetAudience: '',
    postsPerDay: 1,
    durationDays: 3,
    platforms: ['twitter'],
    referenceImageType: 'other'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
      if (user) {
          localStorage.setItem('app_user', JSON.stringify(user));
      } else {
          localStorage.removeItem('app_user');
      }
  }, [user]);

  useEffect(() => {
    const initData = async () => {
        try {
            const dbData = await loadCampaignsFromStorage();
            if (dbData) {
                setCampaigns(dbData);
            } else {
                const lsData = localStorage.getItem('app_campaigns');
                if (lsData) {
                    try {
                        const parsed = JSON.parse(lsData);
                        setCampaigns(parsed);
                        localStorage.removeItem('app_campaigns'); 
                    } catch (e) {
                        console.error("Migration failed", e);
                    }
                }
            }
        } catch (e) {
            console.error("Storage initialization failed", e);
        } finally {
            setIsStorageLoaded(true);
        }
    };
    initData();
  }, []);

  useEffect(() => {
      if (isStorageLoaded) {
          saveCampaignsToStorage(campaigns).catch(e => console.error("Failed to save campaigns", e));
      }
  }, [campaigns, isStorageLoaded]);

  const handleLogin = (email: string) => {
    setUser({ id: 'user-123', email, token: 'mock-jwt-token' });
    setView('dashboard');
  };
  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
    setSelectedCampaign(null);
  };

  const handleDeleteCampaign = (id: string) => {
      if (window.confirm("هل أنت متأكد من حذف هذه الحملة؟ لا يمكن التراجع عن هذا الإجراء.")) {
          const updatedCampaigns = campaigns.filter(c => c.id !== id);
          setCampaigns(updatedCampaigns);
          if (selectedCampaign?.id === id) {
              setSelectedCampaign(null);
              setView('dashboard');
          }
      }
  };

  const handleUpdatePost = (updatedPost: Post) => {
    if (!selectedCampaign) return;

    const updatedPosts = selectedCampaign.posts.map(p => 
        p.id === updatedPost.id ? updatedPost : p
    );
    
    const updatedCampaign = { ...selectedCampaign, posts: updatedPosts };
    setSelectedCampaign(updatedCampaign);
    setCampaigns(campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
  };

  const handleDeletePost = (postId: string) => {
      if (!selectedCampaign) return;
      if (window.confirm("هل أنت متأكد من حذف هذا المنشور؟")) {
          const updatedPosts = selectedCampaign.posts.filter(p => p.id !== postId);
          const updatedCampaign = { ...selectedCampaign, posts: updatedPosts };
          setSelectedCampaign(updatedCampaign);
          setCampaigns(campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
      }
  };

  const togglePlatform = (platformId: string) => {
      setNewCampaignData(prev => {
          const exists = prev.platforms.includes(platformId);
          if (exists) {
              return { ...prev, platforms: prev.platforms.filter(p => p !== platformId) };
          } else {
              return { ...prev, platforms: [...prev.platforms, platformId] };
          }
      });
  };

  const handleApplyTemplate = (template: typeof CAMPAIGN_TEMPLATES[0]) => {
      setNewCampaignData(prev => ({
          ...prev,
          title: template.title,
          topic: template.topic
      }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setNewCampaignData(prev => ({ ...prev, referenceImage: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleGenerateAllImages = async () => {
      if (!selectedCampaign) return;
      const postsWithoutImages = selectedCampaign.posts.filter(p => !p.imageUrl);
      if (postsWithoutImages.length === 0) return;

      const updatedPosts = [...selectedCampaign.posts];
      
      for (const post of postsWithoutImages) {
          try {
              const prompt = post.imagePrompt || `${post.title} - ${post.content.substring(0, 50)}`;
              const base64 = await generatePostImage(prompt, selectedCampaign.referenceImage);
              if (base64) {
                  const index = updatedPosts.findIndex(p => p.id === post.id);
                  if (index !== -1) {
                      updatedPosts[index] = { ...updatedPosts[index], imageUrl: base64, imagePrompt: prompt };
                      const tempCamp = { ...selectedCampaign, posts: [...updatedPosts] };
                      setSelectedCampaign(tempCamp);
                      setCampaigns(campaigns.map(c => c.id === tempCamp.id ? tempCamp : c));
                  }
              }
          } catch (e) {
              console.error(`Failed to generate image for post ${post.id}`, e);
          }
      }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignData.topic || !newCampaignData.title || newCampaignData.platforms.length === 0) {
        alert("يرجى ملء جميع الحقول المطلوبة واختيار منصة واحدة على الأقل.");
        return;
    }

    setIsGenerating(true);
    try {
      const generatedPosts = await generateCampaignContent(
        newCampaignData.title,
        newCampaignData.topic,
        newCampaignData.targetAudience || 'العامة',
        newCampaignData.durationDays,
        newCampaignData.postsPerDay,
        newCampaignData.platforms,
        newCampaignData.referenceImage,
        newCampaignData.referenceImageType
      );

      const newCampaign: Campaign = {
        id: `camp-${Date.now()}`,
        userId: user!.id,
        title: newCampaignData.title,
        topic: newCampaignData.topic,
        targetAudience: newCampaignData.targetAudience,
        postsPerDay: newCampaignData.postsPerDay,
        durationDays: newCampaignData.durationDays,
        state: 'created',
        platforms: newCampaignData.platforms,
        createdAt: new Date().toISOString(),
        posts: generatedPosts,
        referenceImage: newCampaignData.referenceImage,
        referenceImageType: newCampaignData.referenceImageType
      };

      setCampaigns([newCampaign, ...campaigns]);
      setView('dashboard');
      setNewCampaignData({ 
          title: '', 
          topic: '', 
          targetAudience: '', 
          postsPerDay: 1, 
          durationDays: 3, 
          platforms: ['twitter'],
          referenceImageType: 'other',
          referenceImage: undefined
      }); 
    } catch (error) {
      console.error(error);
      alert("فشل إنشاء الحملة. يرجى التحقق من مفتاح API.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setView('dashboard')}>
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center ml-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Auto Poster <span className="text-indigo-600">Hub</span></h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
              <Button variant="ghost" onClick={handleLogout}>خروج</Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {view === 'dashboard' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                  <h2 className="text-2xl font-bold text-gray-900">لوحة التحكم</h2>
                  <p className="mt-1 text-sm text-gray-500">إدارة حملات المحتوى الآلي الخاصة بك.</p>
              </div>
              <div className="mt-4 sm:mt-0">
                  <Button onClick={() => setView('create')}>+ حملة جديدة</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map(camp => (
                <CampaignCard 
                  key={camp.id} 
                  campaign={camp} 
                  onClick={() => {
                    setSelectedCampaign(camp);
                    setView('detail');
                  }} 
                />
              ))}
              {campaigns.length === 0 && (
                 <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    لا توجد حملات حالياً. ابدأ بإنشاء واحدة!
                 </div>
              )}
            </div>
          </div>
        )}

        {view === 'create' && (
          <div className="max-w-3xl mx-auto">
             <div className="mb-6">
                <button onClick={() => setView('dashboard')} className="text-sm text-indigo-600 hover:underline mb-2 flex items-center gap-1">
                    <span>&rarr;</span> عودة للوحة التحكم
                </button>
                <h2 className="text-2xl font-bold text-gray-900">إنشاء حملة جديدة</h2>
                <p className="text-gray-500 text-sm">استخدم محرك الذكاء الاصطناعي لإنشاء خطة محتوى مخصصة.</p>
             </div>

             <div className="bg-white shadow rounded-lg p-6">
                <form onSubmit={handleCreateCampaign} className="space-y-6">
                  
                  <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">قوالب سريعة (اختر للبدء)</label>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                          {CAMPAIGN_TEMPLATES.map((template, idx) => (
                              <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleApplyTemplate(template)}
                                  className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-full text-xs font-medium text-indigo-700 transition-colors whitespace-nowrap"
                              >
                                  <span>{template.icon}</span>
                                  {template.title}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="عنوان الحملة" 
                        placeholder="مثال: حملة الصيف 2025" 
                        value={newCampaignData.title}
                        onChange={(e) => setNewCampaignData({...newCampaignData, title: e.target.value})}
                        required
                      />
                      <div>
                        <Input 
                            label="الجمهور المستهدف" 
                            placeholder="مثال: رواد الأعمال، الأمهات..." 
                            value={newCampaignData.targetAudience}
                            onChange={(e) => setNewCampaignData({...newCampaignData, targetAudience: e.target.value})}
                        />
                        <div className="mt-2 flex flex-wrap gap-1">
                            {AUDIENCE_PRESETS.map((aud, idx) => {
                                const isSelected = newCampaignData.targetAudience.includes(aud);
                                return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        const current = newCampaignData.targetAudience;
                                        if (current.includes(aud)) return; 
                                        const separator = current.trim() === '' ? '' : '، ';
                                        setNewCampaignData({...newCampaignData, targetAudience: current + separator + aud});
                                    }}
                                    className={`px-2 py-1 rounded text-[10px] transition-colors border ${
                                        isSelected 
                                        ? 'bg-indigo-100 text-indigo-700 border-indigo-200 font-medium' 
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    {aud} {isSelected && '✓'}
                                </button>
                            )})}
                        </div>
                      </div>
                  </div>

                  <Input 
                    label="موضوع الحملة (Topic/Theme)" 
                    placeholder="مثال: تحضير وجبات صحية للمبتدئين" 
                    value={newCampaignData.topic}
                    onChange={(e) => setNewCampaignData({...newCampaignData, topic: e.target.value})}
                    required
                  />

                  <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">صورة مرجعية (اختياري)</h3>
                      <p className="text-xs text-gray-500 mb-3">
                          قم برفع صورة (شعار، شخصية، أو نمط) ليقوم الذكاء الاصطناعي بمراعاتها عند كتابة المحتوى وتوليد صور المنشورات.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                          <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">نوع الصورة المرجعية</label>
                              <select 
                                  value={newCampaignData.referenceImageType}
                                  onChange={(e) => setNewCampaignData({...newCampaignData, referenceImageType: e.target.value as ReferenceImageType})}
                                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              >
                                  {IMAGE_TYPES.map(type => (
                                      <option key={type.id} value={type.id}>{type.label}</option>
                                  ))}
                              </select>
                          </div>
                          
                          <div>
                               <label className="block text-xs font-medium text-gray-700 mb-1">رفع الصورة</label>
                               <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                               />
                          </div>
                      </div>

                      {newCampaignData.referenceImage && (
                          <div className="mt-4">
                              <p className="text-xs text-gray-500 mb-1">معاينة:</p>
                              <img src={newCampaignData.referenceImage} alt="Reference" className="h-24 w-auto rounded border border-gray-300 shadow-sm object-cover" />
                          </div>
                      )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                        label="المدة (أيام)" 
                        type="number" 
                        min={1} 
                        max={30}
                        value={newCampaignData.durationDays}
                        onChange={(e) => setNewCampaignData({...newCampaignData, durationDays: parseInt(e.target.value)})}
                    />
                    <Input 
                        label="عدد المنشورات يومياً" 
                        type="number" 
                        min={1} 
                        max={5}
                        value={newCampaignData.postsPerDay}
                        onChange={(e) => setNewCampaignData({...newCampaignData, postsPerDay: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المنصات المستهدفة</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PLATFORMS_LIST.map(platform => (
                            <div 
                                key={platform.id}
                                onClick={() => togglePlatform(platform.id)}
                                className={`cursor-pointer border rounded-md p-3 text-center text-sm font-medium transition-colors ${
                                    newCampaignData.platforms.includes(platform.id)
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {platform.label}
                            </div>
                        ))}
                    </div>
                    {newCampaignData.platforms.length === 0 && <p className="text-red-500 text-xs mt-1">يجب اختيار منصة واحدة على الأقل</p>}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <Button type="button" variant="secondary" onClick={() => setView('dashboard')} className="ml-3">إلغاء</Button>
                      <Button type="submit" isLoading={isGenerating}>تشغيل المحرك وإنشاء المحتوى</Button>
                  </div>
                </form>
             </div>
          </div>
        )}

        {view === 'detail' && selectedCampaign && (
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <button onClick={() => setView('dashboard')} className="text-sm text-indigo-600 hover:underline mb-2 flex items-center gap-1">
                             <span>&rarr;</span> لوحة التحكم
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedCampaign.title}</h2>
                        <p className="text-gray-600 text-sm mt-1">الموضوع: {selectedCampaign.topic}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">الجمهور: {selectedCampaign.targetAudience}</span>
                            <span className="text-gray-300">|</span>
                            <div className="flex gap-1">
                                {selectedCampaign.platforms.map(p => (
                                    <span key={p} className="text-xs font-bold uppercase text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{p}</span>
                                ))}
                            </div>
                        </div>
                        {selectedCampaign.referenceImage && (
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-gray-500">صورة مرجعية ({selectedCampaign.referenceImageType}):</span>
                                <img src={selectedCampaign.referenceImage} alt="Ref" className="w-8 h-8 rounded object-cover border" />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="danger" onClick={() => handleDeleteCampaign(selectedCampaign.id)}>حذف الحملة</Button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="flex justify-between text-sm font-medium mb-1">
                        <span>تقدم الحملة</span>
                        <span>{Math.round((selectedCampaign.posts.filter(p => p.status === 'published').length / selectedCampaign.posts.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${(selectedCampaign.posts.filter(p => p.status === 'published').length / selectedCampaign.posts.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="mb-4 flex justify-between items-end">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">خطة المحتوى المُنشأة</h3>
                        <p className="text-sm text-gray-500">مخرجات المحرك: {selectedCampaign.posts.length} منشورات</p>
                    </div>
                    {selectedCampaign.posts.some(p => !p.imageUrl) && (
                        <Button onClick={handleGenerateAllImages} className="text-xs">
                            توليد جميع الصور المفقودة ✨
                        </Button>
                    )}
                </div>

                <PostList 
                    posts={selectedCampaign.posts} 
                    referenceImage={selectedCampaign.referenceImage}
                    onUpdate={handleUpdatePost} 
                    onDelete={handleDeletePost}
                />
            </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default App;