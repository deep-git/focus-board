import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { User } from 'lucide-react'

const UserAvatar = ({ sessionImage }: { sessionImage: string | null | undefined }) => {
    return (
        <Avatar>
            <AvatarImage src={sessionImage === null ? "" : sessionImage} />
            <AvatarFallback className="bg-purple-1">
                <User className="w-5 h-5 text-white" />
            </AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar