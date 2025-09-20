import React, { useState, useRef } from 'react';
import type { Project, Design, NewComment } from '../types';
import Header from './Header';
import InfoIcon from './icons/InfoIcon';

interface DesignFeedbackScreenProps {
  project: Project;
  design: Design;
  onAddComment: (designId: string, comment: NewComment) => void;
  onAddGeneralComment: (designId: string, comment: string) => void;
  onBackToBoards: () => void;
}

const CommentInputBox: React.FC<{
  x: number;
  y: number;
  onSave: (text: string) => void;
  onCancel: () => void;
}> = ({ x, y, onSave, onCancel }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (text.trim()) {
      onSave(text.trim());
    }
  };

  return (
    <div
      className="absolute z-20 p-3 bg-white rounded-lg shadow-2xl border border-gray-300 flex flex-col space-y-2"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, 10px)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add your comment..."
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        className="w-64 h-20 p-2 bg-gray-800 border border-gray-600 rounded-md text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 resize-none"
      />
      <div className="flex justify-end space-x-2">
         <button onClick={onCancel} className="text-xs text-gray-600 px-3 py-1 rounded hover:bg-gray-100">Cancel</button>
        <button
          onClick={handleSend}
          className="text-xs bg-gray-700 text-white px-4 py-1 rounded-md hover:bg-gray-800 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};


const DesignFeedbackScreen: React.FC<DesignFeedbackScreenProps> = ({ 
    project, 
    design, 
    onAddComment,
    onAddGeneralComment,
    onBackToBoards 
}) => {
    const [newCommentInfo, setNewCommentInfo] = useState<{x: number; y: number} | null>(null);
    const [generalComment, setGeneralComment] = useState('');
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (newCommentInfo) return; // Prevent multiple comment boxes
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setNewCommentInfo({ x, y });
    };

    const handleSaveComment = (text: string) => {
        if (newCommentInfo) {
            onAddComment(design.id, { text, ...newCommentInfo });
            setNewCommentInfo(null);
        }
    };

    const handleSendGeneralComment = () => {
        if (generalComment.trim()) {
            onAddGeneralComment(design.id, generalComment.trim());
            setGeneralComment('');
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title={project.name} subtitle={design.name} />
            <main className="px-4 sm:px-8 md:px-16 pb-16">
                 <p className="text-gray-600 mb-6">Click on the part of the design where you want to add feedback.</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Image Column */}
                    <div className="lg:col-span-2 bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                        <div 
                          ref={imageContainerRef} 
                          className="relative w-full cursor-crosshair"
                          onClick={handleImageClick}
                        >
                            <img src={design.imageUrl} alt={design.name} className="w-full h-auto object-contain" />
                            {design.comments.map((comment, index) => (
                                <div
                                    key={comment.id}
                                    className="absolute w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white"
                                    style={{ left: `${comment.x}%`, top: `${comment.y}%`, transform: 'translate(-50%, -50%)' }}
                                >
                                    {index + 1}
                                </div>
                            ))}
                            {newCommentInfo && (
                                <CommentInputBox
                                    x={newCommentInfo.x}
                                    y={newCommentInfo.y}
                                    onSave={handleSaveComment}
                                    onCancel={() => setNewCommentInfo(null)}
                                />
                            )}
                        </div>
                    </div>
                    {/* Comments Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm space-y-6">
                            <div>
                                <h3 className="font-bold text-gray-800">General comments and suggestions:</h3>
                                <textarea 
                                    value={generalComment}
                                    onChange={(e) => setGeneralComment(e.target.value)}
                                    placeholder="Add general feedback here..."
                                    className="mt-2 w-full h-24 p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 resize-none text-sm"
                                />
                                <button onClick={handleSendGeneralComment} className="mt-2 float-right bg-gray-700 text-white py-2 px-6 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors text-sm">Send</button>
                            </div>
                            
                            <div className="pt-4 clear-both">
                                <h3 className="font-bold text-gray-800 mb-4">Comments on the design:</h3>
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {design.comments.map((comment, index) => (
                                        <div key={comment.id} className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs mt-1">
                                                {index + 1}
                                            </div>
                                            <p className="flex-1 text-sm text-gray-700 bg-gray-100 p-3 rounded-md">{comment.text}</p>
                                        </div>
                                    ))}
                                    {design.generalComments.map((comment, index) => (
                                        <div key={`general-${index}`} className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-1">
                                                <InfoIcon className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <p className="flex-1 text-sm text-gray-700 bg-gray-100 p-3 rounded-md">{comment}</p>
                                        </div>
                                    ))}

                                    {design.comments.length === 0 && design.generalComments.length === 0 && (
                                        <p className="text-sm text-gray-500">No comments yet. Click on the image to add feedback.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                          <button onClick={onBackToBoards} className="bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors">
                            {project.name} Project boards
                          </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DesignFeedbackScreen;