import { Component } from "react";

export class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError(error){
    return { hasError: true}
  }

  componentDidCatch(error, info) {
    console.log(error, info)
  }

  render() {
    if(this.state.hasError) {
      return(
        <div>Something went wrong
          <button onClick={() => window.location.reload()}>Reload page</button>
        </div>
      )
    }
    return this.props.children
  }
}