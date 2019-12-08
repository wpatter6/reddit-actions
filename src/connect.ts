import { CommentStream, InboxStream, SubmissionStream } from 'snoostorm'
import Snoowrap, { Comment, PrivateMessage, Submission } from 'snoowrap'
import GetAction from './action'
import {
  CreateStream,
  RedditActionData,
  RedditActionSettings,
  RedditInboxActionSettings,
  StreamClass,
} from './types'

const doAction = <T extends RedditActionData>(
  actionSettings: RedditActionSettings,
  // TODO: Properly set up
  onAction: (data: T) => any,
  streamClass: StreamClass,
) => {
  const {
    credentials,
    settings,
    subreddits,
    urls,
    titles,
    users,
  } = actionSettings
  const client = new Snoowrap(credentials)
  const action = GetAction<T>({ urls, titles, users }, onAction)
  return subreddits.map(subreddit =>
    CreateStream(streamClass, client, {
      subreddit,
      ...settings,
    }).on('item', action),
  )
}
// export type RedditActionStreams = SubmissionStream | CommentStream | InboxStream

export const SubmissionAction = (
  actionSettings: RedditActionSettings,
  onAction: (data: Submission) => any,
) => {
  doAction<Submission>(actionSettings, onAction, SubmissionStream)
}

export const CommentAction = (
  actionSettings: RedditActionSettings,
  onAction: (data: Comment) => any,
) => {
  doAction<Comment>(actionSettings, onAction, CommentStream)
}

export const InboxAction = (
  actionSettings: RedditInboxActionSettings,
  onAction: (data: PrivateMessage) => any,
) => {
  doAction<PrivateMessage>(actionSettings, onAction, InboxStream as any) // TODO: maybe do this better
}

export default SubmissionAction
