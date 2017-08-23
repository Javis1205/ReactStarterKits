
export const updateHistoryLog = (user, relatedUser, title, content) => {
  user.logList.push({
    date: new Date(),
    relatedUser,
    isRead: false,
    content,
    title,
    id: `${user.username}${relatedUser}${Date.now()}`
  })
  user.save()
}