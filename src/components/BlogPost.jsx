import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { marked } from 'marked';
import { useBlog } from '../contexts/BlogContext';

const BlogPost = () => {
  const { slug } = useParams();
  const { posts } = useBlog();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Post not found</div>
      </div>
    );
  }

  const renderedContent = marked(post.content || '');

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-24 bg-background-dark"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-64 object-cover rounded-2xl mb-8"
          />
        )}
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {post.title}
        </h1>
        
        <p className="text-gray-400 mb-8">
          {format(new Date(post.publishDate), 'MMMM dd, yyyy')}
        </p>
        
        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </div>
    </motion.article>
  );
};

export default BlogPost;