import { useEffect, useState } from "react";
import { UpdateUserRole } from "../Auth";
import { SelectField, AlertBox, InputField } from "../Form";
import { Avatar } from '../View';
import axios from "axios";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const filterOpts = {
        'created_asc': 'Created ASC',
        'created_desc': 'Created DESC',
        'modified_asc': 'Modified ASC',
        'modified_desc': 'Modified DESC',
        'verified_asc': 'Verified ASC',
        'verified_desc': 'Verified DESC',
    };
    const filterQuerys = {
        'created_asc': '&sort[created_at]=ASC',
        'created_desc': '&sort[created_at]=DESC',
        'modified_asc': '&sort[updated_at]=ASC',
        'modified_desc': '&sort[updated_at]=DESC',
        'verified_asc': '&sort[email_verified_at]=ASC',
        'verified_desc': '&sort[email_verified_at]=DESC',
    }

    const getUsers = (nextPage = false) => {
        let requestUrl = nextPage ? pagination.next_page_url 
        : 'api/users?paginate=10';
        let requestUrlParams = '';
        if (search.length > 2 && nextPage === false) requestUrlParams += '&name=' + search
        if (selectedFilter.length > 4) requestUrlParams += filterQuerys[selectedFilter];
        axios.getRequest(requestUrl + requestUrlParams, (r) => {
            if (nextPage) setUsers([...users, ...r.data.data])
            else setUsers([...r.data.data])
            setPagination(r.data)
        })
    }

    const handleLoadMore = () => {
        getUsers(true);
    }

    useEffect(() => {
        getUsers();
    }, [selectedFilter]);

    useEffect(() => {
        if (search.length > 2) {
            getUsers();
        }
    }, [search]);

    return (<div className="container">
        <div className="row mb-4 mt-1">
            <div className="col-auto"><h1>Users</h1></div>
        </div>

        <div className="row mb-5 g-3">
            <div className="col-12 col-sm-6 col-lg-3">
                <InputField name="search" value={search} setValue={(e) => { setSearch(e.target.value) }} title="Search..." />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
                <SelectField name="selected_filter" value={selectedFilter} setValue={(e) => { setSelectedFilter(e.target.value) }} title="Sort" options={filterOpts} />
            </div>
        </div>

        <AlertBox />

        {users && users.length &&
            <div className="users row mb-4 g-4">
                {users.map(item =>
                    <div key={item.id} className="col-12">
                        <div className="user__item px-3 py-2 x-expand">
                            <div className="row">

                                <div className="col-6">
                                    <div className="row row-cols-1 row-cols-lg-3">
                                        <div className="col">
                                            <div className="user__value mb-2"><Avatar user={item} size="75" /></div>
                                            <div className="user__value mb-2">{item.name}</div>
                                        </div>

                                        <div className="col">
                                            <div className="user__value mb-2"><UpdateUserRole item={item} /></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-3">
                                    <div className="row row-cols-1 row-cols-lg-1">
                                        <div className="col">
                                            <div className="user__label pb-0 text-muted">Created</div>
                                            <div className="user__value mb-2">{new Date(item.created_at).toLocaleDateString()}</div>
                                        </div>

                                        <div className="col">
                                            <div className="user__label pb-0 text-muted">Verified</div>
                                            <div className="user__value mb-2">{new Date(item.email_verified_at).toLocaleDateString()}</div>
                                        </div>
                                        
                                    </div>
                                </div>

                                <div className="col-3">
                                    <div className="row row-cols-1 row-cols-lg-1">
                                        <div className="col">
                                            <div className="user__label pb-0 text-muted">Timezone</div>
                                            <div className="user__value mb-2">{item.timezone}</div>
                                        </div>

                                        <div className="col">
                                            <div className="user__label pb-0 text-muted">Modified</div>
                                            <div className="user__value mb-2">{new Date(item.updated_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        }

        { pagination.next_page_url &&
            <div className="row justify-content-center">
                <div className="col text-center">
                    <button type="button" className="btn btn-primary" onClick={handleLoadMore} aria-label="Load more users">
                        <i className="bi bi-chevron-compact-down fs-4 mx-5"></i>
                    </button>
                </div>
            </div>
        }
    </div>);
}