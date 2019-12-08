import { CommentStream, InboxStream, SubmissionStream } from 'snoostorm'
import Snoowrap, {
  Comment,
  PrivateMessage,
  SnoowrapOptions,
  Submission,
} from 'snoowrap'
import GetAction from './action'
import {
  CreateStream,
  RedditActionData,
  RedditActionSettings,
  RedditInboxActionSettings,
  StreamClass,
} from './types'

const clients = new WeakMap<RedditActionConnection, Snoowrap>()

export default class RedditActionConnection {
  constructor(credentials: SnoowrapOptions) {
    clients.set(this, new Snoowrap(credentials))
  }

  public onSubmission(
    onAction: (data: Submission) => any,
    settings?: RedditActionSettings,
  ) {
    doAction<Submission>(onAction, SubmissionStream, this, settings)
  }

  public onComment(
    onAction: (data: Comment) => any,
    settings?: RedditActionSettings,
  ) {
    doAction<Comment>(onAction, CommentStream, this, settings)
  }

  public onInbox(
    onAction: (data: PrivateMessage) => any,
    settings?: RedditInboxActionSettings,
  ) {
    doAction<PrivateMessage>(onAction, InboxStream as any, this, settings)
  }
}

const doAction = <T extends RedditActionData>(
  onAction: (data: T) => any,
  streamClass: StreamClass,
  connection: RedditActionConnection,
  actionSettings?: RedditActionSettings | RedditInboxActionSettings,
) => {
  const { settings, subreddits } = actionSettings || {}
  const subs = !subreddits || !subreddits.length ? ['all'] : subreddits
  return subs.map(subreddit =>
    CreateStream(streamClass, clients.get(connection)!, {
      subreddit,
      ...settings,
    }).on('item', GetAction<T>(onAction, actionSettings)),
  )
}
