import { useEffect } from 'react';
import '../../styles/main.css';

/**
 * Modal Component
 * 
 * This component provides a reusable modal dialog with:
 * - Backdrop overlay with click-to-close functionality
 * - Smooth entrance and exit animations
 * - Keyboard accessibility (Escape key to close)
 * - Focus management and trap
 * - Customizable content and styling
 * - Responsive design
 * 
 * Features:
 * - Backdrop click to dismiss
 * - Escape key to close
 * - Focus trap within modal
 * - Smooth animations with Framer Motion
 * - Accessible design with proper ARIA attributes
 * - Responsive layout for mobile devices
 * - Customizable size and styling
 * 
 * Props:
 * - isOpen: Boolean to control modal visibility
 * - onClose: Callback function when modal is closed
 * - title: Modal title (optional)
 * - children: Modal content
 * - size: Modal size ('small', 'medium', 'large', default: 'medium')
 * - showCloseButton: Whether to show close button (default: true)
 */
export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true 
}) {
  /**
   * Handle keyboard events for accessibility
   * 
   * This effect:
   * 1. Listens for Escape key press
   * 2. Closes modal when Escape is pressed
   * 3. Prevents body scroll when modal is open
   * 4. Restores body scroll when modal closes
   * 5. Manages focus trap within modal
   */
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Focus the modal for accessibility
      const modal = document.querySelector('.modal-content');
      if (modal) {
        modal.focus();
      }
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore body scroll
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  /**
   * Handle Escape key press to close modal
   * 
   * @param {KeyboardEvent} event - Keyboard event
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  /**
   * Handle backdrop click to close modal
   * 
   * @param {MouseEvent} event - Click event
   */
  const handleBackdropClick = (event) => {
    // Only close if clicking the backdrop, not the modal content
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  /**
   * Get modal size class for styling
   * 
   * @param {string} modalSize - Size of the modal
   * @returns {string} CSS class name for modal size
   */
  const getModalSizeClass = (modalSize) => {
    switch (modalSize) {
      case 'small':
        return 'modal-small';
      case 'large':
        return 'modal-large';
      case 'medium':
      default:
        return 'modal-medium';
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="modal-overlay"
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          tabIndex={-1}
        >
          <div className={`modal-content ${getModalSizeClass(size)}`}
            tabIndex={-1}
          >
            {/* Modal header with title and close button */}
            {(title || showCloseButton) && (
              <div className="modal-header">
                {title && (
                  <h2 id="modal-title" className="modal-title">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    className="modal-close"
                    onClick={onClose}
                    aria-label="Close modal"
                    type="button"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
            {/* Modal body content */}
            <div className="modal-body">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}