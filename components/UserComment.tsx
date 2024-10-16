import { User } from 'lucide-react';
import React from 'react';

interface UserCommentProps {
    comment: {
        text: string;
        name: string;
        position: string;
        colorVal: string;
    }
}

const UserComment = ({ comment }: UserCommentProps) => {
    return (
        <div className="flex flex-col gap-7 rounded-2xl bg-background_accent p-7 h-64">
            <p className="text-[16px] text-black line-clamp-4">{comment.text}</p>

            <div className="flex items-center gap-3 mt-auto">
                <div style={{ backgroundColor: comment.colorVal }} className="flex justify-center items-center w-12 h-12 rounded-full p-1">
                    <User className="w-6 h-6 text-white" />
                </div>

                <div className="flex flex-col">
                    <span className="text-[16px] text-black">{comment.name}</span>
                    <span className="text-[14px] text-light-gray_text">{comment.position}</span>
                </div>
            </div>
        </div>
    )
}

export default UserComment