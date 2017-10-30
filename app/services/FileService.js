const { dialog } = require('electron').remote;

export default function openFileFromDialog() {
  return dialog.showOpenDialog({
    title: 'Select a file',
    filters: [
      {
        name: 'Spreadsheets',
        extensions: 'xls|xlsx|xlsm|xlsb|xml|xlw|xlc|csv|txt|dif|sylk|slk|prn|ods|fods|uos|dbf|wks|123|wq1|qpw|htm|html'.split(
          '|',
        ),
      },
    ],
    properties: ['openFile'],
  });
}
