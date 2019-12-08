import { Comment, PrivateMessage, Submission } from 'snoowrap'
import { RedditAction, RedditActionData, RedditActionFilters } from './types'

const seenPosts = [] as string[]

const dataTriggersAction = (
  data: RedditActionData,
  urlReg: RegExp,
  titleReg: RegExp,
  users: string[],
  checkUser = true,
) =>
  !seenPosts.includes(data.id) &&
  (!checkUser || !users.length || users.includes(data.author.name)) &&
  (!(data as Submission).url ||
    submissionTriggersAction(data as Submission, urlReg, titleReg))

const submissionTriggersAction = (
  submission: Submission,
  urlReg: RegExp,
  titleReg: RegExp,
) => urlReg.test(submission.url) && titleReg.test(submission.title)

const getAction = <T extends Submission | Comment | PrivateMessage>(
  onAction: RedditAction<T>,
  { urls = [], titles = [], users = [] }: RedditActionFilters = {},
) => {
  const urlReg = new RegExp(urls.join('|'))
  const titleReg = new RegExp(titles.join('|'))

  return (data: T) => {
    if (dataTriggersAction(data, urlReg, titleReg, users)) {
      seenPosts.push(data.id)
      onAction(data)
    }
  }
}

export default getAction
