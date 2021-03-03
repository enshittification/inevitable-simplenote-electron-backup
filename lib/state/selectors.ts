import * as S from './';
import * as T from '../types';
import { tagHashOf } from '../utils/tag-hash';

/**
 * "Narrow" views hide the note editor
 *
 * @see _variables.scss for 750 constant as $single-column value
 */
export const isSmallScreen: S.Selector<boolean> = (state) =>
  state.browser.windowWidth <= 750;

export const getTheme: S.Selector<'light' | 'dark'> = (state) =>
  state.settings.theme === 'system'
    ? state.browser.systemTheme
    : state.settings.theme;

export const notesAreEqual = (
  a: T.Note | undefined,
  b: T.Note | undefined
): boolean =>
  !!(
    a &&
    b &&
    a.content === b.content &&
    a.creationDate === b.creationDate &&
    a.modificationDate === b.modificationDate &&
    !!a.deleted === !!b.deleted &&
    a.publishURL === b.publishURL &&
    a.shareURL === b.shareURL &&
    a.tags.length === b.tags.length &&
    a.systemTags.length === b.systemTags.length &&
    a.tags.every((tag) => b.tags.includes(tag)) &&
    a.systemTags.every((tag) => b.systemTags.includes(tag))
  );

export const noteHasPendingChanges: S.Selector<boolean> = (
  state,
  noteId: T.EntityId
) =>
  !notesAreEqual(
    state.data.notes.get(noteId),
    state.simperium.ghosts[1].get('note')?.get(noteId)?.data
  );

export const shouldShowEmailVerification: S.Selector<boolean> = ({
  data: { accountVerification: status },
}) => status === 'unverified' || status === 'pending';

export const openedTag: S.Selector<T.TagName | undefined> = ({
  ui: { showCollection },
}) => (showCollection.type === 'tag' && showCollection.tagName) || undefined;

export const openedTagHash: S.Selector<T.TagHash | undefined> = (state) => {
  const ot = openedTag(state);
  return (ot && tagHashOf(ot)) || undefined;
};

export const showTrash: S.Selector<boolean> = ({ ui: { showCollection } }) =>
  showCollection.type === 'trash';
