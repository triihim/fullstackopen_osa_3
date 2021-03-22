export const NotificationType = Object.freeze({
    ERROR: 1,
    SUCCESS: 2
  })
  
export const Notification = ({content}) => {
    const isShown = content.isShown;
    const type = content.type;
    const message = content.message;
  
    if(!isShown) return null;
  
    const isError = () => type === NotificationType.ERROR;
  
    const style = {
      background: isError() ? "pink" : "lightgreen",
      color: isError() ? "red" : "green",
      borderColor: isError() ? "red" : "green",
      border: "1px solid"
    };
  
    return (
      <div style={style}>
        <p>{message}</p>
      </div>
    );
}