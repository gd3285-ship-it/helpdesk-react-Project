import EmptyState from './EmptyState';
import { formatDate } from '../utils/labels';

const initialsOf = (name = '?') =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// currentUserId - the user's own comments are shown on the other side, like a chat
function CommentList({ comments = [], currentUserId }) {
  if (comments.length === 0) {
    return <EmptyState title="אין עדיין תגובות">היו הראשונים להגיב על הטיקט</EmptyState>;
  }

  return (
    <ul className="comment-list">
      {comments.map((comment) => {
        const isMine = comment.author_id === currentUserId;
        return (
          <li key={comment.id} className={`comment ${isMine ? 'comment-mine' : ''}`}>
            <div className="avatar" aria-hidden="true">
              {initialsOf(comment.author_name)}
            </div>
            <div className="comment-bubble">
              <div className="comment-header">
                <strong>{isMine ? 'את/ה' : comment.author_name}</strong>
                <span className="muted">{formatDate(comment.created_at) || 'עכשיו'}</span>
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default CommentList;
