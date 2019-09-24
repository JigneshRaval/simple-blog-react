import React, { useState, useEffect } from 'react';

export const CreateBookmarkFormComponent = (props: any) => {

    let originalState: any;

    const [formState, updateFormState] = useState({
        id: props.editData._id || '',
        dateCreated: props.editData.dateCreated || new Date().getTime(),
        txtPostTitle: props.editData.title || '',
        txtCategory: props.editData.category || 'JavaScript',
        txtTags: (props.editData.tags) ? props.editData.tags.join() : 'JavaScript, ES6',
        txtWebsiteUrl: props.editData.sourceUrl || '',
        txtareaDescription: props.editData.description
    })

    useEffect(() => {
        originalState = formState;

        updateFormState({
            ...formState,
            id: props.editData._id || '',
            dateCreated: props.editData.dateCreated || new Date().getTime(),
            txtPostTitle: props.editData.title || '',
            txtCategory: props.editData.category || 'JavaScript',
            txtTags: (props.editData.tags) ? props.editData.tags.join() : 'JavaScript, ES6',
            txtWebsiteUrl: props.editData.sourceUrl || '',
            txtareaDescription: props.editData.description
        });

    }, [props.editData._id])


    const handleInputChange = (event: any) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        updateFormState({
            ...formState,
            [name]: value
        });
    }

    // Handle Html to Markdown form submit
    const handleSubmit = (event: any) => {
        event.preventDefault();

        // Syntax : var formData = new FormData(form)
        // Ref : https://medium.com/@everdimension/how-to-handle-forms-with-just-react-ac066c48bd4f
        const form = event.target;
        const formData = new FormData(form);

        // Tags
        let tags: any = formData.get('txtTags');
        if (tags) {
            tags = tags.split(',');
        }

        // FrontMatter Object
        const formDataObject = {
            date: new Date(),
            title: formData.get('txtPostTitle'),
            sourceUrl: formData.get('txtWebsiteUrl'),
            category: formData.get('txtCategory'),
            tags: tags,
            dateCreated: formState.dateCreated,
            description: formData.get('txtareaDescription'),
            type: 'bookmark'
        }

        const formDataObj = {
            ...formDataObject
        }

        // Submit response to server
        // =====================================
        if (props.isEditMode) {
            props.onEditSaveBookmark(formState.id, formDataObj);
            form.reset();
        } else {
            props.onCreateBookmark(formDataObj);
            form.reset();
        }

    }

    const handleReset = (event: any) => {
        event.preventDefault();
        const form: HTMLFormElement = document.querySelector('#formCreateEditBookmark');
        form.reset();
        updateFormState(originalState);
    }

    return (
        <div className="modal fade" id="modal-bookmarks" role="dialog" aria-labelledby="modal-bookmarks_Title" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-full" role="document">
                <div className="modal-content">
                    <div className="modal-header">

                        <h2 className="modal-title" id="modal-bookmarks_Title">
                            {
                                props.isEditMode ? 'Edit Bookmark' : 'Create New Bookmark'
                            }
                        </h2>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <form name="formCreateEditBookmark" id="formCreateEditBookmark" method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="modal-body">

                            <div className="form-row">

                                {/* START Column */}
                                <div className="col-6 col-sm-12 col-md-12 col-lg-6">

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="txtPostTitle">Title</label>
                                        <input type="text" className="form-control" name="txtPostTitle" id="txtPostTitle" placeholder="Post Title" onChange={handleInputChange} value={formState.txtPostTitle} required />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="txtWebsiteUrl">Website URL</label>
                                        <input type="text" className="form-control" name="txtWebsiteUrl" id="txtWebsiteUrl" placeholder="Website URL" onChange={handleInputChange} value={formState.txtWebsiteUrl} required />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="txtCategory">Category</label>
                                        <select value={formState.txtCategory} className="form-control" name="txtCategory" id="txtCategory" onChange={handleInputChange}>
                                            {
                                                props.categories.map((category: any) => {
                                                    return <option key={category.id} value={category.name}>{category.name}</option>
                                                })
                                            }
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="txtTags">Tags</label>
                                        <input type="text" className="form-control" name="txtTags" id="txtTags" placeholder="Tags" onChange={handleInputChange} value={formState.txtTags} />
                                    </div>

                                </div>
                                {/* END Column */}

                                {/* START Column */}
                                <div className="col-6 col-sm-12 col-md-12 col-lg-6">

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="txtareaDescription">Description</label>
                                        <textarea className="form-control" rows={10} name="txtareaDescription" id="txtareaDescription" onChange={handleInputChange} value={formState.txtareaDescription}></textarea>
                                    </div>

                                </div>
                                {/* END Column */}

                            </div>

                        </div>

                        <div className="modal-footer">
                            <button id="convertToMarkdown" className="btn btn-primary">
                                {
                                    props.isEditMode ? 'Update Bookmark' : 'Save Bookmark'
                                }
                            </button>
                            <button id="btnResetConvertForm" className="btn btn-secondary" onClick={handleReset}>Reset Form</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>

    )

}
