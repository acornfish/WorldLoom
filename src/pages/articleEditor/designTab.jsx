
export default function DesignTab ({selectedTab}){
  const index = 2
  return (
    <div className={"tab design-tab " + (selectedTab==index?"active-tab":"")}  index={index}>
    </div>
  )
}