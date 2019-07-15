const FullPageHOC = InputComponent => {
  InputComponent.prototype.componentDidMount = () => {
    document.body.classList.add("background");
  };
  InputComponent.prototype.componentWillUnmount = () => {
    document.body.classList.remove("background");
  };

  return InputComponent;
};

export default FullPageHOC;
