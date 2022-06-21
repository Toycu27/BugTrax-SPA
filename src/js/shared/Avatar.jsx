import React, { useContext } from 'react';
import { GlobalContext } from '../';

export default function Avatar({ user, size }) {
    const { fileStoragePath } = useContext(GlobalContext);

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
