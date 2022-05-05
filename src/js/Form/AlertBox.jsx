import { useUser } from '../Auth';

export default function AlertBox() {
    const { getMessage } = useUser();
    let message = getMessage();

    if (message) {
        return (
            <div className="alert alert-success d-flex align-items-center" role="alert">
                <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"></svg>
                <div>{message}</div>
            </div>
        );
    } else {
        return;
    }
}