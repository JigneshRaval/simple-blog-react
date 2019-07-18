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
        txtareaDescription: props.editData.htmlCode
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
            txtareaDescription: props.editData.htmlCode
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
            description: formData.get('txtareaDescription')
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
        <div id="modal-bookmarks" className="uk-modal-full" uk-modal="true">
            <div className="uk-modal-dialog uk-modal-body">
                <h2 className="uk-modal-title">
                    {
                        props.isEditMode ? 'Edit Bookmark' : 'Create New Bookmark'
                    }
                </h2>
                <button className="uk-modal-close-full uk-close-large uk-align-right" type="button" uk-close=""></button>

                <form name="formCreateEditBookmark" id="formCreateEditBookmark" method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="uk-grid uk-grid-small">
                        <div className="uk-width-1-2@m">

                            <div className="uk-margin">
                                <label className="form-label" htmlFor="txtPostTitle">Title</label>
                                <input type="text" className="uk-input" name="txtPostTitle" id="txtPostTitle" placeholder="Post Title" onChange={handleInputChange} value={formState.txtPostTitle} required />
                            </div>

                            <div className="uk-margin">
                                <label className="form-label" htmlFor="txtWebsiteUrl">Website URL</label>
                                <input type="text" className="uk-input" name="txtWebsiteUrl" id="txtWebsiteUrl" placeholder="Website URL" onChange={handleInputChange} value={formState.txtWebsiteUrl} required />
                            </div>

                            <div className="uk-margin">
                                <label className="form-label" htmlFor="txtCategory">Category</label>
                                <select value={formState.txtCategory} className="uk-select select" name="txtCategory" id="txtCategory" onChange={handleInputChange}>
                                    {
                                        props.categories.map((category: any) => {
                                            return <option key={category.id} value={category.name}>{category.name}</option>
                                        })
                                    }
                                </select>
                            </div>

                            <div className="uk-margin">
                                <label className="form-label" htmlFor="txtTags">Tags</label>
                                <input type="text" className="uk-input" name="txtTags" id="txtTags" placeholder="Tags" onChange={handleInputChange} value={formState.txtTags} />
                            </div>

                            <div className="uk-width-1-2@m">
                                <div contentEditable id="test" style={{ 'height': '500px', 'whiteSpace': 'pre-wrap', 'overflow': 'auto' }}>
                                </div>
                                <div className="uk-margin">
                                    <label className="form-label" htmlFor="txtareaDescription">Description</label>
                                    <textarea className="uk-textarea" rows={10} name="txtareaDescription" id="txtareaDescription" onChange={handleInputChange} value={formState.txtareaDescription}></textarea>
                                </div>

                            </div>

                        </div>

                    </div>

                    <p className="uk-text-right">
                        <button id="convertToMarkdown" className="uk-button uk-button-primary">
                            {
                                props.isEditMode ? 'Update Bookmark' : 'Save Bookmark'
                            }
                        </button>&nbsp;&nbsp;
                            <button id="btnResetConvertForm" className="uk-button uk-button-default" onClick={handleReset}>Reset Form</button>
                    </p>
                </form>

            </div>
        </div>


    )

}
