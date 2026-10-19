import { useState } from 'react';

// onSubmit returns a promise that resolves to true on success (so the text is cleared only then)
function CommentForm({ onSubmit, isSending }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const ok = await onSubmit(content.trim());
    if (ok) setContent('');
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="כתבו תגובה..."
        rows={3}
        disabled={isSending}
      />
      <div className="comment-form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSending || !content.trim()}>
          {isSending ? 'שולח...' : 'שליחת תגובה'}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
