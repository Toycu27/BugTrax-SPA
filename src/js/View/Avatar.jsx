import React from 'react';
import { fileStoragePath } from '../../App';

export default function Avatar({ user, size }) {
    return (
        <img
            className="rounded-circle"
            height={`${size}px`}
            width={`${size}px`}
            src={user.avatar_path ? fileStoragePath + user.avatar_path : `https://i.pravatar.cc/${size}?img=${user.id}`}
            alt={user.name}
        />
    );
}
