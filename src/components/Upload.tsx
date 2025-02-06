import React, { useState, useRef } from 'react';
import { Bold, Italic, Underline, Link, Image, Code, Heading1, Heading2, Strikethrough, Tag, User } from 'lucide-react';
import axios from 'axios';

const BlogspotEditor: React.FC = () => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [abstract, setAbstract] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyStyle = (style: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedContent = content.substring(start, end);

    let styledContent;
    switch (style) {
      case 'bold':
        styledContent = `**${selectedContent}**`;
        break;
      case 'italic':
        styledContent = `*${selectedContent}*`;
        break;
      case 'underline':
        styledContent = `<u>${selectedContent}</u>`;
        break;
      case 'strikethrough':
        styledContent = `~~${selectedContent}~~`;
        break;
      case 'code':
        styledContent = `\`${selectedContent}\``;
        break;
      case 'h1':
        styledContent = `# ${selectedContent}`;
        break;
      case 'h2':
        styledContent = `## ${selectedContent}`;
        break;
      default:
        return;
    }

    const newContent = 
      content.slice(0, start) + 
      styledContent + 
      content.slice(end);

    setContent(newContent);
    textarea.focus();
    textarea.setSelectionRange(start, start + styledContent.length);
  };

  const insertImage = () => {
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl) {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      
      const imageMarkdown = `\n![Image Description](${imageUrl})\n`;
      const newContent = 
        content.slice(0, start) + 
        imageMarkdown + 
        content.slice(start);

      setContent(newContent);
      textarea.focus();
    }
  };

  const insertLink = () => {
    const linkText = prompt('Enter link text:');
    const linkUrl = prompt('Enter URL:');
    if (linkText && linkUrl) {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      
      const linkMarkdown = `[${linkText}](${linkUrl})`;
      const newContent = 
        content.slice(0, start) + 
        linkMarkdown + 
        content.slice(start);

      setContent(newContent);
      textarea.focus();
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handlePublish = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('institution', institution);
      formData.append('abstract', abstract);
      formData.append('content', content);
      formData.append('tags', JSON.stringify(tags));
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post('https://backend-api-9idz.onrender.com/api/articles', formData, {
        headers: {
          'Authorization': `Bearer your_jwt_token`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Article published:', response.data);
      alert('Post published!');
    } catch (error) {
      console.error('Error publishing article:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      {/* Author Input */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">
          <User className="inline-block mr-2 h-5 w-5" />
          Author Name
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author name"
          className="w-full p-2 border rounded focus:outline-blue-500"
        />
      </div>

      {/* Title Input */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter article title"
          className="w-full p-2 border rounded focus:outline-blue-500"
        />
      </div>

      {/* Institution Input */}
      <div className="mb-4">
                <label className="block mb-2 text-gray-700">
          Institution
        </label>
        <input
          type="text"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="Enter institution name"
          className="w-full p-2 border rounded focus:outline-blue-500"
        />
      </div>

      {/* Abstract Input */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">
          Abstract
        </label>
        <textarea
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          placeholder="Enter article abstract"
          className="w-full p-2 border rounded focus:outline-blue-500"
        />
      </div>

      {/* Tags Input */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">
          <Tag className="inline-block mr-2 h-5 w-5" />
          Tags
        </label>
        <div className="flex flex-wrap gap-2 p-2 border rounded">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center"
            >
              {tag}
              <button 
                onClick={() => removeTag(index)} 
                className="ml-2 text-red-500"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagAdd}
            placeholder="Add tags (press Enter)"
            className="flex-grow p-1 focus:outline-none"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">
          Image Upload
        </label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="w-full p-2 border rounded focus:outline-blue-500"
        />
      </div>

      {/* Text Formatting Buttons */}
      <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-100 rounded">
        <button onClick={() => applyStyle('bold')} className="hover:bg-gray-200 p-2 rounded">
          <Bold className="h-5 w-5" />
        </button>
        <button onClick={() => applyStyle('italic')} className="hover:bg-gray-200 p-2 rounded">
          <Italic className="h-5 w-5" />
        </button>
        <button onClick={() => applyStyle('underline')} className="hover:bg-gray-200 p-2 rounded">
          <Underline className="h-5 w-5" />
        </button>
        <button onClick={() => applyStyle('strikethrough')} className="hover:bg-gray-200 p-2 rounded">
          <Strikethrough className="h-5 w-5" />
        </button>
        
        <button onClick={() => applyStyle('h1')} className="hover:bg-gray-200 p-2 rounded">
          <Heading1 className="h-5 w-5" />
        </button>
        <button onClick={() => applyStyle('h2')} className="hover:bg-gray-200 p-2 rounded">
          <Heading2 className="h-5 w-5" />
        </button>
        
        <button onClick={insertImage} className="hover:bg-gray-200 p-2 rounded">
          <Image className="h-5 w-5" />
        </button>
        <button onClick={insertLink} className="hover:bg-gray-200 p-2 rounded">
          <Link className="h-5 w-5" />
        </button>
        <button onClick={() => applyStyle('code')} className="hover:bg-gray-200 p-2 rounded">
          <Code className="h-5 w-5" />
        </button>
      </div>
      
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your blog post here..."
        className="w-full h-96 p-4 border rounded focus:outline-blue-500"
      />
      
      <div className="mt-4 flex justify-end space-x-4">
        <button className="bg-gray-200 px-4 py-2 rounded">Preview</button>
        <button 
          onClick={handlePublish}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default BlogspotEditor;
