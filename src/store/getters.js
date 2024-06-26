const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  isTeacher: state => state.user.isTeacher,
  userId: state => state.user.userId
}
export default getters
