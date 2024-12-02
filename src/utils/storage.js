import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const STORAGE_KEYS = {
  POSTS: 'blog_posts',
  CATEGORIES: 'blog_categories',
  TAGS: 'blog_tags',
  COMMENTS: 'blog_comments'
};

const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TAGS)) {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify([]));
  }
};

initializeStorage();

const getStorageItem = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    console.error(`Error reading from storage (${key}):`, error);
    toast.error('Error reading data from storage');
    return [];
  }
};

const setStorageItem = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to storage (${key}):`, error);
    toast.error('Error saving data to storage');
    throw error;
  }
};

export const getPosts = () => getStorageItem(STORAGE_KEYS.POSTS);

export const createPost = (postData) => {
  try {
    const posts = getPosts();
    const newPost = {
      id: uuidv4(),
      ...postData,
      slug: generateSlug(postData.title),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: postData.status || 'draft'
    };
    posts.push(newPost);
    setStorageItem(STORAGE_KEYS.POSTS, posts);
    toast.success('Post created successfully');
    return newPost;
  } catch (error) {
    toast.error('Error creating post');
    throw error;
  }
};

export const updatePost = (slug, postData) => {
  try {
    const posts = getPosts();
    const index = posts.findIndex(post => post.slug === slug);
    if (index !== -1) {
      posts[index] = {
        ...posts[index],
        ...postData,
        updatedAt: new Date().toISOString()
      };
      setStorageItem(STORAGE_KEYS.POSTS, posts);
      toast.success('Post updated successfully');
      return posts[index];
    }
    toast.error('Post not found');
    return null;
  } catch (error) {
    toast.error('Error updating post');
    throw error;
  }
};

export const deletePost = (slug) => {
  try {
    const posts = getPosts();
    const filteredPosts = posts.filter(post => post.slug !== slug);
    setStorageItem(STORAGE_KEYS.POSTS, filteredPosts);
    toast.success('Post deleted successfully');
  } catch (error) {
    toast.error('Error deleting post');
    throw error;
  }
};

export const getCategories = () => getStorageItem(STORAGE_KEYS.CATEGORIES);

export const createCategory = (categoryData) => {
  try {
    const categories = getCategories();
    const newCategory = {
      id: uuidv4(),
      ...categoryData,
      slug: generateSlug(categoryData.name)
    };
    categories.push(newCategory);
    setStorageItem(STORAGE_KEYS.CATEGORIES, categories);
    toast.success('Category created successfully');
    return newCategory;
  } catch (error) {
    toast.error('Error creating category');
    throw error;
  }
};

export const getTags = () => getStorageItem(STORAGE_KEYS.TAGS);

export const createTag = (tagData) => {
  try {
    const tags = getTags();
    const newTag = {
      id: uuidv4(),
      ...tagData,
      slug: generateSlug(tagData.name)
    };
    tags.push(newTag);
    setStorageItem(STORAGE_KEYS.TAGS, tags);
    toast.success('Tag created successfully');
    return newTag;
  } catch (error) {
    toast.error('Error creating tag');
    throw error;
  }
};

export const getComments = (postId) => {
  const comments = getStorageItem(STORAGE_KEYS.COMMENTS);
  return comments.filter(comment => comment.postId === postId);
};

export const createComment = (commentData) => {
  try {
    const comments = getStorageItem(STORAGE_KEYS.COMMENTS);
    const newComment = {
      id: uuidv4(),
      ...commentData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    comments.push(newComment);
    setStorageItem(STORAGE_KEYS.COMMENTS, comments);
    toast.success('Comment submitted successfully');
    return newComment;
  } catch (error) {
    toast.error('Error submitting comment');
    throw error;
  }
};

export const updateCommentStatus = (commentId, status) => {
  try {
    const comments = getStorageItem(STORAGE_KEYS.COMMENTS);
    const index = comments.findIndex(comment => comment.id === commentId);
    if (index !== -1) {
      comments[index].status = status;
      setStorageItem(STORAGE_KEYS.COMMENTS, comments);
      toast.success('Comment status updated');
      return comments[index];
    }
    toast.error('Comment not found');
    return null;
  } catch (error) {
    toast.error('Error updating comment status');
    throw error;
  }
};

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const uploadImage = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ url: reader.result });
        toast.success('Image uploaded successfully');
      };
      reader.onerror = () => {
        reject(new Error('Error reading file'));
        toast.error('Error uploading image');
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    toast.error('Error uploading image');
    throw error;
  }
};