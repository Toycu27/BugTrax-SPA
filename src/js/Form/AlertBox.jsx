import { useUser } from '../Auth';

export default function AlertBox() {
    const { getMessage } = useUser();
    let message = getMessage();

    if (message) {
        return (
            <div className="alert alert-success d-flex align-items-center" role="alert">
                {message}
            </div>
        );
    } else {
        return;
    }
}