import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CommentModal.css';

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  onAddComment: (comment: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ visible, onClose, onAddComment }) => {
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 200;

  const handleClose = () => {
    onClose();
    navigate('/');
  };

  const handleAddComment = () => {
    const trimmedComment = comment.trim();
    if (trimmedComment) {
      onAddComment(trimmedComment);
      setComment('');
      handleClose();
    }
  };

  const handleCancel = () => {
    setComment('');
    handleClose();
  };

  // Auto-focus and trigger mobile keyboard when modal opens
  useEffect(() => {
    if (visible && textareaRef.current) {
      // Small delay to ensure modal is fully rendered
      const timeoutId = setTimeout(() => {
        textareaRef.current?.focus();
        // Force mobile keyboard on iOS/Android
        textareaRef.current?.click();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [visible]);

  // Reset comment when modal closes
  useEffect(() => {
    if (!visible) {
      setComment('');
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="comment-modal-overlay" onClick={handleCancel}>
      <div className="comment-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="comment-modal-header">
          <h2>Add Comment</h2>
          <button className="comment-modal-close" onClick={handleCancel}>×</button>
        </div>

        {/* Content */}
        <div className="comment-modal-body">
          <p className="comment-modal-description">
            Add a comment to your activity log. Perfect for noting timeouts, great plays, or important moments.
          </p>
          
          <div className="comment-input-container">
            <textarea
              ref={textareaRef}
              className="comment-input"
              placeholder="Enter your comment... (try using voice-to-text!)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={maxLength}
              rows={4}
              autoFocus
              inputMode="text"
              autoComplete="off"
              autoCorrect="on"
              spellCheck="true"
            />
            <div className="comment-char-counter">
              {comment.length}/{maxLength}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="comment-modal-actions">
          <button 
            className="comment-cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            className="comment-add-button"
            onClick={handleAddComment}
            disabled={!comment.trim()}
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
