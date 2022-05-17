import { fileStoragePath } from '../../App.js';
import { useState, useEffect } from "react";
import { useUser } from '../Auth';
import { TextareaField } from ".";
import axios from "axios";

export default function CommentForm ({bug_id}) {
    const { user, addMessage } = useUser();

    const handleChange = e => {
        setValues(oldValues => ({
          ...oldValues,
          [e.target.name]: e.target.value
        }));
    }

    const [ openCommentForm, setOpenCommentForm ] = useState(false);
    const [ comments, setComments ] = useState([]);

    //Form values
    const defaultValues = {
        bug_id: bug_id,
        message: '',
    };
    const defaultErrors = {
        bug_id: null,
        message: null,

    };
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState(defaultErrors);

    const fetchComments = () => {
        axios.getRequest('api/comments?with=user&bug_id=' + bug_id, (r) => { setComments(r.data.data) });
    }

    useEffect(() => {
        fetchComments();
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        let response;

        response = await axios.postRequest('api/comments/', values);

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
        } else {
            fetchComments();
            setErrors({ ...defaultErrors });
            setValues({ ...defaultValues });
        }
    }

    return (
    <div className="row">
        <div className="col-6">
            <div className="row mb-4 mt-6">
                <div className="col-auto">
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => {setOpenCommentForm(true)}}>
                        <i className="bi bi-plus fs-4"></i>
                    </button>
                </div>
                <div className="col-auto"><h3>Comments</h3></div>
            </div>

            { openCommentForm ?
            <form onSubmit={handleSubmit} className="needs-validation mb-4">
                <div className="row align-items-end">
                    <div className="col-md-auto">
                        <img className="rounded-circle border border-2" height="100px" width="100px" src={user.avatar_path ? fileStoragePath + user.avatar_path : "https://i.pravatar.cc/100?img=" + values.id} />
                    </div>
                    <div className="col px-2">
                        <TextareaField type="text" name="message" value={values.message} errorValue={errors.message} setValue={handleChange} title="Your Message to this Topic!" expand={false} />
                    </div>
                    <div className="col-md-auto">
                        <button className="btn btn-primary btn-lg" type="submit">Submit</button>
                    </div>
                </div>
            </form>
            : null }

            { comments ?? comments.length ?
                <div className="row">
                    { comments.map(item => 
                        <div className="row pe-0 mb-4">
                            <div className="col-md-auto">
                                <img className="rounded-circle border border-2" height="100px" width="100px" src={item.user.avatar_path ? fileStoragePath + item.user.avatar_path : "https://i.pravatar.cc/100?img=" + item.user.id } />
                            </div>
                            <div className="col ms-2 pt-2 bg-light bg-opacity-50">
                                <figure>
                                    <figcaption class="blockquote-footer text-dark">
                                        {new Date(item.created_at).toLocaleDateString()} { item.user.name }
                                    </figcaption>
                                    <blockquote class="blockquote fs-6">
                                        <p>{ item.message }</p>
                                    </blockquote>
                                </figure>
                            </div>
                        </div>    
                    )}
                </div>
            :
                <div className="row">
                    <h5>No Comments for this Topic yet...</h5>
                </div> 
            }

        </div>
    </div>
    );
} 