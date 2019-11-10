import React from "react"

/* 
 * Component which serves the purpose of a "root route component". 
 */
class Page extends React.Component {
  /**
   * Here, we define a react lifecycle method that gets executed each time 
   * our component is mounted to the DOM, which is exactly what we want in this case
   */
  componentDidMount() {
    const { title } = this.props;
    document.title = title ? `${title} | All System Inventory` : "All System Inventory"
  }

  /**
   * Here, we use a component prop to render 
   * a component, as specified in route configuration
   */
  render() {

    return (
      this.props.children
    )
  }
}

export default Page