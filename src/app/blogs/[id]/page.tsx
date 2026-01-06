'use client';

import React, { useEffect, useState, use } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { blogsApi, BlogPost } from '@/app/lib/blogs';
import { format } from 'date-fns';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const data = await blogsApi.getOne(id);
                setBlog(data);
            } catch (err) {
                console.error(err);
                setError('Blog post not found.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBlog();
    }, [id]);

    // Image Fallback State
    const [imgSrc, setImgSrc] = useState<string>('');

    // Update imgSrc when blog data loads
    useEffect(() => {
        if (blog?.imageUrl) {
            setImgSrc(blog.imageUrl);
        }
    }, [blog]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
                <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] space-y-4">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Post not found</h1>
                <Link href="/blogs" className="text-[var(--color-primary)] hover:underline">
                    ← Back to Blogs
                </Link>
            </div>
        );
    }

    // Calculate Reading Time (approx 200 words per minute)
    const wordCount = blog.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return (
        <main className="min-h-screen bg-[#FDFDFC] pb-24 text-gray-900 font-sans selection:bg-yellow-200">
            {/* HERO SECTION - Split Layout */}
            <header className="max-w-[1240px] mx-auto px-6 pt-16 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Left: Text Content */}
                    <div className="space-y-6 order-2 md:order-1">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                                {blog.category || 'Opinion'}
                                {!blog.category && <span className="opacity-50 ml-1 text-[10px]">// FALLBACK CATEGORY</span>}
                            </span>
                            <span className="text-gray-500 text-sm font-medium">{readingTime} min read</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
                            {blog.title}
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-serif italic">
                            An in-depth look at how personalized education is reshaping the future of student success.
                        </p>

                        {/* Author Metadata */}
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white">
                                {blog.author?.first_name?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-base">
                                    {blog.author?.first_name} {blog.author?.last_name}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>
                                        {blog.createdAt && !isNaN(new Date(blog.createdAt).getTime())
                                            ? format(new Date(blog.createdAt), 'MMM d, yyyy')
                                            : <span className="text-red-400 text-xs bg-red-50 px-2 py-0.5 rounded">Date Missing</span>}
                                    </span>
                                    <span>•</span>
                                    <span>Education Specialist</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Feature Image */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2 group bg-gray-100">
                        {imgSrc ? (
                            <Image
                                src={imgSrc}
                                alt={blog.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                onError={() => setImgSrc('https://placehold.co/800x600?text=Image+Load+Failed')}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-bold">
                                Loading Image...
                            </div>
                        )}
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                    </div>
                </div>
            </header>

            {/* VISUAL BREAK / STAT BOX (Before Content) */}
            <div className="max-w-4xl mx-auto px-6 mb-16">
                <div className="bg-blue-50/50 border-l-4 border-blue-500 p-8 rounded-r-xl">
                    <p className="text-lg text-blue-900 italic font-medium">
                        "Education is not the filling of a pail, but the lighting of a fire."
                    </p>
                </div>
            </div>

            {/* CONTENT CONTAINER */}
            <article className="max-w-[700px] lg:max-w-[750px] mx-auto px-6">
                <div className="prose prose-lg md:prose-xl prose-gray 
                    prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight 
                    prose-p:text-[1.2rem] prose-p:leading-[2rem] prose-p:text-[#242424] 
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-black
                    prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                    prose-blockquote:border-l-4 prose-blockquote:border-gray-900 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic
                    prose-li:text-[1.125rem] prose-li:text-gray-700
                    first-letter:text-5xl first-letter:font-bold first-letter:text-gray-900 first-letter:float-left first-letter:mr-3 first-letter:mt-[-4px]">

                    {(() => {
                        // Helper to split content into 3 parts
                        const splitContent = (text: string) => {
                            if (!text) return [];
                            const paragraphs = text.split('\n\n');
                            if (paragraphs.length < 6) return [text]; // Don't split short posts

                            const third = Math.ceil(paragraphs.length / 3);
                            const part1 = paragraphs.slice(0, third).join('\n\n');
                            const part2 = paragraphs.slice(third, third * 2).join('\n\n');
                            const part3 = paragraphs.slice(third * 2).join('\n\n');
                            return [part1, part2, part3];
                        };

                        const parts = splitContent(blog.content);
                        const components = {
                            h1: ({ node, ...props }: any) => <h1 className="text-3xl font-black mt-10 mb-6 text-gray-900 leading-tight tracking-tight" {...props} />,
                            h2: ({ node, ...props }: any) => <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 leading-snug tracking-tight" {...props} />,
                            h3: ({ node, ...props }: any) => <h3 className="text-xl font-bold mt-6 mb-3 text-gray-900" {...props} />,
                            p: ({ node, ...props }: any) => <p className="mb-6 leading-loose text-lg text-gray-800" {...props} />,
                            ul: ({ node, ...props }: any) => <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-lg text-gray-800" {...props} />,
                            ol: ({ node, ...props }: any) => <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-lg text-gray-800" {...props} />,
                            li: ({ node, ...props }: any) => <li className="pl-2" {...props} />,
                            blockquote: ({ node, ...props }: any) => <blockquote className="border-l-4 border-blue-600 pl-6 py-2 italic my-8 bg-blue-50 text-xl text-gray-900 font-serif leading-relaxed rounded-r-lg" {...props} />,
                            a: ({ node, ...props }: any) => <a className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors" {...props} />,
                            strong: ({ node, ...props }: any) => <strong className="font-black text-gray-900" {...props} />,
                            hr: ({ node, ...props }: any) => <hr className="my-10 border-gray-200" {...props} />,
                            code: ({ node, ...props }: any) => <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />,
                            img: ({ node, ...props }: any) => (
                                <span className="block my-8">
                                    <img className="rounded-xl shadow-lg w-full object-cover max-h-[500px]" {...props} alt={props.alt || ''} />
                                </span>
                            )
                        };

                        return (
                            <>
                                {/* PART 1 */}
                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
                                    {parts[0]}
                                </ReactMarkdown>

                                {/* VISUAL BREAK 1 */}
                                {parts.length > 1 && (
                                    <div className="my-12 -mx-6 md:-mx-12 relative aspect-[2/1] rounded-xl overflow-hidden shadow-lg group">
                                        <Image
                                            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1600"
                                            alt="Study Session"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                        <p className="absolute bottom-4 left-6 text-white font-medium italic opacity-90">"The art of learning is the art of discovery."</p>
                                    </div>
                                )}

                                {/* PART 2 */}
                                {parts.length > 1 && (
                                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
                                        {parts[1]}
                                    </ReactMarkdown>
                                )}

                                {/* VISUAL BREAK 2 */}
                                {parts.length > 2 && (
                                    <div className="my-12 -mx-6 md:-mx-12 relative aspect-[2/1] rounded-xl overflow-hidden shadow-lg group">
                                        <Image
                                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600"
                                            alt="Collaboration"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                        <p className="absolute bottom-4 left-6 text-white font-medium italic opacity-90">Connecting ideas, connecting people.</p>
                                    </div>
                                )}

                                {/* PART 3 */}
                                {parts.length > 2 && (
                                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
                                        {parts[2]}
                                    </ReactMarkdown>
                                )}
                            </>
                        );
                    })()}
                </div>

                {/* VISUAL BREAK - WIDE IMAGE (Simulated injection at bottom for now, as splitting markdown is complex without data) */}
                <div className="my-16 -mx-6 md:-mx-20 relative aspect-[21/9] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                        src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2600"
                        alt="Classroom"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/60 to-transparent w-full">
                        <p className="text-white text-sm font-medium opacity-90">Engaging students in real-time collaboration.</p>
                    </div>
                </div>

                {/* CTA BLOCK */}
                <div className="mt-20 p-10 bg-gray-900 rounded-3xl text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-4">Want this for your child or school?</h2>
                        <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
                            Experience the difference of personalized K-12 learning support. Book a free demo session today.
                        </p>
                        <Link
                            href="/demo"
                            className="inline-block px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-full hover:bg-gray-100 transition-transform hover:scale-105 shadow-lg shadow-white/10"
                        >
                            Book a free demo session →
                        </Link>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-16 text-center">
                    <Link href="/blogs" className="text-gray-500 hover:text-gray-900 font-medium transition-colors border-b border-transparent hover:border-gray-900 pb-0.5">
                        ← Back to all articles
                    </Link>
                </div>
            </article>
        </main>
    );
}
