import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../Auth';
import { TextareaField } from '../Form';
import { Avatar } from '../View';

export default function CommentForm({ bugId, milestoneId, projectId }) {
    const { user } = useContext(GlobalContext);

    const [openCommentForm, setOpenCommentForm] = useState(false);
    const [comments, setComments] = useState([]);

    const defaultValues = {
        bug_id: bugId,
        milestone_id: milestoneId,
        project_id: projectId,
        message: '',
    };
    const defaultErrors = {
        bug_id: null,
        milestone_id: null,
        project_id: null,
        message: null,

    };
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState(defaultErrors);

    const handleChange = (e) => {
        setValues((oldValues) => ({
            ...oldValues,
            [e.target.name]: e.target.value,
        }));
    };

    const fetchComments = () => {
        let addParams = '';
        if (bugId) addParams += `bug_id=${bugId}`;
        if (milestoneId) addParams += `milestone_id=${milestoneId}`;
        if (projectId) addParams += `project_id=${projectId}`;
        axios.getRequest(`api/comments?with=user&${addParams}`, (r) => { setComments(r.data.data); });
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleDelete = async (id) => {
        await axios.deleteRequest(`api/comments/${id}`);
        fetchComments();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.postRequest('api/comments/', values);

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
        } else {
            fetchComments();
            setErrors({ ...defaultErrors });
            setValues({ ...defaultValues });
        }
    };

    return (
        <div className="row">
            <div className="col-12 col-lg-6">
                <div className="row mb-4 mt-6">
                    <div className="col-auto">
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => { setOpenCommentForm(true); }}
                            aria-label="Show Comment Form"
                        >
                            <i className="bi bi-plus fs-4" />
                        </button>
                    </div>
                    <div className="col-auto"><h2>Comments</h2></div>
                </div>

                {openCommentForm && (
                    <form onSubmit={handleSubmit} className="needs-validation mb-4">
                        <div className="row align-items-end">
                            <div className="col-auto">
                                <Avatar user={user} size="100" />
                            </div>
                            <div className="col px-2 pe-0">
                                <TextareaField
                                    type="text"
                                    name="message"
                                    value={values.message}
                                    errorValue={errors.message}
                                    setValue={handleChange}
                                    title="Your Message to this Topic!"
                                    expand={false}
                                />
                            </div>
                            <div className="col-auto">
                                <button className="btn btn-primary btn-lg" type="submit">Post</button>
                            </div>
                        </div>
                    </form>
                )}

                {(comments ?? comments.length) && (
                    <div className="row">
                        {comments.map((item) => (
                            <div key={item.id} className="row pe-0 mb-4 align-items-end">
                                <div className="col-auto">
                                    <Avatar user={item.user} size="100" />
                                </div>
                                <div className="comment__item col ms-2 pt-2 bg-light bg-opacity-50 x-expand">
                                    <figure>
                                        <figcaption className="blockquote-footer text-muted">
                                            {new Date(item.created_at).toLocaleDateString()}
                                            {' '}
                                            {item.user.name}
                                        </figcaption>
                                        <blockquote className="blockquote fs-6">
                                            <p>{item.message}</p>
                                        </blockquote>
                                    </figure>
                                </div>
                                {item.user_id === user.id && (
                                    <div className="col-auto pe-0">
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-lg"
                                            onClick={() => { handleDelete(item.id); }}
                                            aria-label="Delete Comment"
                                        >
                                            <i className="bi bi-x-lg" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
