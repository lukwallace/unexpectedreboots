window.getUsername = () => {
  return document.cookie.split('=')[1];
}