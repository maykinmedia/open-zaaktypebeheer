import { titleColumn } from './title';
import { checkBoxColumn } from './checkbox';
import { editColumn } from './edit';
import { defaultColumns } from './default';
import { bulkEditorColumns } from './bulkEditor';
import { linkColumn } from './link';
import { GetGridColIndex } from '../../../types/types';

const gridColIndex: GetGridColIndex = (loading, gridData, zaaktype) => {
  const gridColIndex = {
    title: titleColumn(loading),
    checkbox: checkBoxColumn,
    edit: editColumn(loading, gridData),
    default: defaultColumns(loading, gridData.rows),
    bulkEditor: bulkEditorColumns(loading, zaaktype),
    link: linkColumn(loading, gridData),
  };
  return gridColIndex;
};

export default gridColIndex;
