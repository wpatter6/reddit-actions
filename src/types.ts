import {
  CommentStream,
  InboxStream,
  SnooStormOptions,
  SubmissionStream,
} from 'snoostorm'
import Snoowrap, {
  Comment,
  PrivateMessage,
  SnoowrapOptions,
  Submission,
} from 'snoowrap'

export type RedditActionStreams = SubmissionStream | CommentStream | InboxStream

export type RedditActionData = Submission | Comment | PrivateMessage

export type RedditAction<T extends RedditActionData> = (result: T) => any

export interface RedditActionFilters {
  users?: string[]
  urls?: string[]
  titles?: string[]
}

interface RedditActionSettingsBase extends RedditActionFilters {
  subreddits: string[]
}

export interface RedditActionSettings extends RedditActionSettingsBase {
  settings: SnooStormOptions
}

export interface RedditInboxActionSettings extends RedditActionSettingsBase {
  settings: SnooStormInboxOptions
}

export type StreamClass = new (
  client: Snoowrap,
  options?: SnooStormOptions | SnooStormInboxOptions,
) => RedditActionStreams

export interface SnooStormInboxOptions {
  filter:
    | 'inbox'
    | 'unread'
    | 'messages'
    | 'comments'
    | 'selfreply'
    | 'mentions '
  pollTime: number
}

export const CreateStream = <
  T extends SnooStormOptions | SnooStormInboxOptions
>(
  type: StreamClass,
  client: Snoowrap,
  options?: T,
) => {
  return new type(client, options)
}
