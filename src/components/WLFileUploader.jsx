import { FilePond, registerPlugin } from 'react-filepond'
import { LS_PROJECT_NAME } from '../utils/api'

export default function WLFileUploader(props){
    return (
        <FilePond 
        server={server(props.WLtype, props.WLimageIDsRef)}
        {...props}
        instantUpload={false}
        allowReplace={false}
        allowProcess={false}
        allowFileTypeValidation={true}
        acceptedFileTypes={['image/*']}
        ></FilePond>
    )
}

const server = (type, imageIDsRef) => ({
    process: {
        url: '/api/filepond/upload',
        method: 'POST',
        headers: {
            //form data is not available when processing with multer so I have to pack 
            //these here
            'x-file-data': encodeURIComponent(btoa(JSON.stringify({
                projectName: encodeURIComponent(localStorage.getItem(LS_PROJECT_NAME)),
                type: type
            })))
        },
        onload: (response) => {
            imageIDsRef.current[type] = response
        }
    },
    load: {
        url: '/api/filepond/load',
        method: 'POST',
        headers: {
            //form data is not available when processing with multer so I have to pack 
            //these here
            'x-file-data': encodeURIComponent(btoa(JSON.stringify({
                projectName: encodeURIComponent(localStorage.getItem(LS_PROJECT_NAME)),
                type: type
            })))
        }
    },
    revert: {
        url: '/api/filepond/remove',
        headers: {
            //form data is not available when processing with multer so I have to pack 
            //these here
            'x-file-data': encodeURIComponent(btoa(JSON.stringify({
                projectName: encodeURIComponent(localStorage.getItem(LS_PROJECT_NAME)),
                type: type
            })))
        },
        onload: (response) => {
            imageIDsRef[type] = null
        }
    }
})