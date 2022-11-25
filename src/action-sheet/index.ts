import { ActionSheet, ActionSheetOptions } from './action-sheet';
import './index.css';

export * from './action-sheet';

export const actionSheet = new ActionSheet();

export const showActionSheet = (options: ActionSheetOptions) => {
  actionSheet.show(options);
};
