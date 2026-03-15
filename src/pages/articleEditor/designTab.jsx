import 'filepond/dist/filepond.min.css'
import WLFileUploader from "../../components/WLFileUploader"
import { useRef } from 'react'
import { useEffect } from 'react'

export default function DesignTab ({selectedTab, imageIDs, getDesignRef}){
  const index = 2
  const bannerUploadRef = useRef()
  const thumbnailUploadRef = useRef()
  const imageIDsRef = useRef({})

  getDesignRef.current = async () => {
    await bannerUploadRef.current.processFiles()
    await thumbnailUploadRef.current.processFiles()

    return imageIDsRef.current
  }

  useEffect(() => {
    imageIDsRef.current = imageIDs
  }, [imageIDs])

  return (
    <div className={"tab design-tab " + (selectedTab==index?"active-tab":"")}  index={index}>
        <form action="" className="filepond-form"> 
          <div className="prompt-container">
            <h2 className="thumbnail-prompt-title prompt-label">Thumbnail (not implemented)</h2>
            <WLFileUploader className="thumbnail-prompt" WLtype="thumbnail" 
            WLimageIDsRef={imageIDsRef} ref={thumbnailUploadRef} 
            files={                
              imageIDsRef.current["thumbnail"] ? [{
                  source: imageIDsRef.current["thumbnail"],
                  options: {
                      type: 'local',
                  },
              }] : []
            }
            ></WLFileUploader>
          </div>
          <div className="prompt-container">
            <h2 className="banner-prompt-title prompt-label">Banner (9:1)</h2>
            <WLFileUploader className="banner-prompt" WLtype="banner" 
            WLimageIDsRef={imageIDsRef} ref={bannerUploadRef}
            files={                
              imageIDsRef.current["banner"] ? [{
                  source: imageIDsRef.current["banner"],
                  options: {
                      type: 'local',
                  },
              }] : []
            }
            ></WLFileUploader>
          </div>
        </form>
    </div>
  )
}