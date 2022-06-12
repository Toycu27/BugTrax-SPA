import { fileStoragePath } from '../../App.js';

export default function Avatar ({user, size}) {

    return (
        <img 
            className="rounded-circle border border-1"
            height={size + 'px'}
            width={size + 'px'}
            src={user.avatar_path ? fileStoragePath + user.avatar_path : "https://i.pravatar.cc/" + size + "?img=" + user.id} 
            alt={"Profile picture of " + user.name} 
        />
    );
}