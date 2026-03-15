import Select from "react-select";

export default function WLSelect(props){
    const style = {
      color: "var(--text-color)",
      backgroundColor: "var(--menu-color)"
    }

    return (
        <Select 
          {...props}
          style={style}
          styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: "var(--menu-color)",
                color: "var(--text-color)",
                border: "1px solid var(--text-color)",
              }),
              menu: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: "var(--menu-color)",
                color: "var(--text-color)"
              }),                          
              singleValue: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: "var(--menu-color)",
                color: "var(--text-color)"
              }),   
              option: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: state.isSelected ? "var(--accent)" : state.isFocused ?
                "var(--accent)": "var(--menu-color)",
                filter: state.isFocused ? "brightness(80%)" : "brightness(100%)",
                color: "var(--text-color)",
              })
          }}
        ></Select>
    )
}